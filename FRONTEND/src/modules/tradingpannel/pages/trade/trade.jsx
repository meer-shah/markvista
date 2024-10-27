import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TradeComponent, TradingViewWidget, Order } from '../../containers/index';
import './trade.css';

function Trade() {
  const [symbol , setSymbol] = useState("BTCUSDT");

  const navigate = useNavigate();

  const handleConnect = () => {
    navigate('/apiconnection'); // Adjust the path based on your route setup
  };

  return (
    <div className="trade__container">
      {/* Container for TradingViewWidget and Order */}
      <div className="trade__widget-order">
        <div className="trade__widget">
          <TradingViewWidget symbol={symbol} setSymbol={setSymbol} />
          <div className="connectaccount">
            <div>Connect your Bybit account</div>
            <button className="form-button" onClick={handleConnect}>
              Connect
            </button>
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
