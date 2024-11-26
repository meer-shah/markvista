        const crypto = require("crypto");
        const axios = require("axios");
        const RiskProfile = require('../models/riskprofilemodal');

        //real account
        // const url = 'https://api.bybit.com';  // API base URL
        // const apiKey = "FdWbqIDBdV5LDOjD5H";  // Your API key
        // const secret = "6i32BfhTK14YbE8OttN6c8uBQXqbhe7C6GYJ";  // Your secret key
        //demo account 
        const url = 'https://api-demo.bybit.com';  // API base URL
        const apiKey = "Y1rRqFvBHiIS3YAlcB";  // Your API key
        const secret = "gB6SF4CKIixKPBtxEKSeA3J1jpYlDmQLwzkN";  // Your secret key

        const recvWindow = 50000;  // Maximum window for receiving the response (in ms)
        const timestamp = Date.now().toString();  // Current timestamp for signing requests

        /**
         * Function to generate the HMAC SHA256 signature
         * @param {string} parameters - The request parameters to be signed.
         * @param {string} secret - The secret key to generate the signature.
         * @returns {string} - The generated signature.
         */
        function getSignature(parameters, secret) {
            return crypto.createHmac('sha256', secret).update(timestamp + apiKey + recvWindow + parameters).digest('hex');
        }

        /**
         * Generalized HTTP request function to interact with Bybit API
         * @param {string} endpoint - The API endpoint to call.
         * @param {string} method - The HTTP method ('GET' or 'POST').
         * @param {string} data - The request payload (or query string for GET requests).
         * @param {string} Info - Information string for logging purposes.
         * @returns {Promise<object>} - The response data from the API call.
         */
        async function http_request(endpoint, method, data, Info) {
            const sign = getSignature(data, secret);  // Generate signature for the request
            let fullendpoint;

            // Construct the full endpoint URL based on the HTTP method
            if (method === "POST") {
                fullendpoint = url + endpoint;
            } else {
                fullendpoint = url + endpoint + "?" + data;
                data = "";
            }

            const headers = {
                'X-BAPI-SIGN-TYPE': '2',
                'X-BAPI-SIGN': sign,
                'X-BAPI-API-KEY': apiKey,
                'X-BAPI-TIMESTAMP': timestamp,
                'X-BAPI-RECV-WINDOW': recvWindow.toString(),
            };

            if (method === "POST") {
                headers['Content-Type'] = 'application/json; charset=utf-8';
            }

            const config = {
                method: method,
                url: fullendpoint,
                headers: headers,
                data: data,
            };

            console.log(Info + " Calling....");
            try {
                const response = await axios(config);  // Make the API request
                console.log(JSON.stringify(response.data));  // Log the response data
                return response.data;  // Return the API response
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message);
                throw new Error("HTTP request failed");
            }
        }

        /**
         * Place a new order using Bybit API
         * @param {object} data - The order data.
         * @returns {Promise<object>} - The response data from the API.
         */
        const placeOrder = async (data) => {
            const orderLinkId = crypto.randomBytes(16).toString("hex");  // Generate a unique order link ID
            data.orderLinkId = orderLinkId;  // Add the order link ID to the request data

            const endpoint = "/v5/order/create";  // API endpoint for creating orders
            return await http_request(endpoint, "POST", JSON.stringify(data), "Create Order");  // Call the API
        };

        /**
     * Function to place an order based on active risk profile conditions.
     * @param {object} data - The initial order data, including symbol, side, and other parameters.
     * @returns {Promise<object>} - The response from the place order API.
     */

        const placeOrderWithRiskProfile = async (data) => {
            try {
                // Fetch the active risk profile
                const riskProfile = await RiskProfile.findOne({ ison: true });
        
                if (!riskProfile) {
                    throw new Error("No active risk profile found.");
                }
        
                console.log("Active Risk Profile:", riskProfile);
        
                // Retrieve the initial risk from the risk profile
                const initialRisk = riskProfile.initialRiskPerTrade;
        
                if (!initialRisk || initialRisk <= 0) {
                    throw new Error("Invalid initial risk in active risk profile.");
                }
        
                // Retrieve account balance (which includes USDT balance)
                const accountBalanceResponse = await getAccountBalance('accountType=UNIFIED');  // Assume this function returns the complete account balance response
                const usdtBalance = getUsdtBalance(accountBalanceResponse); // Extract USDT balance from account balance response
        
                if (usdtBalance <= 0) {
                    throw new Error("Insufficient USDT balance.");
                }
        
                console.log("Available USDT Balance:", usdtBalance);
        
                // Calculate the new order quantity based on the USDT balance
                const riskAmount = (initialRisk / 100) * usdtBalance; // Risk amount in USD (USDT in this case)
                console.log("riskAmount =", riskAmount)
                const orderPrice = parseFloat(data.price); // Order price in USD
                const newQty = (riskAmount / orderPrice).toFixed(3); // Calculate quantity
        
                if (newQty <= 0) {
                    throw new Error("Calculated order quantity is invalid.");
                }
        
                data.qty = newQty; // Update the quantity in the order data
                console.log(`Order quantity adjusted to: ${newQty} based on active risk profile.`);
        
                // Place the order using the modified data
                placeOrder(data);
        
            } catch (error) {
                console.error("Error in placeOrderWithRiskProfile:", error.message);
                throw new Error(`Failed to place order: ${error.message}`);
            }
        };
        //using this function bcz demo doesnot allow single coin balance 
        const getUsdtBalance = (accountBalanceResponse) => {
        // Find the coin object for USDT in the response
        const usdtCoin = accountBalanceResponse?.result?.list?.[0]?.coin?.find(coin => coin.coin === 'USDT');

        // If the USDT coin object exists, return the available balance
        if (usdtCoin) {
            return usdtCoin.availableToWithdraw || 0; // You can also use walletBalance or other fields as needed
        }

        // If no USDT balance is found, return 0
        return 0;
        };

        /**
         * Retrieve the list of unfilled orders
         * @param {string} data - The query string for the request.
         * @returns {Promise<object>} - The response data from the API.
         */
        const getOrderList = async (data) => {
            const endpoint = "/v5/order/realtime";  // API endpoint for fetching orders
            return await http_request(endpoint, "GET", data, "Get Order List");  // Call the API
        };

        /**
         * Cancel an existing order using Bybit API
         * @param {string} orderLinkId - The unique order link ID of the order to cancel.
         * @returns {Promise<object>} - The response data from the API.
         */
        const cancelOrder = async (orderLinkId) => {
            const data = `{"category":"linear","symbol":"BTCUSDT","orderLinkId":"${orderLinkId}"}`;  // Data for cancellation request
            const endpoint = "/v5/order/cancel";  // API endpoint for cancelling orders
            return await http_request(endpoint, "POST", data, "Cancel Order");  // Call the API
        };

        /**
         * Amend an existing order's parameters
         * @param {object} data - The modified order data.
         * @returns {Promise<object>} - The response data from the API.
         */
        const ammendOrder = async (data) => {
            const endpoint = "/v5/order/amend";  // API endpoint for amending orders
            return await http_request(endpoint, "POST", JSON.stringify(data), "Amend Order");  // Call the API
        };

        /**
         * Retrieve position information for a specific symbol
         * @param {string} data - The query string for the request.
         * @returns {Promise<object>} - The response data from the API.
         */
        const getPositionInfo = async (data) => {
            const endpoint = "/v5/position/list";  // API endpoint for position info
            return await http_request(endpoint, "GET", data, "Get Position Info");  // Call the API
        };

        /**
         * Set leverage for a specific symbol
         * @param {object} data - The leverage settings data.
         * @returns {Promise<object>} - The response data from the API.
         */
        const setLeverage = async (data) => {
            const endpoint = "/v5/position/set-leverage";  // API endpoint for setting leverage
            return await http_request(endpoint, "POST", JSON.stringify(data), "Set Leverage");  // Call the API
        };

        /**
         * Switch between Cross and Isolated Margin for a symbol
         * @param {object} data - The margin mode switch data.
         * @returns {Promise<object>} - The response data from the API.
         */
        const switchMarginMode = async (data) => {
            const endpoint = "/v5/position/switch-isolated";  // API endpoint for switching margin mode
            return await http_request(endpoint, "POST", JSON.stringify(data), "Switch Margin Mode");  // Call the API
        };

        // Function to calculate trade metrics
        function calculateTradeMetrics(trades) {
            let totalPnL = 0;
            let totalWinningPnL = 0;
            let totalLosingPnL = 0;
            let winCount = 0;
            let lossCount = 0;

            trades.forEach(trade => {
                const pnl = parseFloat(trade.closedPnl);

                totalPnL += pnl;

                if (pnl > 0) {
                    totalWinningPnL += pnl;
                    winCount++;
                } else if (pnl < 0) {
                    totalLosingPnL += pnl;
                    lossCount++;
                }
            });

            const totalTrades = trades.length;
            const avgTradeOutput = totalTrades > 0 ? totalPnL / totalTrades : 0;
            const avgWinningTrade = winCount > 0 ? totalWinningPnL / winCount : 0;
            const avgLosingTrade = lossCount > 0 ? totalLosingPnL / lossCount : 0;
            const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;

            return {
                totalTrades,
                avgTradeOutput,
                avgWinningTrade,
                avgLosingTrade,
                winRate,
            };
        }

        // Function to find the best and worst trades based on closed PnL
        function findBestAndWorstTrade(trades) {
            let bestTrade = null;
            let worstTrade = null;

            trades.forEach(trade => {
                const pnl = parseFloat(trade.closedPnl);

                if (bestTrade === null || pnl > bestTrade.closedPnl) {
                    bestTrade = { ...trade, closedPnl: pnl };
                }

                if (worstTrade === null || pnl < worstTrade.closedPnl) {
                    worstTrade = { ...trade, closedPnl: pnl };
                }
            });

            return { bestTrade, worstTrade };
        }
        // Function to aggregate PnL by coin and determine top/bottom performers
        function analyzeCoinPerformance(trades) {
            const coinPnL = {};

            // Aggregate PnL by coin
            trades.forEach(trade => {
                const symbol = trade.symbol;
                const pnl = parseFloat(trade.closedPnl);

                if (!coinPnL[symbol]) {
                    coinPnL[symbol] = { totalPnL: 0, totalLoss: 0 };
                }

                coinPnL[symbol].totalPnL += pnl;

                // Track total loss separately
                if (pnl < 0) {
                    coinPnL[symbol].totalLoss += pnl;
                }
            });

            // Convert to an array and sort
            const coinPnLArray = Object.keys(coinPnL).map(symbol => ({
                symbol,
                totalPnL: coinPnL[symbol].totalPnL,
                totalLoss: coinPnL[symbol].totalLoss,
            }));

            // Sort by totalPnL in descending order for best and ascending for worst
            const bestCoins = [...coinPnLArray].sort((a, b) => b.totalPnL - a.totalPnL).slice(0, 5);
            const worstCoins = [...coinPnLArray].sort((a, b) => a.totalPnL - b.totalPnL).slice(0, 5);

            return { bestCoins, worstCoins };
        }

        // Retrieve closed PnL and calculate metrics including top/worst coins
        const getClosedPnl = async (data) => {
            const endpoint = "/v5/position/closed-pnl"; // API endpoint for getting closed PnL
            const response = await http_request(endpoint, "GET", data, "Get Closed PnL"); // Call the API

            if (response && response.result && response.result.list) {
                const trades = response.result.list; // Extract the list of trades
                console.log("Closed PnL Trades:", trades);

                // Calculate trade metrics
                const metrics = calculateTradeMetrics(trades);
                console.log("Trade Metrics:", metrics);

                // Find best and worst trades
                const { bestTrade, worstTrade } = findBestAndWorstTrade(trades);
                console.log("Best Trade:", bestTrade);
                console.log("Worst Trade:", worstTrade);

                // Analyze coin performance
                const { bestCoins, worstCoins } = analyzeCoinPerformance(trades);
                console.log("Top 5 Best Coins:", bestCoins);
                console.log("Top 5 Worst Coins:", worstCoins);

                return { trades, metrics, bestTrade, worstTrade, bestCoins, worstCoins };
            } else {
                console.error("Error: No closed PnL data received.");
                return null;
            }
        };



        /**
         * Retrieve the wallet balance for the account
         * @param {string} data - The query string for the request.
         * @returns {Promise<object>} - The response data from the API.
         */
        const getAccountBalance = async (data) => {
            const endpoint = "/v5/account/wallet-balance";  // API endpoint for getting account balance
            return await http_request(endpoint, "GET", data, "Get Account Balance");  // Call the API
        };

        /**
         * Retrieve the coin balance for the account
         * @param {string} data - The query string for the request.
         * @returns {Promise<object>} - The response data from the API.
         */
        const getCoinBalance = async (data) => {
            const endpoint = "/v5/asset/transfer/query-account-coins-balance";  // API endpoint for getting coin balances
            return await http_request(endpoint, "GET", data, "Get Coin Balance");  // Call the API
        };

        /**
         * Retrieve the balance for a specific coin (e.g., BTC)
         * @param {string} symbol - The coin symbol (e.g., BTC, ETH).
         * @returns {Promise<object>} - The response data from the API.
         */
        const getSingleCoinBalance = async (symbol) => {
            const data = `accountType=UNIFIED&coin=${symbol}`;  // Coin balance request data
            const endpoint = "/v5/asset/transfer/query-account-coins-balance";  // API endpoint for getting single coin balance
            return await http_request(endpoint, "GET", data, `Get ${symbol} Balance`);  // Call the API
        };


        // Example usage function
        async function runTestCase() {
            try {

                const orderData = {
                    category: "linear",
                    symbol: "BTCUSDT",
                    side: "Buy",
                    positionIdx: 0,
                    orderType: "Limit",
                    qty: "0.001",
                    price: "90000",
                    timeInForce: "GTC",
                };
                
                
                placeOrderWithRiskProfile(orderData)
                    .then(response => console.log("Order Response:", response))
                    .catch(error => console.error("Order Error:", error.message));
                
                let leverageData = {
                    category: "linear",
                    symbol: "BTCUSDT",
                    buyLeverage: "20",
                    sellLeverage: "20",
                    tradeMode: 0,  // 0 for Isolated, 1 for Cross
                };

                const leverageResponse = await setLeverage(leverageData);
                console.log("Set Leverage Response:", leverageResponse);

                const marginResponse = await switchMarginMode(leverageData);
                console.log("Switch Margin Mode Response:", marginResponse);

            
                const createdOrder = await placeOrder(orderData);
                console.log("Created Order:", createdOrder);

                const orderlistdata = 'category=linear&settleCoin=USDT';
                const orderList = await getOrderList(orderlistdata);
                console.log("Order List:", orderList);

                const orderLinkId = createdOrder.result.orderLinkId;

                const newOrderData = {
                    category: "linear",
                    symbol: "BTCUSDT",
                    side: "Buy",
                    positionIdx: 0,
                    orderType: "Limit",
                    qty: "0.08",
                    price: "10000",
                    timeInForce: "GTC",
                    orderLinkId: orderLinkId,
                };

                const amendedOrder = await ammendOrder(newOrderData);
                console.log("Amended Order:", amendedOrder);

                const newOrderList = await getOrderList(orderlistdata);
                console.log("Updated Order List:", newOrderList);

                const positionData = 'category=linear&settleCoin=USDT&symbol=BTCUSDT';
                const positionInfo = await getPositionInfo(positionData);
                console.log("Position Info:", positionInfo);

                const cancelResponse = await cancelOrder(orderLinkId);
                console.log("Cancel Order Response:", cancelResponse);

                
                const closedPnlData = 'category=linear';

                // Get closed PnL data and calculate metrics
                const closedPnlResult = await getClosedPnl(closedPnlData);

                if (closedPnlResult) {
                    const { metrics, bestCoins, worstCoins } = closedPnlResult;

                    console.log("Total Trades:", metrics.totalTrades);
                    console.log("Average Trade Output:", metrics.avgTradeOutput.toFixed(2));
                    console.log("Average Winning Trade:", metrics.avgWinningTrade.toFixed(2));
                    console.log("Average Losing Trade:", metrics.avgLosingTrade.toFixed(2));
                    console.log("Win Rate:", metrics.winRate.toFixed(2) + "%");

                    console.log("Top 5 Best Traded Coins:");
                    bestCoins.forEach((coin, index) =>
                        console.log(`${index + 1}. ${coin.symbol}: Total PnL = ${coin.totalPnL.toFixed(2)}`)
                    );

                    console.log("Top 5 Worst Traded Coins:");
                    worstCoins.forEach((coin, index) =>
                        console.log(`${index + 1}. ${coin.symbol}: Total Loss = ${coin.totalLoss.toFixed(2)}`)
                    );
                } else {
                    console.log("No trades available for analysis.");
                }
            
                const balanceData = 'accountType=UNIFIED';
                const accountBalance = await getAccountBalance(balanceData);
                console.log("Account Balance:", accountBalance);

                const coinBalanceData = 'accountType=UNIFIED';
                const coinBalance = await getCoinBalance(coinBalanceData);
                console.log("Coin Balance:", coinBalance);

                const coinSymbol = 'BTC';
                const singleCoinBalance = await getSingleCoinBalance(coinSymbol);
                console.log(`${coinSymbol} Balance:`, singleCoinBalance);

            } catch (error) {
                console.error("Error in TestCase:", error.message);
            }
        }

        // Execute the functions
        runTestCase();

        // Export all functions for use in other parts of the application
        module.exports = {
            placeOrder,
            placeOrderWithRiskProfile, // Included this one for placing orders with risk profile
            getOrderList, // Fetch pending orders
            cancelOrder,
            ammendOrder,
            getPositionInfo, // Active position info
            setLeverage,
            switchMarginMode,
            getClosedPnl, // Trade performance and risk profile conditions
            getAccountBalance, // For user portfolio balance
            getCoinBalance,
            getSingleCoinBalance,
        };
        