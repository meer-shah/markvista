import React, { useEffect, useState } from 'react';
import './accountgrowth.css';
import Achart from './Chart/accchart'; // Importing the chart component

const Accgrowth = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current balance
        const balanceResponse = await fetch('http://localhost:4000/api/order/showusdtbalance');
        const currentBalance = await balanceResponse.json();

        // Fetch PnL data
        const pnlResponse = await fetch('http://localhost:4000/api/order/closed-pnl');
        const pnlResult = await pnlResponse.json();

        // Ensure both requests succeeded
        if (!Array.isArray(pnlResult.trades)) {
          throw new Error('Invalid PnL data format. Expected trades array.');
        }

        // Transform PnL data and calculate the initial balance
        const transformedData = transformPnLData(pnlResult.trades, currentBalance);
        setData(transformedData); // Store the transformed data
      } catch (err) {
        setError(err.message || 'Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs only once when the component mounts

  const transformPnLData = (trades, currentBalance) => {
    let totalLosses = 0;
    let totalWins = 0;

    // Calculate total wins and losses
    trades.forEach((trade) => {
      const pnl = parseFloat(trade.closedPnl) || 0;
      if (pnl > 0) totalWins += pnl; // Sum of all profits
      if (pnl < 0) totalLosses += Math.abs(pnl); // Sum of all losses
    });

    // Calculate initial balance
    const initialBalance = currentBalance + totalLosses - totalWins;
    console.log('Initial Balance:', initialBalance);

    // Group trades by date and calculate cumulative balance changes
    const groupedData = trades.reduce((acc, trade) => {
      const pnl = parseFloat(trade.closedPnl) || 0;
      const date = new Date(parseInt(trade.updatedTime)).toLocaleDateString();

      // Group by date
      if (!acc[date]) {
        acc[date] = { date, pnl: 0 };
      }
      acc[date].pnl += pnl;

      return acc;
    }, {});

    // Transform grouped data into array and accumulate balances
    let cumulativeBalance = initialBalance;
    const transformedData = Object.values(groupedData)
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
      .map((entry) => {
        cumulativeBalance += entry.pnl;
        return { date: entry.date, AccountBalance: cumulativeBalance.toFixed(2) };
      });

    // Add initial balance as the starting point for the chart
    transformedData.unshift({ date: "Initial", AccountBalance: initialBalance.toFixed(2) });

    return transformedData;
  };

  // Handling loading state
  if (loading) return <div>Loading account growth data...</div>;

  // Handling error state
  if (error) return <div>{error}</div>;

  return (
    <div>
      <p className='small__heading Asmall__heading'>Account Growth Over Time</p>
      <Achart data={data} /> {/* Passing the chart data to the chart component */}
    </div>
  );
};

export default Accgrowth;
