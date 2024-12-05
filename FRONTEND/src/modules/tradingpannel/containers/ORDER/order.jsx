import axios from "axios";
import React, { useState, useEffect } from 'react';
import './order.css';

const Order = ({ id, title, onDelete , symbol , setSymbol}) => {
 const initialQuantity = 100; // Initial asset amount
  const [positionType, setPositionType] = useState('open');
  const [orderType, setOrderType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [accountBalance, setAccountBalance] = useState(''); // Example balance
  const [assetAmount, setAssetAmount] = useState(initialQuantity); // Example asset amount
  const [quantityType, setQuantityType] = useState('USDT'); // State to track selected quantity type
  const [riskProfileName, setRiskProfileName] = useState(''); // State to hold the risk profile name
  const [error, setError] = useState(null); // Error state
  const [isChecked, setIsChecked] = useState()
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [leverageType, setLeverageType] = useState("cross"); // Margin mode
  const [leverageAmount, setLeverageAmount] = useState(1); // Leverage amount
  const [loading, setLoading] = useState(false); // Loading state for updates


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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current balance
        const balanceResponse = await fetch('http://localhost:4000/api/order/showusdtbalance');
        const balanceData = await balanceResponse.json();
  
        if (balanceData !== undefined) {
          setAccountBalance(balanceData); // Set the account balance
        } else {
          throw new Error('Invalid balance data format.');
        }      
      } catch (err) {
        setError(err.message || 'Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); // Runs only once when the component mounts
  
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
 

  // Handle order quantity input change
  const handleOrderQuantityChange = (value) => {
    const quantity = parseFloat(value);
    if (!isNaN(quantity)) {
      setOrderQuantity(Math.max(0, quantity));
    }
  };

  // Calculate remaining balance or asset amount after setting order quantity


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
      const response = await axios.post("http://localhost:4000/api/order/place-order",data)
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
      const response = await axios.post("http://localhost:4000/api/order/place-order",data)
      console.log(response.data)
    
    
      alert('Open Short Position');
    }
  };
  const updateLeverageAmount = async (value) => {
    try {
      const data = {
        category: "linear",
        symbol, // Ensure this has a value
        buyLeverage: value.toString(),
        sellLeverage: value.toString(),
      };
  
      const response = await axios.post(
        "http://localhost:4000/api/order/set-leverage",
        data, // Pass as an object
        {
          headers: { "Content-Type": "application/json" }, // Explicitly set headers
        }
      );
  
      if (response.status === 200) {
        console.log("Leverage updated successfully");
      } else {
        throw new Error("Failed to update leverage amount.");
      }
    } catch (error) {
      console.error("Error updating leverage amount:", error);
    }
  };
  

  



  // Handle leverage amount change
  const handleLeverageAmountChange = async (value) => {
    setLeverageAmount(value); // Update local state
    await updateLeverageAmount(value); // Update on backend
  };


  return (
    <div className='main'>
      


      <div className="crypto-leverage-container">
      <div
style={{
    
    fontSize:'44px',
    display: 'flex',          // Use flexbox for centering
    justifyContent: 'center', // Center horizontally
    alignItems: 'center',     // Center vertically
    marginTop: '5%',           // Set upper margin to 0
    height: '100%', 
    flexWrap:'wrap',
    marginBottom:'10%',          // Ensure it fills the parent container (optional)
  }} className="p__heading ">{symbol}</div>

        <div className="leverage-section">

        <div className="position-section">
        <div>
        <div>
  <div
    style={{
      color: 'var(--color-detailing)', // Applying the desired color
      marginBottom: '7px',
      
      fontSize:'22px'           // Adding some space below the name
    }}
  >
    {riskProfileName}
  </div>
  <div>
    Risk Profile is Active
  </div>
</div>


        
      </div>
          
        </div>
          <div className="leverage-item">
          <label htmlFor="leverageAmount">Leverage Amount:</label>
          <input
              id="leverageAmount"
              type="number"
              min="1"
              max="100"
              value={leverageAmount}
              onChange={(e) => handleLeverageAmountChange(e.target.value)}
            />
          </div>
         
        </div>

        

        {positionType && (
          <div className="order-type-section">
            <span
              className={`order-type-text ${orderType === 'limit' ? 'active' : ''}`}
              onClick={() => handleOrderTypeChange('limit')}
            >
              Limit
            </span>
            {/* <span
              className={`order-type-text ${orderType === 'market' ? 'active' : ''}`}
              onClick={() => handleOrderTypeChange('market')}
            >
              Market
            </span> */}
          </div>
        )}

        <div className="order-section">
        
  <p className="balance-info">
    {positionType === 'open' ? (
      <>
        Account Balance: 
        <span style={{ color: 'var(--color-detailing)', fontWeight: 'bold' }}>
        ${accountBalance}
        </span>
      </>
    ) : (
      <>
        Asset Amount: 
        <span style={{ color: 'var(--color-detailing)', fontWeight: 'bold' }}>
          {assetAmount}
        </span>
      </>
    )}
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
                will be determined by Risk profile
              </span>
              {/* <span
                className={`quantity-option ${quantityType === 'Asset' ? 'active' : ''}`}
                onClick={() => handleQuantityTypeChange('Asset')}
              >
                Asset
              </span> */}
            </div>
          </div>
{/* 
          <input
            id="orderQuantity"
            type="number"
            value={orderQuantity}
            onChange={(e) => handleOrderQuantityChange(e.target.value)}
          /> */}

          {/* <input
            id="quantitySlider"
            type="range"
            min="0"
            max="100"
            step="25"
            value={(orderQuantity / (positionType === 'open' ? initialBalance : initialQuantity)) * 100}
            onChange={(e) => handleQuantitySliderChange(e.target.value)}
            className="quantity-slider"
          /> */}

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
{/* 
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
          )} */}

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