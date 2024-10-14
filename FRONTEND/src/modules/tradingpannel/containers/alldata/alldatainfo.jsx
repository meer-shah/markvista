
import React, { useState } from 'react';
import './alldatainfo.css';

const dummyData = {
  positions: [
    { name: 'BTC/USD', quantity: '0.5', valueUSD: '25000', entryPrice: '50000', marketPrice: '52000', tpSl: '55000/48000' },
    { name: 'ETH/USD', quantity: '2.0', valueUSD: '6000', entryPrice: '3000', marketPrice: '3200', tpSl: '3500/2800' },
    { name: 'XRP/USD', quantity: '1000', valueUSD: '500', entryPrice: '0.50', marketPrice: '0.55', tpSl: '0.60/0.45' },
    { name: 'ADA/USD', quantity: '500', valueUSD: '750', entryPrice: '1.50', marketPrice: '1.60', tpSl: '1.80/1.40' },
    { name: 'LTC/USD', quantity: '10', valueUSD: '1500', entryPrice: '150', marketPrice: '160', tpSl: '180/140' },
  ],
  pendingOrders: [
    { name: 'ETH/USD', quantity: '1.0', orderPrice: '3000', filledTotal: '0.5/1.0', tradeDirection: 'Buy', orderType: 'Limit' },
    { name: 'XRP/USD', quantity: '500', orderPrice: '0.52', filledTotal: '250/500', tradeDirection: 'Sell', orderType: 'Market' },
    { name: 'ADA/USD', quantity: '1000', orderPrice: '1.55', filledTotal: '0/1000', tradeDirection: 'Buy', orderType: 'Limit' },
    { name: 'LTC/USD', quantity: '5', orderPrice: '155', filledTotal: '3/5', tradeDirection: 'Sell', orderType: 'Market' },
    { name: 'BTC/USD', quantity: '0.2', orderPrice: '51000', filledTotal: '0.1/0.2', tradeDirection: 'Buy', orderType: 'Limit' },
  ],
  tradeHistory: [
    { name: 'XRP/USD', filledTotal: '1000/1000', fillPriceOrderPrice: '0.50/0.55', tradeDirection: 'Sell', orderType: 'Market', time: '12:30 PM' },
    { name: 'BTC/USD', filledTotal: '0.3/0.3', fillPriceOrderPrice: '50500/51000', tradeDirection: 'Buy', orderType: 'Limit', time: '1:15 PM' },
    { name: 'ETH/USD', filledTotal: '2.0/2.0', fillPriceOrderPrice: '3100/3200', tradeDirection: 'Buy', orderType: 'Limit', time: '2:00 PM' },
    { name: 'ADA/USD', filledTotal: '500/500', fillPriceOrderPrice: '1.60/1.55', tradeDirection: 'Sell', orderType: 'Market', time: '3:30 PM' },
    { name: 'LTC/USD', filledTotal: '10/10', fillPriceOrderPrice: '158/155', tradeDirection: 'Buy', orderType: 'Market', time: '4:00 PM' },
  ]
};

const TradeComponent = () => {
  const [selectedTab, setSelectedTab] = useState('positions');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [assetQuantity, setAssetQuantity] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [quantityType, setQuantityType] = useState('USDT');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const openModal = (type, quantity) => {
    setModalType(type);
    setAssetQuantity(quantity);
    setOrderQuantity(0);
    setSliderValue(0);
    setRemainingQuantity(quantity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setSliderValue(value);
    const newOrderQuantity = (assetQuantity * value) / 100;
    setOrderQuantity(newOrderQuantity);
    setRemainingQuantity(Math.max(assetQuantity - newOrderQuantity, 0));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setOrderQuantity(value);
    const newSliderValue = (value / assetQuantity) * 100;
    setSliderValue(newSliderValue);
    setRemainingQuantity(Math.max(assetQuantity - value, 0));
  };

  const handleQuantityTypeChange = (type) => {
    setQuantityType(type);
  };
  const openConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="trade-container">
      <div className="tab-section">
        <span className={`tab-item ${selectedTab === 'positions' ? 'active' : ''}`} onClick={() => handleTabClick('positions')}>Positions</span>
        <span className={`tab-item ${selectedTab === 'pendingOrders' ? 'active' : ''}`} onClick={() => handleTabClick('pendingOrders')}>Pending Orders</span>
        <span className={`tab-item ${selectedTab === 'tradeHistory' ? 'active' : ''}`} onClick={() => handleTabClick('tradeHistory')}>Trade History</span>
      </div>

      {selectedTab === 'positions' && (
        <div className="positions-section">
          <div className="heading-row">
            <span>Name</span>
            <span>Quantity</span>
            <span>Value in USD</span>
            <span>Entry Price</span>
            <span>Market Price</span>
            <span>TP/SL</span>
            <span>Close By</span>
          </div>
          {dummyData.positions.map((position, index) => (
            <div key={index} className="data-row">
              <span>{position.name}</span>
              <span>{position.quantity}</span>
              <span>{position.valueUSD}</span>
              <span>{position.entryPrice}</span>
              <span>{position.marketPrice}</span>
              <span>{position.tpSl}</span>
              <span className="close-by">
                <button className="action-button" onClick={() => openModal('limit', position.quantity)}>Limit</button>
                <button className="action-button" onClick={() => openModal('market', position.quantity)}>Market</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'pendingOrders' && (
        <div className="pending-orders-section">
          <div className="heading-row">
            <span>Name</span>
            <span>Quantity</span>
            <span>Order Price</span>
            <span>Filled/Total</span>
            <span>Trade Direction</span>
            <span>Order Type</span>
          </div>
          {dummyData.pendingOrders.map((order, index) => (
            <div key={index} className="data-row">
              <span>{order.name}</span>
              <span>{order.quantity}</span>
              <span>{order.orderPrice}</span>
              <span>{order.filledTotal}</span>
              <span>{order.tradeDirection}</span>
              <span>{order.orderType}</span>
              <span className="close-by">
                <button className="action-button" onClick={openConfirmationModal}>Close</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'tradeHistory' && (
        <div className="trade-history-section">
          <div className="heading-row">
            <span>Name</span>
            <span>Filled/Total</span>
            <span>Fill Price/Order Price</span>
            <span>Trade Direction</span>
            <span>Order Type</span>
            <span>Time</span>
          </div>
          {dummyData.tradeHistory.map((history, index) => (
            <div key={index} className="data-row">
              <span>{history.name}</span>
              <span>{history.filledTotal}</span>
              <span>{history.fillPriceOrderPrice}</span>
              <span>{history.tradeDirection}</span>
              <span>{history.orderType}</span>
              <span>{history.time}</span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="label">Asset Amount: {remainingQuantity}</span>
            
            <div className="quantity-type-section">
              <span
                className={`quantity-type ${quantityType === 'USDT' ? 'active' : ''}`}
                onClick={() => handleQuantityTypeChange('USDT')}
              >
                USDT
              </span>
              <span
                className={`quantity-type ${quantityType === 'Asset' ? 'active' : ''}`}
                onClick={() => handleQuantityTypeChange('Asset')}
              >
                Asset
              </span>
            </div>
            
            {modalType === 'limit' && (
              <>
                <label htmlFor="orderPrice" className='title'>Order Price:</label>
                <input
                  type="number"
                  id="orderPrice"
                  className="modal-input"
                />
              </>
            )}

            <label htmlFor="orderQuantity" className='title'>Order Quantity:</label>
            <input
              type="number"
              id="orderQuantity"
              className="modal-input"
              value={orderQuantity}
              onChange={handleQuantityChange}
            />
            <input
              type="range"
              id="quantitySlider"
              className="modal-slider"
              min="0"
              max="100"
              step="1"
              value={sliderValue}
              onChange={handleSliderChange}
            />
             <div
            className="button-group">
            <button className="form-button confirm-button" onClick={closeModal}>Confirm</button>
            <button className="form-button confirm-button" onClick={closeModal}>Cancel</button>
            </div>
       
          </div>
        </div>
    
      )}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="title">Do you want to cancel this order?</span>
            <div
            className="button-group">
            <button className="form-button confirm-button" onClick={closeConfirmationModal}>Confirm</button>
            <button className="form-button confirm-button" onClick={closeConfirmationModal}>Cancel</button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TradeComponent;
