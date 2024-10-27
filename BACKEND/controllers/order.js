const crypto = require("crypto");
const axios = require("axios");

exports.placeOrder = async(req,res)=>{
  let data = req.body;
  const orderLinkId = crypto.randomBytes(16).toString("hex")
data.orderLinkId = orderLinkId;

console.log(data)



const apikey ="5dGSKQxNkVPJ4TdoZB";
const timestamp = Date.now().toString();
const secret = "AtiXCNX6t0TnuvMTaJmGHwPz5z0xlCiWoonp";
const recvWindow = 30000;
    const sign = await crypto.createHmac("sha256", secret)
    .update(timestamp + apikey + recvWindow + JSON.stringify(data))
    .digest("hex");

console.log(sign);

    let config = {
        method: 'post',
        url: 'https://api-demo.bybit.com/v5/order/create',
        headers: { 
          "X-BAPI-SIGN-TYPE": "2",
          'X-BAPI-API-KEY': apikey, 
          'X-BAPI-TIMESTAMP': timestamp, 
          'X-BAPI-RECV-WINDOW': recvWindow.toString(), 
          'X-BAPI-SIGN': sign
        },
        data : data
      };
      
      axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        res.status(200).send(response.data)
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(error)
      });
}