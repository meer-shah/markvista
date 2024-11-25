

        // const placeorderwithconditions = async (req, res) => {
        //   try {

        //     // conditions here


        //     // Check if there is an active risk profile
        //     const activeRiskProfile = await RiskProfile.findOne({ ison: true });

        //     if (!activeRiskProfile) {
        //       return res.status(400).json({
        //         message: "No active risk profile found. Order not placed."
        //       });
        //     }

        //     // Log active risk profile information
        //     console.log(`Active Risk Profile: ${activeRiskProfile.title}`);
        //     console.log(`Initial Risk Per Trade: ${activeRiskProfile.initialRiskPerTrade}`);

        //     // Prepare the order data

        //     const orderData = req.body;
        //     // orderData.initialRisk = activeRiskProfile.initialRiskPerTrade;









        //     // Execute the order
        //     const orderResponse = await placeOrder(orderData);

        //     // Send success response
        //     res.status(200).json({
        //       message: `Order placed successfully with active risk profile: ${activeRiskProfile.title}`,
            
        //       orderResponse: orderResponse
        //     });
        //   } catch (error) {
        //     res.status(500).json({
        //       message: "Error processing request",
        //       error: error.message
        //     });
        //   }
        // };

        const crypto = require("crypto");
        const axios = require("axios");

        const url = 'https://api-demo.bybit.com';

        const apiKey = "0aALldQn1qWneDMfyk";
        const secret = "QqrSztEGLBf9PJuBw7KsR7ErnknABnw1Br0L";
        const recvWindow = 50000;
        const timestamp = Date.now().toString();

        // Function to generate the HMAC SHA256 signature
        function getSignature(parameters, secret) {
            return crypto.createHmac('sha256', secret).update(timestamp + apiKey + recvWindow + parameters).digest('hex');
        }

        // Generalized HTTP request function
        async function http_request(endpoint, method, data, Info) {
            const sign = getSignature(data, secret);
            let fullendpoint;

            // Build the request URL based on the method
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
                const response = await axios(config);
                console.log(JSON.stringify(response.data));
                return response.data;
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message);
                throw new Error("HTTP request failed");
            }
        }



        // Place Order Function
        const placeOrder = async (data) => {
            const orderLinkId = crypto.randomBytes(16).toString("hex");
            data.orderLinkId = orderLinkId;

            const endpoint = "/v5/order/create";
            return await http_request(endpoint, "POST", JSON.stringify(data), "Create Order");
        };

        // Get Order List (Unfilled Orders)
        const getOrderList = async (data) => {
            const endpoint = "/v5/order/realtime";
            return await http_request(endpoint, "GET", data, "Get Order List");
        };

        // Cancel Order Function
        const cancelOrder = async (orderLinkId) => {
            const data = `{"category":"linear","symbol":"BTCUSDT","orderLinkId":"${orderLinkId}"}`;
            const endpoint = "/v5/order/cancel";
            return await http_request(endpoint, "POST", data, "Cancel Order");
        };

        //amend order 
        const ammendOrder = async (data) => {
        const endpoint = "/v5/order/amend";
        return await http_request(endpoint, "POST", JSON.stringify(data), "ammend Order");
        };


    // Get Position Info
    const getpositioninfo = async (data) => {
        
        const endpoint = "/v5/position/list";
        return await http_request(endpoint, "GET", data, "Get Position Info");
    };

    // Set Leverage Function
    const setLeverage = async (data) => {
        const endpoint = "/v5/position/set-leverage";
        return await http_request(endpoint, "POST", JSON.stringify(data), "Set Leverage");
    };


    // Switch between Cross and Isolated Margin
    const switchMarginMode = async (data) => {
        const endpoint = "/v5/position/switch-isolated";
        return await http_request(endpoint, "POST", JSON.stringify(data), "Switch Margin Mode");
    };

    // Function to get closed PnL
    const getClosedPnl = async (data) => {
        const endpoint = "/v5/position/closed-pnl";
        return await http_request(endpoint, "GET", data, "Get Closed PnL");
    };

    // Function to get account balance
    const getAccountBalance = async (data) => {
        const endpoint = "/v5/account/wallet-balance";
        return await http_request(endpoint, "GET", data, "Get Account Balance");
    };

    // Function to get coin balance
    const getCoinBalance = async (data) => {
        const endpoint = "/v5/asset/transfer/query-account-coins-balance";
        return await http_request(endpoint, "GET", data, "Get Coin Balance");
    };

    // Function to get single coin balance
const getSingleCoinBalance = async (symbol) => {
    const data = `accountType=UNIFIED&coin=${symbol}`;  // Symbol is the coin you're interested in (e.g., "BTC", "ETH")
    const endpoint = "/v5/asset/transfer/query-account-coins-balance";
    return await http_request(endpoint, "GET", data, `Get ${symbol} Balance`);
};

        // Example Usage of the Functions:
        async function runTestCase() {
            try {

                // Set Leverage
            let leverageData = {
                category: "linear",
                symbol: "BTCUSDT",
                buyLeverage: "20",
                sellLeverage: "20",
                tradeMode: 0, // 0 for Isolated, 1 for Cross
            };
            
            const leverageResponse = await setLeverage(leverageData);
            console.log("Set Leverage Response:", leverageResponse);

            const marginResponse = await switchMarginMode(leverageData);
            console.log("Switch Margin Mode Response:", marginResponse);

                //  Create an Order
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
            
                const createdOrder = await placeOrder(orderData);
                console.log("Created Order:", createdOrder);

                //  Get the Unfilled Order List

                const orderlistdata = 'category=linear&settleCoin=USDT';

                const orderList = await getOrderList(orderlistdata);
                console.log("Order List:", orderList);

                const orderLinkId = createdOrder.result.orderLinkId;  // Assuming createdOrder returns this

                //amend order 
                const neworderData = {
                    category: "linear",
                    symbol: "BTCUSDT",
                    side: "Buy",
                    positionIdx: 0,
                    orderType: "Limit",
                    qty: "0.08",
                    price: "10000",
                    timeInForce: "GTC",
                    "orderLinkId": orderLinkId,
                };
                
                const amendOrder = await ammendOrder(neworderData);
                console.log("modified Order:", amendOrder);

                //  Get the Unfilled Order List
                const neworderList = await getOrderList(orderlistdata);
                console.log("Order List:", neworderList);

                //  Get the positioninfo
                const positiondata = 'category=linear&settleCoin=USDT&symbol:BTCUSDT';
                const positioninfo = await getpositioninfo(positiondata);
                console.log(" position info:", positioninfo);

                //  Cancel the Order
                const cancelResponse = await cancelOrder(orderLinkId);
                console.log("Cancel Order Response:", cancelResponse);

                //  Get the Closed PnL
                const closedPnlData = 'category=linear'; // Example data, you can add more parameters if needed
                const closedPnl = await getClosedPnl(closedPnlData);
                console.log("Closed PnL:", closedPnl);

                const balanceData = 'accountType=UNIFIED'; // Example data, you can add more parameters if needed
            const accountBalance = await getAccountBalance(balanceData);
            console.log("Account Balance:", accountBalance);

    //  Get the Coin Balance
    const coinBalanceData = 'accountType=UNIFIED'; // Example data, you can add more parameters if needed
    const coinBalance = await getCoinBalance(coinBalanceData);
    console.log("Coin Balance:", coinBalance);

     // Get the balance for a specific coin (e.g., BTC)
     const coinSymbol = 'BTC';  // Replace with the coin symbol you want to query
     const singlecoinBalance = await getSingleCoinBalance(coinSymbol);
     console.log(`${coinSymbol} Balance:`, singlecoinBalance);

                
            } catch (error) {
                console.error("Error in TestCase:", error.message);
            }
        }

        // Execute the functions
        runTestCase();

        module.exports = {
            placeOrder,
            getOrderList,
            cancelOrder,
            ammendOrder,
            
        };
