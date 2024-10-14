import React from 'react';
import './accountgrowth.css';
import Achart from './Chart/accchart';

const Accgrowth = () => {
  const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  const generateData = (startDate, endDate, initialBalance, dailyChange) => {
    const dates = generateDateRange(new Date(startDate), new Date(endDate));
    return dates.map((date, index) => ({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      AccountBalance: initialBalance + dailyChange * index,
    }));
  };

  const startDate = '2024-05-01';
  const endDate = '2024-07-31'; // 3 months later
  const initialBalance = 5000;
  const dailyChange = 10; // Balance increases by $10 each day

  // Generate data for the chart
  const data = generateData(startDate, endDate, initialBalance, dailyChange);

  // Extracting 'date' and 'AccountBalance' fields for the chart
  const chartData = data.map(item => ({
    date: item.date,
    AccountBalance: item.AccountBalance,
  }));

  return (
    
      <div>
         <p className='small__heading Asmall__heading'>Account Growth Over Time</p>
         <Achart data={chartData} />
      </div>
        
      
    
  );
};

export default Accgrowth;
