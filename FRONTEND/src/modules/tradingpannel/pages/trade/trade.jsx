// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TradeComponent, TradingViewWidget, Order } from '../../containers/index';
// import './trade.css';

// function Trade() {
//   const [symbol , setSymbol] = useState("BTCUSDT");

//   const navigate = useNavigate();

//   const handleConnect = () => {
//     navigate('/apiconnection'); // Adjust the path based on your route setup
//   };

//   return (
//     <div className="trade__container">
//       {/* Container for TradingViewWidget and Order */}
//       <div className="trade__widget-order">
//         <div className="trade__widget">
//           <TradingViewWidget symbol={symbol} setSymbol={setSymbol} />
//           <div className="connectaccount">
//             <div>Connect your Bybit account</div>
//             <button className="form-button" onClick={handleConnect}>
//               Connect
//             </button>
//           </div>
//         </div>
//         <div className="trade__order">
//           <Order symbol={symbol} setSymbol={setSymbol} />
//         </div>
//       </div>
//       {/* TradeComponent positioned at the top */}
//       <div className="trade__component">
//         <TradeComponent />
//       </div>
//     </div>
//   );
// }

// export default Trade;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To handle API requests
import { TradeComponent, TradingViewWidget, Order } from '../../containers/index';
import './trade.css';

function Trade() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [apiConnected, setApiConnected] = useState(false); // Track if API keys are connected
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const navigate = useNavigate();

  // Fetch API keys on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/connection/api-connection'); // Adjust the endpoint as needed
        console.log("API Response:", response.data); // Log the entire response to see the structure
  
        // Access the nested data
        if (response.data && response.data.data && response.data.data.apiKey && response.data.data.secretKey) {
          setApiConnected(true);
        } else {
          setApiConnected(false);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error.message);
        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApiKeys();
  }, []);
  
  

  const handleConnect = () => {
    navigate('/apiconnection'); // Navigate to API connection page
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:4000/api/connection/api-connection'); // Adjust the endpoint as needed
      setApiConnected(false); // Update state to reflect API keys removal
    } catch (error) {
      console.error("Error deleting API keys:", error.message);
    }
  };

  if (loading) {
    return <div className="trade__loading">Loading...</div>; // Display while loading
  }

  return (
    <div className="trade__container">
      {/* Container for TradingViewWidget and Order */}
      <div className="trade__widget-order">
        <div className="trade__widget">
          <TradingViewWidget symbol={symbol} setSymbol={setSymbol} />
          <div>
            {apiConnected}
            {apiConnected ? (
              <div className="connectaccount">
                <div>Your account is connected</div>
                <button className="form-button delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            ) : (
              <div className="connectaccount">
                <div >Connect your Bybit account</div>
                <button className="form-button" onClick={handleConnect}>
                  Connect
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="trade__order">
          <Order symbol={symbol} setSymbol={setSymbol} />
        </div>
      </div>
      {/* TradeComponent positioned at the top */}
      <div className="trade__component">
        <TradeComponent />
      </div>
    </div>
  );
}

export default Trade;
