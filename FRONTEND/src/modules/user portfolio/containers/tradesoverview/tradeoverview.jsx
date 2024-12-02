import React, { useEffect, useState } from "react";
import "./tradeoverview.css";

const TradeOverview = () => {
  const [matrices, setMatrices] = useState(null); // Initialize with null

  useEffect(() => {
    fetchMatrices();
  }, []);

  const fetchMatrices = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/order/closed-pnl"); // Replace with your endpoint
      const tradeHistory = await response.json();
      console.log("Trade History:", tradeHistory);
      setMatrices(tradeHistory); // Extract the metrics from the response
    } catch (error) {
      console.error("Error fetching trade metrics:", error);
    }
  };

  // Mapping the trade data dynamically from `matrices`
  const tradeData = matrices
    ? [
        { number: matrices.bestTrade.closedPnl.toFixed(2), heading: "Best Trade" },
        { number: matrices.worstTrade.closedPnl.toFixed(2), heading: "Worst Trade" },
        { number: matrices.metrics.avgTradeOutput.toFixed(2), heading: "Average Trade" },
        { number: matrices.metrics.totalTrades.toFixed(2), heading: "No. of Trades" },
        { number: `${matrices.metrics.winRate.toFixed(2)}%`, heading: "Winrate" }, // Format percentage
        { number: matrices.metrics.avgLosingTrade.toFixed(2), heading: "Average Loss" },
        { number: matrices.metrics.avgWinningTrade.toFixed(2), heading: "Average Win" },
      ]
    : [];

  return (
    <div className="tradeoverview-container">
      <h2 className="small__heading additional">Trades Summary</h2>
      <div className="trade-summary-section">
        {tradeData.length > 0 ? (
          tradeData.map((item, index) => (
            <div key={index} className="trade-summary-item">
              <div className="trade-number">{item.number}</div>
              <div className="trade-heading p__basic">{item.heading}</div>
            </div>
          ))
        ) : (
          <div>Loading metrics...</div>
        )}
      </div>
    </div>
  );
};

export default TradeOverview;
