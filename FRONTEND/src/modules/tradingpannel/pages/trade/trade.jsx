import React, { useEffect, useRef, useState, memo } from 'react';
import { TradeComponent,TradingViewWidget,Order } from '../../containers/index';
import './trade.css';

function Trade() {
  return (
    <div className="trade__container">
     

      {/* Container for TradingViewWidget and Order */}
      <div className="trade__widget-order">
        <div className="trade__widget">
          <TradingViewWidget />
        </div>
        <div className="trade__order">
          <Order />
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
