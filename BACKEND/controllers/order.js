// const crypto = require("crypto");
// const axios = require("axios");

// const placeOrder = async(req,res)=>{
//   let data = req.body;
//   const orderLinkId = crypto.randomBytes(16).toString("hex")
// data.orderLinkId = orderLinkId;

// console.log(data)



// const apikey ="5dGSKQxNkVPJ4TdoZB";
// const timestamp = Date.now().toString();
// const secret = "AtiXCNX6t0TnuvMTaJmGHwPz5z0xlCiWoonp";
// const recvWindow = 50000;
//     const sign = await crypto.createHmac("sha256", secret)
//     .update(timestamp + apikey + recvWindow + JSON.stringify(data))
//     .digest("hex");

// console.log(sign);

//     let config = {
//         method: 'post',
//         url: 'https://api-demo.bybit.com/v5/order/create',
//         headers: { 
//           "X-BAPI-SIGN-TYPE": "2",
//           'X-BAPI-API-KEY': apikey, 
//           'X-BAPI-TIMESTAMP': timestamp, 
//           'X-BAPI-RECV-WINDOW': recvWindow.toString(), 
//           'X-BAPI-SIGN': sign
//         },
//         data : data
//       };
      
//       axios(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         res.status(200).send(response.data)
//     })
//     .catch((error) => {
//         console.log(error);
//         res.status(500).send(error)
//       });
// }
// const placeorderwithconditions = async(req,res)=>{



// }

// module.exports={
//   placeOrder,
// placeorderwithconditions

// }
const RiskProfile = require('../models/riskprofilemodal');
const mongoose = require('mongoose');

const crypto = require("crypto");
const axios = require("axios");

const placeOrder = async (data) => {
  const orderLinkId = crypto.randomBytes(16).toString("hex");
  data.orderLinkId = orderLinkId;

  const apikey = "5dGSKQxNkVPJ4TdoZB";
  const timestamp = Date.now().toString();
  const secret = "AtiXCNX6t0TnuvMTaJmGHwPz5z0xlCiWoonp";
  const recvWindow = 50000;
  const sign = crypto.createHmac("sha256", secret)
    .update(timestamp + apikey + recvWindow + JSON.stringify(data))
    .digest("hex");

  const config = {
    method: 'post',
    url: 'https://api-demo.bybit.com/v5/order/create',
    headers: {
      "X-BAPI-SIGN-TYPE": "2",
      'X-BAPI-API-KEY': apikey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': recvWindow.toString(),
      'X-BAPI-SIGN': sign
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const placeorderwithconditions = async (req, res) => {
  try {

    // conditions here


    // Check if there is an active risk profile
    const activeRiskProfile = await RiskProfile.findOne({ ison: true });

    if (!activeRiskProfile) {
      return res.status(400).json({
        message: "No active risk profile found. Order not placed."
      });
    }

    // Log active risk profile information
    console.log(`Active Risk Profile: ${activeRiskProfile.title}`);
    console.log(`Initial Risk Per Trade: ${activeRiskProfile.initialRiskPerTrade}`);

    // Prepare the order data

    const orderData = req.body;
    // orderData.initialRisk = activeRiskProfile.initialRiskPerTrade;









    // Execute the order
    const orderResponse = await placeOrder(orderData);

    // Send success response
    res.status(200).json({
      message: `Order placed successfully with active risk profile: ${activeRiskProfile.title}`,
      
      orderResponse: orderResponse
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing request",
      error: error.message
    });
  }
};

module.exports = {
  placeOrder,
  placeorderwithconditions
};
