

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

const apiKey = "5dGSKQxNkVPJ4TdoZB";
const secret = "AtiXCNX6t0TnuvMTaJmGHwPz5z0xlCiWoonp";
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
const getOrderList = async () => {
    const data = 'category=linear&settleCoin=USDT';
    const endpoint = "/v5/order/realtime";
    return await http_request(endpoint, "GET", data, "Get Order List");
};

// Cancel Order Function
const cancelOrder = async (orderLinkId) => {
    const data = `{"category":"linear","symbol":"BTCUSDT","orderLinkId":"${orderLinkId}"}`;
    const endpoint = "/v5/order/cancel";
    return await http_request(endpoint, "POST", data, "Cancel Order");
};

// Example Usage of the Functions:
async function runTestCase() {
    try {
        // 1. Create an Order
        const orderData = {
            category: "linear",
            symbol: "BTCUSDT",
            side: "Buy",
            positionIdx: 0,
            orderType: "Limit",
            qty: "0.001",
            price: "10000",
            timeInForce: "GTC",
        };

        const createdOrder = await placeOrder(orderData);
        console.log("Created Order:", createdOrder);

        // 2. Get the Unfilled Order List
        const orderList = await getOrderList();
        console.log("Order List:", orderList);

        // 3. Cancel the Order
        const orderLinkId = createdOrder.result.orderLinkId;  // Assuming createdOrder returns this
        const cancelResponse = await cancelOrder(orderLinkId);
        console.log("Cancel Order Response:", cancelResponse);

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
};
