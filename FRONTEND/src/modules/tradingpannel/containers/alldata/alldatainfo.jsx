
// import React, { useState } from 'react';
// import './alldatainfo.css';

// // const dummyData = {
// //   positions: [
// //     { name: 'BTC/USD', quantity: '0.5', valueUSD: '25000', entryPrice: '50000', marketPrice: '52000', tpSl: '55000/48000' },
// //     { name: 'ETH/USD', quantity: '2.0', valueUSD: '6000', entryPrice: '3000', marketPrice: '3200', tpSl: '3500/2800' },
// //     { name: 'XRP/USD', quantity: '1000', valueUSD: '500', entryPrice: '0.50', marketPrice: '0.55', tpSl: '0.60/0.45' },
// //     { name: 'ADA/USD', quantity: '500', valueUSD: '750', entryPrice: '1.50', marketPrice: '1.60', tpSl: '1.80/1.40' },
// //     { name: 'LTC/USD', quantity: '10', valueUSD: '1500', entryPrice: '150', marketPrice: '160', tpSl: '180/140' },
// //   ],
// //   pendingOrders: [
// //     { name: 'ETH/USD', quantity: '1.0', orderPrice: '3000', filledTotal: '0.5/1.0', tradeDirection: 'Buy', orderType: 'Limit' },
// //     { name: 'XRP/USD', quantity: '500', orderPrice: '0.52', filledTotal: '250/500', tradeDirection: 'Sell', orderType: 'Market' },
// //     { name: 'ADA/USD', quantity: '1000', orderPrice: '1.55', filledTotal: '0/1000', tradeDirection: 'Buy', orderType: 'Limit' },
// //     { name: 'LTC/USD', quantity: '5', orderPrice: '155', filledTotal: '3/5', tradeDirection: 'Sell', orderType: 'Market' },
// //     { name: 'BTC/USD', quantity: '0.2', orderPrice: '51000', filledTotal: '0.1/0.2', tradeDirection: 'Buy', orderType: 'Limit' },
// //   ],
// //   tradeHistory: [
// //     { name: 'XRP/USD', filledTotal: '1000/1000', fillPriceOrderPrice: '0.50/0.55', tradeDirection: 'Sell', orderType: 'Market', time: '12:30 PM' },
// //     { name: 'BTC/USD', filledTotal: '0.3/0.3', fillPriceOrderPrice: '50500/51000', tradeDirection: 'Buy', orderType: 'Limit', time: '1:15 PM' },
// //     { name: 'ETH/USD', filledTotal: '2.0/2.0', fillPriceOrderPrice: '3100/3200', tradeDirection: 'Buy', orderType: 'Limit', time: '2:00 PM' },
// //     { name: 'ADA/USD', filledTotal: '500/500', fillPriceOrderPrice: '1.60/1.55', tradeDirection: 'Sell', orderType: 'Market', time: '3:30 PM' },
// //     { name: 'LTC/USD', filledTotal: '10/10', fillPriceOrderPrice: '158/155', tradeDirection: 'Buy', orderType: 'Market', time: '4:00 PM' },
// //   ]
// // };

// const TradeComponent = () => {
//   const [selectedTab, setSelectedTab] = useState('positions');
//   // const [showModal, setShowModal] = useState(false);
//   // const [modalType, setModalType] = useState('');
//   // const [assetQuantity, setAssetQuantity] = useState(0);
//   // const [orderQuantity, setOrderQuantity] = useState(0);
//   // const [sliderValue, setSliderValue] = useState(0);
//   // const [remainingQuantity, setRemainingQuantity] = useState(0);
//   // const [quantityType, setQuantityType] = useState('USDT');
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);

//   const handleTabClick = (tab) => {
//     setSelectedTab(tab);
//   };

//   // const openModal = (type, quantity) => {
//   //   setModalType(type);
//   //   setAssetQuantity(quantity);
//   //   setOrderQuantity(0);
//   //   setSliderValue(0);
//   //   setRemainingQuantity(quantity);
//   //   setShowModal(true);
//   // };

//   // const closeModal = () => {
//   //   setShowModal(false);
//   // };

//   // const handleSliderChange = (e) => {
//   //   const value = e.target.value;
//   //   setSliderValue(value);
//   //   const newOrderQuantity = (assetQuantity * value) / 100;
//   //   setOrderQuantity(newOrderQuantity);
//   //   setRemainingQuantity(Math.max(assetQuantity - newOrderQuantity, 0));
//   // };

//   // const handleQuantityChange = (e) => {
//   //   const value = e.target.value;
//   //   setOrderQuantity(value);
//   //   const newSliderValue = (value / assetQuantity) * 100;
//   //   setSliderValue(newSliderValue);
//   //   setRemainingQuantity(Math.max(assetQuantity - value, 0));
//   // };

//   // const handleQuantityTypeChange = (type) => {
//   //   setQuantityType(type);
//   // };
//   const openConfirmationModal = () => {
//     setShowConfirmationModal(true);
//   };

//   const closeConfirmationModal = () => {
//     setShowConfirmationModal(false);
//   };

//   return (
//     <div className="trade-container">
//       <div className="tab-section">
//         <span className={`tab-item ${selectedTab === 'positions' ? 'active' : ''}`} onClick={() => handleTabClick('positions')}>Positions</span>
//         <span className={`tab-item ${selectedTab === 'pendingOrders' ? 'active' : ''}`} onClick={() => handleTabClick('pendingOrders')}>Pending Orders</span>
//         <span className={`tab-item ${selectedTab === 'tradeHistory' ? 'active' : ''}`} onClick={() => handleTabClick('tradeHistory')}>Trade History</span>
//       </div>

//       {selectedTab === 'positions' && (
//         <div className="positions-section">
//         <div className="heading-row">
//   <span>Symbol</span>
//   <span>Size</span>
//   <span>Position Value (USD)</span>
//   <span>Average Entry Price</span>
//   <span>Market Price</span>
//   <span>Unrealised PnL</span>
//   <span>TP/SL</span>
//   <span>Close By</span>
// </div>
// {orders.map((order, index) => (
//   <div key={index} className="data-row">
//     <span>{order.symbol}</span>
//     <span>{order.size}</span>
//     <span>{order.positionValue}</span>
//     <span>{order.avgPrice}</span>
//     <span>{order.markPrice}</span>
//     <span>{order.unrealisedPnl}</span>
//     <span>{order.takeProfit || 'N/A'} / {order.stopLoss || 'N/A'}</span>
//   </div>
// ))}

//         </div>
//       )}

//       {selectedTab === 'pendingOrders' && (
//         <div className="pending-orders-section">
//          <div className="heading-row">
//   <span>Symbol</span>
//   <span>Quantity</span>
//   <span>Order Price</span>
//   <span>Stop Loss</span>
//   <span>Take Profit</span>
//   <span>Trade Direction</span>
//   <span>Order Type</span>
//   <span>Order Status</span>
//   <span>Created Time</span>
// </div>
// {orders.map((order, index)  => (
//             <div key={index} className="data-row">
//                <span>{order.symbol}</span>
//     <span>{order.qty}</span>
//     <span>{order.price}</span>
//     <span>{order.stopLoss || 'N/A'}</span>
//     <span>{order.takeProfit || 'N/A'}</span>
//     <span>{order.side}</span>
//     <span>{order.orderType}</span>
//     <span>{order.orderStatus}</span>
//     <span>{new Date(parseInt(order.createdTime)).toLocaleString()}</span>
//  <span className="close-by">
//                 <button className="action-button" onClick={openConfirmationModal}>Close</button>
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedTab === 'tradeHistory' && (
//         <div className="trade-history-section">
//           <div className="heading-row">
        
//     <span>Symbol</span>
//     <span>Order Type</span>
//     <span>Leverage</span>
//     <span>Trade Side</span>
//     <span>Closed PnL</span>
//     <span>Avg Entry Price</span>
//     <span>Qty</span>
//     <span>Order Price</span>
//     <span>Avg Exit Price</span>
//     <span>Execution Type</span>
//     <span>Filled Qty</span>
//     <span>Updated Time</span>
  
//           </div>
//           {orders.map((order, index) => (
//      <div key={index} className="data-row">
//               <span>{order.symbol}</span>
//       <span>{order.orderType}</span>
//       <span>{order.leverage}</span>
//       <span>{order.side}</span>
//       <span>{order.closedPnl}</span>
//       <span>{order.avgEntryPrice}</span>
//       <span>{order.qty}</span>
//       <span>{order.orderPrice}</span>
//       <span>{order.avgExitPrice}</span>
//       <span>{order.execType}</span>
//       <span>{order.closedSize}</span>
//       <span>{new Date(parseInt(order.updatedTime)).toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <span className="label">Asset Amount: {remainingQuantity}</span>
            
//             <div className="quantity-type-section">
//               <span
//                 className={`quantity-type ${quantityType === 'USDT' ? 'active' : ''}`}
//                 onClick={() => handleQuantityTypeChange('USDT')}
//               >
//                 USDT
//               </span>
//               <span
//                 className={`quantity-type ${quantityType === 'Asset' ? 'active' : ''}`}
//                 onClick={() => handleQuantityTypeChange('Asset')}
//               >
//                 Asset
//               </span>
//             </div>
            
//             {modalType === 'limit' && (
//               <>
//                 <label htmlFor="orderPrice" className='title'>Order Price:</label>
//                 <input
//                   type="number"
//                   id="orderPrice"
//                   className="modal-input"
//                 />
//               </>
//             )}

//             <label htmlFor="orderQuantity" className='title'>Order Quantity:</label>
//             <input
//               type="number"
//               id="orderQuantity"
//               className="modal-input"
//               value={orderQuantity}
//               onChange={handleQuantityChange}
//             />
//             <input
//               type="range"
//               id="quantitySlider"
//               className="modal-slider"
//               min="0"
//               max="100"
//               step="1"
//               value={sliderValue}
//               onChange={handleSliderChange}
//             />
//              <div
//             className="button-group">
//             <button className="form-button confirm-button" onClick={closeModal}>Confirm</button>
//             <button className="form-button confirm-button" onClick={closeModal}>Cancel</button>
//             </div>
       
//           </div>
//         </div>
    
//       )} */}
//       {showConfirmationModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <span className="title">Do you want to cancel this order?</span>
//             <div
//             className="button-group">
//             <button className="form-button confirm-button" onClick={closeConfirmationModal}>Confirm</button>
//             <button className="form-button confirm-button" onClick={closeConfirmationModal}>Cancel</button>
//             </div>
//             </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TradeComponent;


import React, { useState, useEffect } from 'react';
import './alldatainfo.css';

const TradeComponent = () => {
  const [selectedTab, setSelectedTab] = useState('positions');
  const [positionsData, setPositionsData] = useState([]);
  const [pendingOrdersData, setPendingOrdersData] = useState([]);
  const [tradeHistoryData, setTradeHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrder,setSelectedOrder] = useState({});
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // Fetch data for the selected tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        switch (selectedTab) {
          case 'positions':
            console.log("sameem")
            response = await fetch('http://localhost:4000/api/order/active-positions'); // Replace with your endpoint
            const positions = await response.json();
            console.log("position",positions)
            setPositionsData(positions?.result?.list);
            break;

          case 'pendingOrders':
            response = await fetch('http://127.0.0.198:4000/api/order/order-list');
            // Replace with your endpoint
            const pendingOrders = await response.json();
            // console.log("response",pendingOrders)
            
            setPendingOrdersData(pendingOrders);
            break;

          case 'tradeHistory':
            response = await fetch('http://localhost:4000/api/order/closed-pnl'); // Replace with your endpoint
            const tradeHistory = await response.json();
            console.log("sdsdsd",tradeHistory)
            setTradeHistoryData(tradeHistory?.trades);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);

      }
    };

    fetchData();
    

    
    const intervalId = setInterval(fetchData, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);

  }, [selectedTab]);

  const openConfirmationModal = (order) => {
    setShowConfirmationModal(true);
    setSelectedOrder(order);
    console.log(order)

  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedOrder({})
  };
  const confirmCancel = async () => {
    console.log("selected", selectedOrder);
    
    // Construct the data as an object, not as a query string
    let data = {
      category: 'linear',
        symbol: selectedOrder?.symbol,
        
        
        baseCoin: 'null',
        settleCoin: 'null'
       
    };
    console.log(selectedOrder?.symbol);

    // Send the data as a JSON object in the request body
    let response = await fetch('http://localhost:4000/api/order/cancel-order', {
        method: 'POST', // HTTP method
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert data to JSON string
    });
    
    // Log the response from the server
    console.log(await response.json());
    
    setShowConfirmationModal(false);
    setSelectedOrder({});
};

  return (
    <div className="trade-container">
      <div className="tab-section">
        <span
          className={`tab-item ${selectedTab === 'positions' ? 'active' : ''}`}
          onClick={() => handleTabClick('positions')}
        >
          Positions
        </span>
        <span
          className={`tab-item ${selectedTab === 'pendingOrders' ? 'active' : ''}`}
          onClick={() => handleTabClick('pendingOrders')}
        >
          Pending Orders
        </span>
        <span
          className={`tab-item ${selectedTab === 'tradeHistory' ? 'active' : ''}`}
          onClick={() => handleTabClick('tradeHistory')}
        >
          Trade History
        </span>
      </div>

      
      {selectedTab === 'positions' && (
        <div className="positions-section">
          <div className="heading-row">
            <span>Symbol</span>
            <span>Size</span>
            <span>Position Value (USD)</span>
            <span>Average Entry Price</span>
            <span>Market Price</span>
            <span>Unrealised PnL</span>
            <span>TP/SL</span>
          </div>
          {positionsData.map((position, index) => (
            <div key={index} className="data-row">
              <span>{position.symbol}</span>
              <span>{position.size}</span>
              <span>{position.positionValue}</span>
              <span>{position.avgPrice}</span>
              <span>{position.markPrice}</span>
              <span>{position.unrealisedPnl}</span>
              <span>{position.takeProfit || 'N/A'} / {position.stopLoss || 'N/A'}</span>
            </div>
          ))}
        </div>
      )}

      { selectedTab === 'pendingOrders' && (
        <div className="pending-orders-section">
          <div className="heading-row">
            <span>Symbol</span>
            <span>Quantity</span>
            <span>Order Price</span>
            <span>Stop Loss</span>
            <span>Take Profit</span>
            <span>Trade Direction</span>
            <span>Order Type</span>
            <span>Order Status</span>
            <span>Created Time</span>
          </div>
          {pendingOrdersData.map((order, index) => (
            <div key={index} className="data-row">
              <span>{order.symbol}</span>
              <span>{order.qty}</span>
              <span>{order.price}</span>
              <span>{order.stopLoss || 'N/A'}</span>
              <span>{order.takeProfit || 'N/A'}</span>
              <span>{order.side}</span>
              <span>{order.orderType}</span>
              <span>{order.orderStatus}</span>
              <span>{new Date(parseInt(order.createdTime)).toLocaleString()}</span>
              <span className="close-by">
                <button className="action-button" onClick={()=>openConfirmationModal(order)}>Close</button>
              </span>
            </div>
          ))}
        </div>
      )}

      { selectedTab === 'tradeHistory' && (
        <div className="trade-history-section">
          <div className="heading-row1">
            <span>Symbol</span>
            <span>Order Type</span>
            <span>Leverage</span>
            <span>Trade Side</span>
            <span>Closed PnL</span>
            <span>Avg Entry Price</span>
            <span>Qty</span>
            <span>Order Price</span>
            <span>Avg Exit Price</span>
            <span>Execution Type</span>
            <span>Filled Qty</span>
            <span>Updated Time</span>
          </div>
          {tradeHistoryData.map((history, index) => (
            <div key={index} className="data-row1">
              <span>{history.symbol}</span>
              
<span>{history.orderType}</span>
<span>{history.leverage}</span>
<span>{history.side === 'buy' ? 'Short' : 'Long'}</span> {/* Change buy/sell to Long/Short */}
<span>{parseFloat(history.closedPnl).toFixed(2)}</span> {/* Ensure it's a number and fix to 2 decimal places */}
<span>{parseFloat(history.avgEntryPrice).toFixed(2)}</span> {/* Ensure it's a number and fix to 2 decimal places */}
<span>{parseFloat(history.qty).toFixed(2)}</span> {/* Ensure it's a number and fix to 2 decimal places */}
<span>{parseFloat(history.orderPrice).toFixed(2)}</span> {/* Ensure it's a number and fix to 2 decimal places */}
<span>{parseFloat(history.avgExitPrice).toFixed(2)}</span> {/* Ensure it's a number and fix to 2 decimal places */}
<span>{history.execType}</span>
<span>{history.closedSize}</span>
<span>{new Date(parseInt(history.updatedTime)).toLocaleString()}</span>
                          </div>
          ))}
        </div>
      )}

      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="title">Do you want to cancel this order?</span>
            <div className="button-group">
              <button className="form-button confirm-button" onClick={confirmCancel}>Confirm</button>
              <button className="form-button confirm-button" onClick={closeConfirmationModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeComponent;
