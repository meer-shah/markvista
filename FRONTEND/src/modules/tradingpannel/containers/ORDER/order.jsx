import axios from "axios";
import React, { useState, useEffect } from 'react';
import './order.css';

const Order = ({ id, title, onDelete , symbol , setSymbol}) => {
  const initialBalance = 1000; // Initial balance amount
  const initialQuantity = 100; // Initial asset amount
  const [positionType, setPositionType] = useState('open');
  const [orderType, setOrderType] = useState('limit');
  const [leverageType, setLeverageType] = useState('cross');
  const [leverageAmount, setLeverageAmount] = useState(1);
  const [orderPrice, setOrderPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [accountBalance, setAccountBalance] = useState(initialBalance); // Example balance
  const [assetAmount, setAssetAmount] = useState(initialQuantity); // Example asset amount
  const [quantityType, setQuantityType] = useState('USDT'); // State to track selected quantity type
  const [riskProfileName, setRiskProfileName] = useState(''); // State to hold the risk profile name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isChecked, setIsChecked] = useState()
  const [activeProfileId, setActiveProfileId] = useState(null);


  const onToggle = async (id) => {
    const newActiveId = activeProfileId === id ? null : id;
  
    try {
      const payload = { ison: newActiveId !== null }; // Set 'ison' to true or false based on toggle
  
      // Make the PUT request to activate/deactivate the risk profile
      const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}/activate`, {
        method: 'PUT', // Change to PUT for the activate endpoint
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to activate/deactivate risk profile');
      }
  setIsChecked(false)
    } catch (error) {
      console.error('Error toggling risk profile:', error);
    }
  };

  // Fetch risk profile name from the database
  useEffect(() => {
    const fetchRiskProfiles = async () => {
      try {
        // Change the URL to the new endpoint for active risk profiles
        const response = await fetch('http://localhost:4000/api/riskprofiles/getactive');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setRiskProfileName(data.title);
        setIsChecked(data.ison)
      } catch (error) {
        console.error('Error fetching risk profiles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRiskProfiles();
  }, []);
  

  // Handle position type change
  const handlePositionTypeChange = (type) => {
    setPositionType(type);
    setOrderQuantity(0);
    if (type === 'close') {
      setOrderType('limit'); // Reset order type to 'limit' when closing
    }
  };

  // Handle order type change
  const handleOrderTypeChange = (type) => {
    setOrderType(type);
  };

  // Handle quantity type change
  const handleQuantityTypeChange = (type) => {
    setQuantityType(type);
  };

  // Calculate order quantity based on slider percentage
  const handleQuantitySliderChange = (value) => {
    const percentage = parseFloat(value);
    let quantity;
    if (positionType === 'open') {
      quantity = (percentage / 100) * initialBalance;
    } else {
      quantity = (percentage / 100) * initialQuantity;
    }
    setOrderQuantity(Math.max(0, quantity));
  };

  // Handle order quantity input change
  const handleOrderQuantityChange = (value) => {
    const quantity = parseFloat(value);
    if (!isNaN(quantity)) {
      setOrderQuantity(Math.max(0, quantity));
    }
  };

  // Calculate remaining balance or asset amount after setting order quantity
  useEffect(() => {
    if (positionType === 'open') {
      setAccountBalance(Math.max(0, initialBalance - orderQuantity)); // Update account balance
    } else {
      setAssetAmount(Math.max(0, initialQuantity - orderQuantity)); // Update asset amount
    }
  }, [orderQuantity, positionType]);

  const handleOpenLong =async () => {
    if (parseFloat(stopLoss) >= parseFloat(orderPrice) || parseFloat(takeProfit) <= parseFloat(orderPrice)) {
      alert('For Open Long: Stop Loss must be lower and Take Profit must be higher than Order Price');
    } else {
      // Handle the Open Long logic

      const data ={
        symbol,
        side:"Buy",
        category:"linear",
        qty:orderQuantity.toString(),
        orderType,
        price: orderPrice,
        positionIdx: 0,
        timeInForce: "GTC",
        takeProfit,
        stopLoss,

      }
      console.log(data)
      const response = await axios.post("http://localhost:4000/api/order/place-orderwithconditions",data)
      console.log(response.data)
      alert('Open Long Position');
    }
  };

  const handleOpenShort = async() => {
    if (parseFloat(stopLoss) <= parseFloat(orderPrice) || parseFloat(takeProfit) >= parseFloat(orderPrice)) {
      alert('For Open Short: Stop Loss must be higher and Take Profit must be lower than Order Price');
    } else {
      // Handle the Open Short logic
      const data ={
        symbol,
        side:"Sell",
        category:"linear",
        qty:orderQuantity.toString(),
        orderType,
        price: orderPrice,
        positionIdx: 0,
        timeInForce: "GTC",
        takeProfit,
        stopLoss,
        

      }
      console.log(data)
      const response = await axios.post("http://localhost:4000/api/order/place-orderwithconditions",data)
      console.log(response.data)
    
    
      alert('Open Short Position');
    }
  };

  return (
    <div className='main'>
      <div className='riskprofileactive'>
        <div>
          {riskProfileName}
        </div>

        
      </div>



      <div className="crypto-leverage-container">
        <div className="leverage-section">
          <div className="leverage-item">
            <label htmlFor="leverageType">Leverage Type:</label>
            <select
              id="leverageType"
              value={leverageType}
              onChange={(e) => setLeverageType(e.target.value)}
            >
              <option value="cross">Cross</option>
              <option value="isolated">Isolated</option>
            </select>
          </div>
          <div className="leverage-item">
            <label htmlFor="leverageAmount">Leverage Amount:</label>
            <input
              id="leverageAmount"
              type="number"
              value={leverageAmount}
              onChange={(e) => setLeverageAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="position-section">
          <span
            className={`position-text ${positionType === 'open' ? 'active' : ''}`}
            onClick={() => handlePositionTypeChange('open')}
          >
            Open
          </span>
          <span
            className={`position-text ${positionType === 'close' ? 'active' : ''}`}
            onClick={() => handlePositionTypeChange('close')}
          >
            Close
          </span>
        </div>

        {positionType && (
          <div className="order-type-section">
            <span
              className={`order-type-text ${orderType === 'limit' ? 'active' : ''}`}
              onClick={() => handleOrderTypeChange('limit')}
            >
              Limit
            </span>
            <span
              className={`order-type-text ${orderType === 'market' ? 'active' : ''}`}
              onClick={() => handleOrderTypeChange('market')}
            >
              Market
            </span>
          </div>
        )}

        <div className="order-section">
          <p className="balance-info">
            {positionType === 'open'
              ? `Account Balance: $${accountBalance}`
              : `Asset Amount: ${assetAmount}`}
          </p>

          {orderType === 'limit' && (
            <>
              <label htmlFor="orderPrice">Order Price:</label>
              <input
                id="orderPrice"
                type="number"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
              />
            </>
          )}

          <div className="order-quantity-section">
            <label htmlFor="orderQuantity">Order Quantity:</label>

            <div className="quantity-options">
              <span
                className={`quantity-option ${quantityType === 'USDT' ? 'active' : ''}`}
                onClick={() => handleQuantityTypeChange('USDT')}
              >
                USDT
              </span>
              {/* <span
                className={`quantity-option ${quantityType === 'Asset' ? 'active' : ''}`}
                onClick={() => handleQuantityTypeChange('Asset')}
              >
                Asset
              </span> */}
            </div>
          </div>

          <input
            id="orderQuantity"
            type="number"
            value={orderQuantity}
            onChange={(e) => handleOrderQuantityChange(e.target.value)}
          />

          <input
            id="quantitySlider"
            type="range"
            min="0"
            max="100"
            step="25"
            value={(orderQuantity / (positionType === 'open' ? initialBalance : initialQuantity)) * 100}
            onChange={(e) => handleQuantitySliderChange(e.target.value)}
            className="quantity-slider"
          />

          {positionType === 'open' && orderType === 'limit' && (
            <>
              <label htmlFor="takeProfit">Take Profit:</label>
              <input
                id="takeProfit"
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
              />
              <label htmlFor="stopLoss">Stop Loss:</label>
              <input
                id="stopLoss"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
            </>
          )}

          {positionType === 'open' && orderType === 'market' && (
            <>
              <label htmlFor="takeProfit">Take Profit:</label>
              <input
                id="takeProfit"
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
              />
              <label htmlFor="stopLoss">Stop Loss:</label>
              <input
                id="stopLoss"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
            </>
          )}

          <div className="action-buttons">
            {positionType === 'open' ? (
              <div className="button-group">
                <button className="form-button btn-buy" onClick={handleOpenLong}>
                  Open Long
                </button>
                <button className="form-button btn-sell" onClick={handleOpenShort}>
                  Open Short
                </button>
              </div>
            ) : (
              <div className="button-group">
                <button className="form-button btn-buy">Close Long</button>
                <button className="form-button btn-sell">Close Short</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
