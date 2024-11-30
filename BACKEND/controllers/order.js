                const crypto = require("crypto");
                const axios = require("axios");
                const RiskProfile = require('../models/riskprofilemodal');
                const AdjustedRisk = require('../models/riskprofilemodal'); // Import the AdjustedRisk model
                const DailyLoss = require('../models/riskprofilemodal'); ; // Adjust path according to where you defined the model

                //real account
                // const url = 'https://api.bybit.com';  // API base URL
                // const apiKey = "FdWbqIDBdV5LDOjD5H";  // Your API key
                // const secret = "6i32BfhTK14YbE8OttN6c8uBQXqbhe7C6GYJ";  // Your secret key
                //demo account 
                const url = 'https://api-demo.bybit.com';  // API base URL
                const apiKey = "Y1rRqFvBHiIS3YAlcB";  // Your API key
                const secret = "gB6SF4CKIixKPBtxEKSeA3J1jpYlDmQLwzkN";  // Your secret key

                const recvWindow = 750000;  // Maximum window for receiving the response (in ms)
                const timestamp = Date.now().toString();  // Current timestamp for signing requests

            
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

            // Define an array to store adjusted risk values
            let adjustedRiskArray = [];
            
            // Helper to log and throw errors
            const throwError = (message) => {
                console.error(message);
                throw new Error(message);
            };
            
            // Helper function to calculate adjusted risk
            const calculateAdjustedRisk = (lastAdjustedRisk, riskProfile, lastTradeResult) => {
                let adjustedRisk = lastAdjustedRisk;
                const { increaseOnWin = 0, decreaseOnLoss = 0 } = riskProfile;
            
                if (lastTradeResult === "Win") {
                    adjustedRisk += (increaseOnWin / 100) * adjustedRisk;
                    console.log(`Risk increased by ${increaseOnWin}%. New risk: ${adjustedRisk}%`);
                } else if (lastTradeResult === "Loss") {
                    adjustedRisk -= (decreaseOnLoss / 100) * adjustedRisk;
                    console.log(`Risk decreased by ${decreaseOnLoss}%. New risk: ${adjustedRisk}%`);
                }
            
                return Math.max(riskProfile.minRisk || 0, Math.min(adjustedRisk, riskProfile.maxRisk || 100));
            };
            
            // Place a simple order
            const simplePlaceOrder = async (data) => {
                try {
                
                    const orderLinkId = crypto.randomBytes(16).toString("hex");
                    data.orderLinkId = orderLinkId;
            
                    const endpoint = "/v5/order/create";
                    return await http_request(endpoint, "POST", JSON.stringify(data), "Create Order");
                } catch (error) {
                    throwError(`Failed to place a simple order: ${error.message}`);
                }
            };
            
            // Place an order with a risk profile
        // Flag to track if this is the first trade (initial trade)
    // Flag to track if this is the first trade (initial trade)
    let isFirstTrade = true;

    // Track the consecutive wins and losses
    let consecutiveWins = 0;
    let consecutiveLosses = 0;
        const placeOrderWithRiskProfile = async (data) => {
        try {
            // Fetch the active risk profile
            const riskProfile = await RiskProfile.findOne({ ison: true });
            if (!riskProfile) throwError("No active risk profile found.");
    
            console.log("Active Risk Profile:", riskProfile);
    
            // Get reset value from the risk profile
            const resetValue = riskProfile.reset || 10000; // Default to 3 if not provided
            console.log(`Reset value: ${resetValue}`);
    
            // Check if takeProfit and stopLoss are provided
            const { takeProfit, stopLoss, price } = data;
            if (!takeProfit || !stopLoss) {
                throwError("Both takeProfit and stopLoss must be provided to place an order.");
            }
    
            // Calculate the risk-to-reward ratio
            const riskRewardRatio = (takeProfit - price) / (price - stopLoss);
            console.log(`Calculated Risk-to-Reward Ratio: ${riskRewardRatio}`);
    
            // Check the minimum risk-to-reward ratio in the active risk profile
            const minRiskRewardRatio = riskProfile.minRiskRewardRatio || 1; // Default to 1 if not provided
            if (riskRewardRatio < minRiskRewardRatio) {
                throwError(
                    `The calculated risk-to-reward ratio (${riskRewardRatio.toFixed(2)}) is less than the minimum required ratio (${minRiskRewardRatio}). Cannot place the order.`
                );
            }
    
            console.log(`Risk-to-Reward Ratio is acceptable: ${riskRewardRatio.toFixed(2)} >= ${minRiskRewardRatio}`);
    
            // Initial risk validation
            const initialRisk = riskProfile.initialRiskPerTrade;
            if (!initialRisk || initialRisk <= 0) throwError("Invalid initial risk in active risk profile.");
    
            // Check for active orders and exclude StopOrder, tpslOrder, OcoOrder, and BidirectionalTpslOrder
            const orderListResponse = await getOrderList("category=linear&settleCoin=USDT");
    
            const activeOrders = orderListResponse?.result?.list?.filter(order => {
                // Exclude conditional orders like StopLoss and TakeProfit
                return !order.stopOrderType; // Only include orders without a stopOrderType
            });
            
            if (activeOrders?.length > 0) {
                console.warn("Active market/limit orders found. Cannot place a new order.");
                return;
            }
            
    
            // Retrieve account balance
            const accountBalanceResponse = await getAccountBalance("accountType=UNIFIED");
            const usdtBalance = getUsdtBalance(accountBalanceResponse);
            if (usdtBalance <= 0) throwError("Insufficient USDT balance.");
    
            console.log(`USDT Balance: ${usdtBalance}`);
    
            // Closed PnL endpoint
            const pnlendpoint = "/v5/position/closed-pnl";
            const pnlResponse = await http_request(pnlendpoint, "GET", "category=linear", "Get Closed PnL");
    
            let adjustedRisk = initialRisk;
    
            // Check if we need to reset the trade sequence based on consecutive wins/losses
            if (consecutiveWins >= resetValue || consecutiveLosses >= resetValue) {
                console.log("Consecutive wins/losses threshold reached. Resetting to initial risk.");
                isFirstTrade = true; // Treat the next trade as a "first trade"
                consecutiveWins = 0;
                consecutiveLosses = 0;
            }
    
            // If it's the first trade or we need to reset, use only the initial risk
            if (isFirstTrade) {
                console.warn("First trade or reset occurred. Using initial risk.");
            } else if (pnlResponse?.result?.list?.length) {
                const lastTrade = pnlResponse.result.list[0];
                const lastTradeResult = parseFloat(lastTrade.closedPnl) > 0 ? "Win" : "Loss";
    
                // Adjust the risk based on the previous trade result
                adjustedRisk = calculateAdjustedRisk(adjustedRisk, riskProfile, lastTradeResult);
    
                // Track consecutive wins or losses
                if (lastTradeResult === "Win") {
                    consecutiveWins++;
                    consecutiveLosses = 0; // Reset loss streak
                } else {
                    consecutiveLosses++;
                    consecutiveWins = 0; // Reset win streak
                }
            } else {
                console.warn("No closed trades available or it's the first trade. Using initial risk.");
            }
            const minRisk = riskProfile.minRisk || 0;
            const maxRisk = riskProfile.maxRisk || 100;
    
            // Ensure adjusted risk respects min and max bounds
            if (adjustedRisk < minRisk) {
                console.warn(`Adjusted risk (${adjustedRisk}%) is below min risk (${minRisk}%). Using min risk.`);
                adjustedRisk = minRisk;
            }
            if (adjustedRisk > maxRisk) {
                console.warn(`Adjusted risk (${adjustedRisk}%) exceeds max risk (${maxRisk}%). Using max risk.`);
                adjustedRisk = maxRisk;
            }
            console.log(`Final adjusted risk: ${adjustedRisk}%`);

            let symbol = data.symbol
     // Fetch tickers to get precision
    const tickerResponse = await axios.get(
        `https://api-testnet.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`
    );
    const tickerInfo = tickerResponse.data?.result?.list?.[0];
    if (!tickerInfo) throwError(`Ticker information not found for symbol ${symbol}`);

    const bid1Size = parseFloat(tickerInfo.bid1Size);
    if (isNaN(bid1Size)) throwError(`Invalid bid1Size for symbol ${symbol}`);

    // Determine the number of decimals allowed for quantity
    const precision = (bid1Size.toString().split(".")[1] || "").length;
    console.log(`Quantity precision for ${symbol}: ${precision} decimals`);


            // Calculate risk amount and order quantity
            const orderPrice = parseFloat(price);
            const stopLossprice = parseFloat(stopLoss);
            
            const riskPerUnit = orderPrice - stopLossprice;
            
            // Check if risk per unit is zero to avoid division by zero error
            if (riskPerUnit <= 0) {
                throwError("Stop loss price must be less than entry price for long trades, or greater for short trades.");
            }
            
            // Calculate risk amount
            const riskAmount = (adjustedRisk / 100) * usdtBalance;
            
            // Calculate the position size
            const newQty = (riskAmount / riskPerUnit).toFixed(precision);
            
            
            
            if (newQty <= 0) throwError("Calculated order quantity is invalid.");
    
            data.qty = newQty;
            console.log(`Order quantity adjusted to: ${newQty}`);
    
            // Append adjusted risk and place the order
            adjustedRiskArray.push(adjustedRisk);
    
            // After the first trade, set the flag to false so future trades will use the adjusted risk based on previous trades
            isFirstTrade = false;
    
            await simplePlaceOrder(data);
        } catch (error) {
            throwError(`Error in placeOrderWithRiskProfile: ${error.message}`);
        }
    };

   
        
            // Decide which order function to use
            const placeOrder = async (req, res) => {
                try {
                    // Extract data from the request body
                    const data = req.body;
                    
                    console.log("Received order data from frontend:", data);
            
                    // Validate the required fields in the data object
                    const requiredFields = ["symbol", "side", "category", "qty", "orderType", "price", "takeProfit", "stopLoss"];
                    for (const field of requiredFields) {
                        if (!data[field]) {
                            return res.status(400).json({ error: `Missing required field: ${field}` });
                        }
                    }
            
                    // Ensure numeric fields are valid numbers
                    const numericFields = ["price", "qty", "takeProfit", "stopLoss"];
                    for (const field of numericFields) {
                        if (isNaN(parseFloat(data[field]))) {
                            return res.status(400).json({ error: `Invalid numeric value for field: ${field}` });
                        }
                    }
            
                    console.log("Validated order data:", data);
            
                    // Check if a risk profile is active
                    const riskProfile = await RiskProfile.findOne({ ison: true });
                    if (!riskProfile) {
                        console.warn("No active risk profile. Placing a simple order.");
                        await simplePlaceOrder(data); // Place the order without additional risk management
                        return res.status(200).json({ message: "Order placed without risk profile." });
                    } else {
                        console.log("Active risk profile found:", riskProfile);
                        await placeOrderWithRiskProfile(data); // Place the order with risk profile logic
                        return res.status(200).json({ message: "Order placed with risk profile." });
                    }
                } catch (error) {
                    console.error("Error in placeOrder function:", error.message);
                    return res.status(500).json({ error: `Failed to place order: ${error.message}` });
                }
            };
            
            
                
                
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

            
            
                const ammendOrder = async (data) => {
                    const endpoint = "/v5/order/amend";  // API endpoint for amending orders
                    return await http_request(endpoint, "POST", JSON.stringify(data), "Amend Order");  // Call the API
                };

                
                const getPositionInfo = async (data) => {
                    const endpoint = "/v5/position/list";  // API endpoint for position info
                    return await http_request(endpoint, "GET", data, "Get Position Info");  // Call the API
                };

            
                
                const setLeverage = async (data) => {
                    const endpoint = "/v5/position/set-leverage";  // API endpoint for setting leverage
                    return await http_request(endpoint, "POST", JSON.stringify(data), "Set Leverage");  // Call the API
                };

            
                switchMarginMode = async (data) => {
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



                const getAccountBalance = async (data) => {
                    const endpoint = "/v5/account/wallet-balance";  // API endpoint for getting account balance
                    return await http_request(endpoint, "GET", data, "Get Account Balance");  // Call the API
                };

                const getCoinBalance = async (data) => {
                    const endpoint = "/v5/asset/transfer/query-account-coins-balance";  // API endpoint for getting coin balances
                    return await http_request(endpoint, "GET", data, "Get Coin Balance");  // Call the API
                };

               
                const getSingleCoinBalance = async (symbol) => {
                    const data = `accountType=UNIFIED&coin=${symbol}`;  // Coin balance request data
                    const endpoint = "/v5/asset/transfer/query-account-coins-balance";  // API endpoint for getting single coin balance
                    return await http_request(endpoint, "GET", data, `Get ${symbol} Balance`);  // Call the API
                };


                // Example usage function
                // async function runTestCase() {
                //     try {
        
                //         // const closedPnlData = 'category=linear';

                //         // Get closed PnL data and calculate metrics
                //         // const closedPnlResult = await getClosedPnl(closedPnlData);

                //         // if (closedPnlResult) {
                //         //     const { metrics, bestCoins, worstCoins } = closedPnlResult;

                //         //     console.log("Total Trades:", metrics.totalTrades);
                //         //     console.log("Average Trade Output:", metrics.avgTradeOutput.toFixed(2));
                //         //     console.log("Average Winning Trade:", metrics.avgWinningTrade.toFixed(2));
                //         //     console.log("Average Losing Trade:", metrics.avgLosingTrade.toFixed(2));
                //         //     console.log("Win Rate:", metrics.winRate.toFixed(2) + "%");

                //         //     console.log("Top 5 Best Traded Coins:");
                //         //     bestCoins.forEach((coin, index) =>
                //         //         console.log(`${index + 1}. ${coin.symbol}: Total PnL = ${coin.totalPnL.toFixed(2)}`)
                //         //     );

                //         //     console.log("Top 5 Worst Traded Coins:");
                //         //     worstCoins.forEach((coin, index) =>
                //         //         console.log(`${index + 1}. ${coin.symbol}: Total Loss = ${coin.totalLoss.toFixed(2)}`)
                //         //     );
                //         // } else {
                //         //     console.log("No trades available for analysis.");
                //         // }
                    
                //         const orderData = {
                //             category: "linear",
                //             symbol: "BTCUSDT",
                //             side: "Buy",
                //             positionIdx: 0,
                //             orderType: "Market",
                //                 qty: "0.001",
                //                 price: "94000",
                //                 takeProfit:"100000",
                //                 stopLoss:"93000",
                //             timeInForce: "GTC",
                //         };
                        
                //         // placeOrder(orderData);
                //         placeOrderWithRiskProfile(orderData)
                //             .then(response => console.log("Order Response:", response))
                //             .catch(error => console.error("Order Error:", error.message));

                //             setTimeout(() => {
                //             const order2Data = {
                //                 category: "linear",
                //                 symbol: "BTCUSDT",
                //                 side: "Buy",
                //                 positionIdx: 0,
                //                 orderType: "Limit",
                //                 qty: "0.001",
                //                 price: "89000",
                //                 takeProfit:"90000",
                //                 stopLoss:"88000",
                //                 timeInForce: "GTC",
                //             };
                            
                            
                //             placeOrderWithRiskProfile(order2Data)
                //                 .then(response => console.log("Order Response:", response))
                //                 .catch(error => console.error("Order Error:", error.message));
                //             }, 2000); // 2000 milliseconds = 2 seconds





                //     //     let leverageData = {
                //     //         category: "linear",
                //     //         symbol: "BTCUSDT",
                //     //         buyLeverage: "20",
                //     //         sellLeverage: "20",
                //     //         tradeMode: 0,  // 0 for Isolated, 1 for Cross
                //     //     };

                //     //     const leverageResponse = await setLeverage(leverageData);
                //     //     console.log("Set Leverage Response:", leverageResponse);

                //     //     const marginResponse = await switchMarginMode(leverageData);
                //     //     console.log("Switch Margin Mode Response:", marginResponse);

                    
                //     //     const createdOrder = await placeOrder(orderData);
                //     //     console.log("Created Order:", createdOrder);

                //     //     const orderlistdata = 'category=linear&settleCoin=USDT';
                //     //     const orderList = await getOrderList(orderlistdata);
                //     //     console.log("Order List:", orderList);

                //     //     const orderLinkId = createdOrder.result.orderLinkId;

                //     //     const newOrderData = {
                //     //         category: "linear",
                //     //         symbol: "BTCUSDT",
                //     //         side: "Buy",
                //     //         positionIdx: 0,
                //     //         orderType: "Limit",
                //     //         qty: "0.08",
                //     //         price: "10000",
                //     //         timeInForce: "GTC",
                //     //         orderLinkId: orderLinkId,
                //     //     };

                //     //     const amendedOrder = await ammendOrder(newOrderData);
                //     //     console.log("Amended Order:", amendedOrder);

                //     //     const newOrderList = await getOrderList(orderlistdata);
                //     //     console.log("Updated Order List:", newOrderList);

                //     //     const positionData = 'category=linear&settleCoin=USDT&symbol=BTCUSDT';
                //     //     const positionInfo = await getPositionInfo(positionData);
                //     //     console.log("Position Info:", positionInfo);

                //     //     const cancelResponse = await cancelOrder(orderLinkId);
                //     //     console.log("Cancel Order Response:", cancelResponse);

                        
                //     //     const closedPnlData = 'category=linear';

                //     //     // Get closed PnL data and calculate metrics
                //     //     const closedPnlResult = await getClosedPnl(closedPnlData);

                //     //     if (closedPnlResult) {
                //     //         const { metrics, bestCoins, worstCoins } = closedPnlResult;

                //     //         console.log("Total Trades:", metrics.totalTrades);
                //     //         console.log("Average Trade Output:", metrics.avgTradeOutput.toFixed(2));
                //     //         console.log("Average Winning Trade:", metrics.avgWinningTrade.toFixed(2));
                //     //         console.log("Average Losing Trade:", metrics.avgLosingTrade.toFixed(2));
                //     //         console.log("Win Rate:", metrics.winRate.toFixed(2) + "%");

                //     //         console.log("Top 5 Best Traded Coins:");
                //     //         bestCoins.forEach((coin, index) =>
                //     //             console.log(`${index + 1}. ${coin.symbol}: Total PnL = ${coin.totalPnL.toFixed(2)}`)
                //     //         );

                //     //         console.log("Top 5 Worst Traded Coins:");
                //     //         worstCoins.forEach((coin, index) =>
                //     //             console.log(`${index + 1}. ${coin.symbol}: Total Loss = ${coin.totalLoss.toFixed(2)}`)
                //     //         );
                //     //     } else {
                //     //         console.log("No trades available for analysis.");
                //     //     }
                    
                //     //     const balanceData = 'accountType=UNIFIED';
                //     //     const accountBalance = await getAccountBalance(balanceData);
                //     //     console.log("Account Balance:", accountBalance);

                //     //     const coinBalanceData = 'accountType=UNIFIED';
                //     //     const coinBalance = await getCoinBalance(coinBalanceData);
                //     //     console.log("Coin Balance:", coinBalance);

                //     //     const coinSymbol = 'BTC';
                //     //     const singleCoinBalance = await getSingleCoinBalance(coinSymbol);
                //     //     console.log(`${coinSymbol} Balance:`, singleCoinBalance);

                //     } catch (error) {
                //         console.error("Error in TestCase:", error.message);
                //     }
                // }

                // Execute the functions
                // runTestCase();

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
                