import React, { useEffect, useState } from 'react';
import './coinoverview.css'; // Import the CSS file for styling
import TradedTable from './tradetable'; // Import the reusable table component

const CoinOverview = () => {
  const [bestTradedPairs, setBestTradedPairs] = useState([]); // State for best traded coins
  const [worstTradedPairs, setWorstTradedPairs] = useState([]); // State for worst traded coins
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    fetchCoinData();
  }, []);

  const fetchCoinData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/order/closed-pnl"); // Replace with your endpoint
      const tradeData = await response.json();
      console.log("Trade Data:", tradeData);

      // Update state with best and worst traded coins
      setBestTradedPairs(tradeData.bestCoins || []); // Assign empty array if data is unavailable
      setWorstTradedPairs(tradeData.worstCoins || []);
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading coin overview...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  return (
    <div className="overview-container">
      <TradedTable
        title="Well Traded Coins"
        data={bestTradedPairs}
        isProfit={true}
      />
      <TradedTable
        title="Worst Traded Coins"
        data={worstTradedPairs}
        isProfit={false}
      />
    </div>
  );
};

export default React.memo(CoinOverview);
