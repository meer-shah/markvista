'use client';
import React, { useState, useEffect } from 'react';
import './longshortanalysis.css';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const LSComponent = () => {
  const [tradeData, setTradeData] = useState([]); // State to store trade data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    fetchTradeData();
  }, []);

  const fetchTradeData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/order/closed-pnl"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch trade data");
      }
      const data = await response.json();

      // Transform data for the chart
      const transformedData = transformTradeData(data.trades || []);
      setTradeData(transformedData);
    } catch (err) {
      console.error("Error fetching trade data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transformTradeData = (trades) => {
    // Group trades by date and sum LONG/SHORT amounts
    const groupedData = trades.reduce((acc, trade) => {
      const date = new Date(parseInt(trade.createdTime)).toLocaleDateString(); // Ensure `createdTime` is a valid integer in milliseconds
      const side = trade.side.toLowerCase();
      const pnl = parseFloat(trade.closedPnl) || 0;
  
      if (!acc[date]) {
        acc[date] = { name: date, LONG: 0, SHORT: 0 };
      }
  
      if (side === "sell") {
        acc[date].LONG += pnl;
      } else if (side === "buy") {
        acc[date].SHORT += pnl;
      }
  
      return acc;
    }, {});
  
    // Convert object to array and sort by date
    return Object.values(groupedData).sort((a, b) => new Date(a.name) - new Date(b.name));
  };
  
  
  if (loading) return <div>Loading trade data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p className="small__heading Asmall__heading">Long Short Analysis</p>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={tradeData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <YAxis />
          <XAxis dataKey="name" />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{
              background: "#555",
              color: "var(--color-text)",
              fontFamily: "var(--basic-font-family)",
              fontSize: "12px",
              padding: "6px",
            }}
            cursor={{ stroke: "#fff", strokeWidth: 1 }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="LONG"
            stroke="#298969"
            fill="#298969"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="SHORT"
            stroke="#902424"
            fill="#902424"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-4 rounded-md"
        style={{
          background: "#555",
          color: "var(--color-text)",
          fontFamily: "var(--basic-font-family)",
          fontSize: "12px",
          padding: "6px",
        }}
      >
        <p className="text-medium">{`Date: ${label}`}</p>
        <p className="text-sm">
          LONG:
          <span className="ml-2">${payload[0].value}</span>
        </p>
        <p className="text-sm ">
          SHORT:
          <span className="ml-2">${payload[1].value}</span>
        </p>
      </div>
    );
  }

  return null; // Return null when not active or no payload
};

export default LSComponent;
