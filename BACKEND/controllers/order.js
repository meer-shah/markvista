                const crypto = require("crypto");
                const axios = require("axios");
                const RiskProfile = require('../models/riskprofilemodal');
                const AdjustedRisk = require('../models/riskprofilemodal'); // Import the AdjustedRisk model
                const DailyLoss = require('../models/riskprofilemodal'); ; // Adjust path according to where you defined the model
                const ApiConnection = require('../models/ApiConnection');

               


                //real account
                // const url = 'https://api.bybit.com';  // API base URL
                // const apiKey = "FdWbqIDBdV5LDOjD5H";  // Your API key
                // const secret = "6i32BfhTK14YbE8OttN6c8uBQXqbhe7C6GYJ";  // Your secret key
                // //demo account 
                const url = 'https://api-demo.bybit.com';  // API base URL
                // const apiKey = "Y1rRqFvBHiIS3YAlcB";  // Your API key
                // const secret = "gB6SF4CKIixKPBtxEKSeA3J1jpYlDmQLwzkN";  // Your secret key
                // const { apiKey, secret } =  getApiKeysFromDB(); // Dynamically fetch keys from DB
                let apiKey = null;
                let secret = null;
                const recvWindow = 50000000000;  // Maximum window for receiving the response (in ms)
                const timestamp = Date.now().toString();  // Current timestamp for signing requests

                async function initializeApiKeys() {
                    try {
                        const apiData = await ApiConnection.findOne();
                        if (!apiData) {
                            throw new Error("API keys not found in the database.");
                        }
                        apiKey = apiData.apiKey;
                        secret = apiData.secretKey;
                        console.log("API keys initialized successfully!");
                    } catch (error) {
                        console.error("Error initializing API keys:", error.message);
                        throw error;
                    }
                }
                
                // Call the initialization function immediately after defining it
                initializeApiKeys();
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
                        'X-BAPI-TIMESTAMP':  timestamp.toString(),
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
    // let isFirstTrade = adjustedRiskArray.length === 0;


    // Track the consecutive wins and losses
    
        const placeOrderWithRiskProfile = async (data) => {
        try {

            // Fetch the active risk profile
            const riskProfile = await RiskProfile.findOne({ ison: true });
            if (!riskProfile) throwError("No active risk profile found.");
    
        let prevrisk = riskProfile.previousrisk || 0;
        let currrisk = riskProfile.currentrisk || 0;
        let consecutiveWins = riskProfile.consecutiveWins || 0;
        let consecutiveLosses = riskProfile.consecutiveLosses || 0;
        let isFirstTrade = prevrisk === 0 && currrisk === 0;
        console.log(`Previous Risk: ${prevrisk}, Current Risk: ${currrisk}`);
        console.log(`Consecutive Wins: ${consecutiveWins}, Consecutive Losses: ${consecutiveLosses}`);

            
    // Retrieve SLallowedPerDay from risk profile
    let SLallowedPerDay = riskProfile.SLallowedperday || 1000; // Default to 1000 if not provided
    console.log(`SL Allowed Per Day: ${SLallowedPerDay}`);


    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).getTime(); // Midnight timestamp for today
const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).getTime(); // End of the day timestamp

console.log(startOfDay); // Logs the start of the day timestamp
console.log(endOfDay);   // Logs the end of the day timestamp

const pnlEndpoint = "/v5/position/closed-pnl";  // Endpoint for closed PnL

// Prepare the PnL request data with timestamps
const pnlData = `category=linear&startTime=${startOfDay}&endTime=${endOfDay}`;

try {
    // Fetch the closed PnL data for the day
    const pnlResponse = await http_request(pnlEndpoint, "GET", pnlData, "Get Closed PnL");

    // Check if the response is valid
    if (pnlResponse?.result?.list?.length > 0) {
        let totalLosses = 0;

        // Loop through each trade and check if it's a loss
        pnlResponse.result.list.forEach((trade) => {
            const pnl = parseFloat(trade.closedPnl);  // Get the PnL for this trade

            // Ensure the PnL is a valid number
            if (isNaN(pnl)) {
                console.warn(`Invalid PnL value for trade: ${trade}`);
                return; // Skip invalid trade data
            }

            if (pnl < 0) {
                totalLosses++ ;  // Add losses (negative PnL) to the total
            }
        });

        console.log(`Total losses for today: ${totalLosses}`);
        SLallowedPerDay -= totalLosses;
        console.log(`Remaining SL allowed for today: ${SLallowedPerDay}`);
    } else {
        console.warn("No closed trades available for today.");
    }
} catch (error) {
    console.error("Error while fetching PnL data:", error.message || error);
    throw new Error("Failed to fetch PnL data. Please check the network or try again later.");
}

// Ensure SL limit is not reached
if (SLallowedPerDay <= 0) {
    console.warn("SL ALLOWED PER DAY is already hit, come tomorrow to trade.");
    return;
}

    // Fetch active orders and filter out conditional orders
    const orderListResponse = await getOrderList("category=linear&settleCoin=USDT");
    const activeOrders = orderListResponse?.result?.list?.filter(order => !order.stopOrderType); // Only include non-conditional orders

    console.log(`Active Orders (Excluding OCO/SLTP): ${activeOrders.length}`);

            // Fetch open positions
        const activePositionsResponse = await getPositionInfo('category=linear&settleCoin=USDT');

        // Check if the response is valid and contains the list of positions
        const activePositions = activePositionsResponse?.result?.list || [];

        console.log(`Active Positions: ${activePositions.length}`);
        let totaltrades = (activeOrders.length + activePositions.length)
        console.log(`totaltrades : ${totaltrades}`);

        if (totaltrades> SLallowedPerDay) {
            console.warn("IT GOES AGAINST THE SL ALLOWED PER DAY .");
            return;
        }
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
            const allpnlResponse = await http_request(pnlendpoint, "GET", "category=linear", "Get Closed PnL");
    
            let adjustedRisk = currrisk;
            let lastAdjustedRisk = prevrisk ;

            // Check if we need to reset the trade sequence based on consecutive wins/losses
            if (consecutiveWins >= resetValue || consecutiveLosses >= resetValue) {
                console.log("Consecutive wins/losses threshold reached. Resetting to initial risk.");
                isFirstTrade = true; // Treat the next trade as a "first trade"
                riskProfile.consecutiveWins = 0;
                riskProfile.consecutiveLosses = 0;
            }
    
            // If it's the first trade or we need to reset, use only the initial risk
            if (isFirstTrade) {
                adjustedRisk = initialRisk;
                riskProfile.currentrisk= adjustedRisk;
                console.warn("First trade or reset occurred. Using initial risk.");
                console.log(prevrisk)
                console.log(currrisk)
            } 
            else if (allpnlResponse?.result?.list?.length) {
                const lastTrade = allpnlResponse.result.list[0];
                const lastTradeResult = parseFloat(lastTrade.closedPnl) > 0 ? "Win" : "Loss";
    
                // Adjust the risk based on the previous trade result
                riskProfile.previousrisk=currrisk;
                lastAdjustedRisk=currrisk;
                adjustedRisk = calculateAdjustedRisk(lastAdjustedRisk, riskProfile, lastTradeResult);
    
                // Track consecutive wins or losses
                if (lastTradeResult === "Win") {
                    riskProfile.consecutiveWins++;
                    riskProfile.consecutiveLosses = 0; // Reset loss streak
                } else {
                    riskProfile.consecutiveLosses++;
                    riskProfile.consecutiveWins = 0; // Reset win streak
                }
            } else {
                console.warn("No closed trades available or it's the first trade. Using initial risk.");
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
            
    
            // After the first trade, set the flag to false so future trades will use the adjusted risk based on previous trades
            isFirstTrade = false;
            riskProfile.currentrisk= adjustedRisk;
            await riskProfile.save();
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
                const showusdtbalance =async (req, res)=>{
                    const accountBalanceResponse = await getAccountBalance("accountType=UNIFIED");
                    const usdtBalance = getUsdtBalance(accountBalanceResponse);
                    res.send(usdtBalance)
                }

               
                
                const getOrderList = async () => {
                    const endpoint = "/v5/order/realtime";  // API endpoint for fetching orders
                   return await http_request(endpoint, "GET", 'category=linear&settleCoin=USDT', "Get Order List");  // Call the API
                    
                };

                const getOrderListf = async (req , res) => {
                    const endpoint = "/v5/order/realtime";  // API endpoint for fetching orders
                   let Result = await http_request(endpoint, "GET", 'category=linear&settleCoin=USDT', "Get Order List");  // Call the API
                    let data = Result.result?.list?.filter(order => !order.stopOrderType)
                   res.send(data);
                };

            
                const cancelOrder = async (req,res) => {

                    let data = req.body;
                    console.log("daya",data)
                    try {
                        const endpoint = "/v5/order/cancel";  // API endpoint for cancelling orders
                        const response = await http_request(endpoint, "POST", `category=${data.category}&symbol=${data.symbol}`, "Cancel  Order");  // Call the API
                        console.log("Order cancellation successful:", response.json());
                
                        // Remove the last element from the adjustedRiskArray
                        if (adjustedRiskArray.length > 0) {
                            const removedElement = adjustedRiskArray.pop();
                            console.log(`Removed last element from adjustedRiskArray: ${removedElement}`);
                        } else {
                            console.warn("adjustedRiskArray is empty. Nothing to remove.");
                        }
                
                        // return response;
                        res.send(response);
                    } catch (error) {
                        throw new Error(`Failed to cancel orders: ${error.message}`);
                    }
                };
                

            
            
                const ammendOrder = async (data) => {
                    const endpoint = "/v5/order/amend";  // API endpoint for amending orders
                    return await http_request(endpoint, "POST", JSON.stringify(data), "Amend Order");  // Call the API
                };

                
                const getPositionInfo = async () => {
                    const endpoint = "/v5/position/list";  // API endpoint for position info
                
                    return await http_request(endpoint, "GET", 'category=linear&settleCoin=USDT', "Get Position Info");  // Call the API
                    
                };

                const getPositionInfof = async (req , res ) => {
                    const endpoint = "/v5/position/list";  // API endpoint for position info
                
                    let data = await http_request(endpoint, "GET", 'category=linear&settleCoin=USDT', "Get Position Info");  // Call the API
                    res.send(data)
                };
                const setLeverage = async (req, res) => {
                    const data = req.body;
                    
                    console.log("Received order data from frontend:", data);
            
                    
                    try {
                      const endpoint = "/v5/position/set-leverage"; // Replace with the correct endpoint
                     
                      const response = await http_request(endpoint, "POST", data, "Set Leverage");
                  
                      return res.status(200).json({ message: "Leverage updated successfully", response });
                    } catch (error) {
                      console.error("Error setting leverage:", error.message);
                      res.status(500).json({ error: "Failed to update leverage" });
                    }
                };
                
            const switchMarginMode = async (req, res) => {
                const data = req.body;
                    
                console.log("Received order data from frontend:", data);
        
                // Validate the required fields in the data object
                
                try {
                    const endpoint = "/v5/position/switch-isolated"; // Replace with the correct endpoint
                    const response = await http_request(endpoint, "POST", data, "Switch Margin Mode");
                
                    return res.status(200).json({ message: "Margin mode updated successfully", response });
                } catch (error) {
                    console.error("Error switching margin mode:", error.message);
                    res.status(500).json({ error: "Failed to switch margin mode" });
                }
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
// res.send(
//     totalTrades,
//                         avgTradeOutput,
//                         avgWinningTrade,
//                         avgLosingTrade,
//                         winRate,
// )
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
                const getClosedPnl = async () => {
                    const endpoint = "/v5/position/closed-pnl"; // API endpoint for getting closed PnL
                    const response = await http_request(endpoint, "GET", 'category=linear', "Get Closed PnL"); // Call the API

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

                const getClosedPnlf = async (req , res) => {
                    const endpoint = "/v5/position/closed-pnl"; // API endpoint for getting closed PnL
                    const response = await http_request(endpoint, "GET", 'category=linear', "Get Closed PnL"); // Call the API

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

                        res.send ({ trades, metrics, bestTrade, worstTrade, bestCoins, worstCoins });
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
                const gettransactionlog = async (req, res) => {
                    try {
                      // Get the current timestamp (end time)
                      const currentTimestamp = Date.now();
                  
                      // Calculate the start timestamp for one year ago
                      const startTimestamp = currentTimestamp - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

                      // Create the data object with startTime and endTime
                      const data = `category=linear&accountType=UNIFIED&baseCoin=USDT`;

                      // Set up the API endpoint
                      const endpoint = "/v5/account/transaction-log";  // API endpoint for getting transaction logs
                  
                      // Call the API to get the transaction logs
                      const response = await http_request(endpoint, "GET", data, "Get transaction log:");
                  console.log(response)
                      // Return the response or process the data as needed
                      return res.json(response); 
                  
                    } catch (error) {
                      console.error("Error fetching transaction logs:", error);
                      return res.status(500).json({ error: "Failed to fetch transaction logs" });
                    }
                  };
                  

                const getSingleCoinBalance = async (symbol) => {
                    const data = `accountType=UNIFIED&coin=${symbol}`;  // Coin balance request data
                    const endpoint = "/v5/asset/transfer/query-account-coins-balance";  // API endpoint for getting single coin balance
                    return await http_request(endpoint, "GET", data, `Get ${symbol} Balance`);  // Call the API
                };


                // Example usage function
                // async function runTestCase() {
                // //     try {
        
                // //         // const closedPnlData = 'category=linear';

                // //         // Get closed PnL data and calculate metrics
                // //         // const closedPnlResult = await getClosedPnl(closedPnlData);

                // //         // if (closedPnlResult) {
                // //         //     const { metrics, bestCoins, worstCoins } = closedPnlResult;

                // //         //     console.log("Total Trades:", metrics.totalTrades);
                // //         //     console.log("Average Trade Output:", metrics.avgTradeOutput.toFixed(2));
                // //         //     console.log("Average Winning Trade:", metrics.avgWinningTrade.toFixed(2));
                // //         //     console.log("Average Losing Trade:", metrics.avgLosingTrade.toFixed(2));
                // //         //     console.log("Win Rate:", metrics.winRate.toFixed(2) + "%");

                // //         //     console.log("Top 5 Best Traded Coins:");
                // //         //     bestCoins.forEach((coin, index) =>
                // //         //         console.log(`${index + 1}. ${coin.symbol}: Total PnL = ${coin.totalPnL.toFixed(2)}`)
                // //         //     );

                // //         //     console.log("Top 5 Worst Traded Coins:");
                // //         //     worstCoins.forEach((coin, index) =>
                // //         //         console.log(`${index + 1}. ${coin.symbol}: Total Loss = ${coin.totalLoss.toFixed(2)}`)
                // //         //     );
                // //         // } else {
                // //         //     console.log("No trades available for analysis.");
                // //         // }
                    
                // //         const orderData = {
                // //             category: "linear",
                // //             symbol: "BTCUSDT",
                // //             side: "Buy",
                // //             positionIdx: 0,
                // //             orderType: "Market",
                // //                 qty: "0.001",
                // //                 price: "94000",
                // //                 takeProfit:"100000",
                // //                 stopLoss:"93000",
                // //             timeInForce: "GTC",
                // //         };
                        
                // //         // placeOrder(orderData);
                // //         placeOrderWithRiskProfile(orderData)
                // //             .then(response => console.log("Order Response:", response))
                // //             .catch(error => console.error("Order Error:", error.message));

                // //             setTimeout(() => {
                // //             const order2Data = {
                // //                 category: "linear",
                // //                 symbol: "BTCUSDT",
                // //                 side: "Buy",
                // //                 positionIdx: 0,
                // //                 orderType: "Limit",
                // //                 qty: "0.001",
                // //                 price: "89000",
                // //                 takeProfit:"90000",
                // //                 stopLoss:"88000",
                // //                 timeInForce: "GTC",
                // //             };
                            
                            
                // //             placeOrderWithRiskProfile(order2Data)
                // //                 .then(response => console.log("Order Response:", response))
                // //                 .catch(error => console.error("Order Error:", error.message));
                // //             }, 2000); // 2000 milliseconds = 2 seconds





                // //     //     let leverageData = {
                // //     //         category: "linear",
                // //     //         symbol: "BTCUSDT",
                // //     //         buyLeverage: "20",
                // //     //         sellLeverage: "20",
                // //     //         tradeMode: 0,  // 0 for Isolated, 1 for Cross
                // //     //     };

                // //     //     const leverageResponse = await setLeverage(leverageData);
                // //     //     console.log("Set Leverage Response:", leverageResponse);

                // //     //     const marginResponse = await switchMarginMode(leverageData);
                // //     //     console.log("Switch Margin Mode Response:", marginResponse);

                    
                // //     //     const createdOrder = await placeOrder(orderData);
                // //     //     console.log("Created Order:", createdOrder);

                // //     //     const orderlistdata = 'category=linear&settleCoin=USDT';
                // //     //     const orderList = await getOrderList(orderlistdata);
                // //     //     console.log("Order List:", orderList);

                // //     //     const orderLinkId = createdOrder.result.orderLinkId;

                // //     //     const newOrderData = {
                // //     //         category: "linear",
                // //     //         symbol: "BTCUSDT",
                // //     //         side: "Buy",
                // //     //         positionIdx: 0,
                // //     //         orderType: "Limit",
                // //     //         qty: "0.08",
                // //     //         price: "10000",
                // //     //         timeInForce: "GTC",
                // //     //         orderLinkId: orderLinkId,
                // //     //     };

                // //     //     const amendedOrder = await ammendOrder(newOrderData);
                // //     //     console.log("Amended Order:", amendedOrder);

                // //     //     const newOrderList = await getOrderList(orderlistdata);
                // //     //     console.log("Updated Order List:", newOrderList);

                // //     //     const positionData = 'category=linear&settleCoin=USDT&symbol=BTCUSDT';
                // //     //     const positionInfo = await getPositionInfo(positionData);
                // //     //     console.log("Position Info:", positionInfo);

                // //     //     const cancelResponse = await cancelOrder(orderLinkId);
                // //     //     console.log("Cancel Order Response:", cancelResponse);
                // const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).getTime(); // Midnight timestamp for today
                // const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).getTime(); // End of the day timestamp
        
                // console.log(startOfDay); // Logs the start of the day timestamp
                // console.log(endOfDay); 
                // const pnlData = `category=linear&startTime=${startOfDay}&endTime=${endOfDay}`
                // // {
                // //     category: "Linear",  // Use "linear" or "inverse" based on your requirements
                // //     // startTime: startOfDay,  // Start timestamp of the day
                // //     // endTime: endOfDay,      // End timestamp of the day
                // //     // limit: 200,             // Limit the number of results (adjust as necessary)
                // // };

                //         // Get closed PnL data and calculate metrics
                //          getClosedPnl(pnlData);

                // //     //     if (closedPnlResult) {
                // //     //         const { metrics, bestCoins, worstCoins } = closedPnlResult;

                // //     //         console.log("Total Trades:", metrics.totalTrades);
                // //     //         console.log("Average Trade Output:", metrics.avgTradeOutput.toFixed(2));
                // //     //         console.log("Average Winning Trade:", metrics.avgWinningTrade.toFixed(2));
                // //     //         console.log("Average Losing Trade:", metrics.avgLosingTrade.toFixed(2));
                // //     //         console.log("Win Rate:", metrics.winRate.toFixed(2) + "%");

                // //     //         console.log("Top 5 Best Traded Coins:");
                // //     //         bestCoins.forEach((coin, index) =>
                // //     //             console.log(`${index + 1}. ${coin.symbol}: Total PnL = ${coin.totalPnL.toFixed(2)}`)
                // //     //         );

                // //     //         console.log("Top 5 Worst Traded Coins:");
                // //     //         worstCoins.forEach((coin, index) =>
                // //     //             console.log(`${index + 1}. ${coin.symbol}: Total Loss = ${coin.totalLoss.toFixed(2)}`)
                // //     //         );
                // //     //     } else {
                // //     //         console.log("No trades available for analysis.");
                // //     //     }
                    
                // //     //     const balanceData = 'accountType=UNIFIED';
                // //     //     const accountBalance = await getAccountBalance(balanceData);
                // //     //     console.log("Account Balance:", accountBalance);

                // //     //     const coinBalanceData = 'accountType=UNIFIED';
                // //     //     const coinBalance = await getCoinBalance(coinBalanceData);
                // //     //     console.log("Coin Balance:", coinBalance);

                // //     //     const coinSymbol = 'BTC';
                // //     //     const singleCoinBalance = await getSingleCoinBalance(coinSymbol);
                // //     //     console.log(`${coinSymbol} Balance:`, singleCoinBalance);

                // //     } catch (error) {
                // //         console.error("Error in TestCase:", error.message);
                // //     }
                // }

                // // Execute the functions
                // runTestCase();

                // Export all functions for use in other parts of the application

             
                
                
                
                
                
                module.exports = {
                    placeOrder,
                  
                    placeOrderWithRiskProfile, // Included this one for placing orders with risk profile
                    getOrderListf, // Fetch pending orders
                    cancelOrder,
                    ammendOrder,
                    getPositionInfof, // Active position info
                    setLeverage,
                    switchMarginMode,
                    getClosedPnlf, // Trade performance and risk profile conditions
                    getAccountBalance, // For user portfolio balance
                    getCoinBalance,
                    getSingleCoinBalance,
                    gettransactionlog,
                    showusdtbalance
                };
                