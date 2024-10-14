import React from 'react';
import './acchart.css';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// Utility function to format dates
const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) throw new Error('Invalid Date');
    const currentDate = new Date();
    const daysRange = Math.round((currentDate - date) / (1000 * 60 * 60 * 24));
    
    // Format as month and year if the range is more than 30 days
    if (daysRange > 30) {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    }
    
    // Otherwise, format as day and month
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Helper function to adjust ticks
const adjustTicks = (tickValues) => {
  return tickValues.filter((value, index) => index % 30 === 0); // Adjust to show 1 tick per month
};

const Achart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          ticks={adjustTicks(data.map(item => item.date))} // Adjust ticks based on the data
          interval={0} // Display all ticks, but they are filtered by `adjustTicks`
        />
        <YAxis />
        <Tooltip
          content={<CustomTooltip />}

          wrapperStyle={{
            background: '#555',
            color: 'var(--color-text)',
            fontFamily: 'var(--basic-font-family)',
            fontSize: '12px',
            padding: '6px',
          }}
          cursor={{ stroke: '#fff', strokeWidth: 1 }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="AccountBalance"
          stroke="var(--color-detailing)"
          fill="var(--color-detailing)"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const balanceValue = typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value;

    return (
      <div className="p-4 rounded-md" style={{ background: '#555', color: 'var(--color-text)', fontFamily: 'var(--basic-font-family)', fontSize: '12px', padding: '6px' }}>
        <p className="text-medium">{`Date: ${label}`}</p>
        <p className="text-sm">
          Account Balance:
          <span className="ml-2">${balanceValue}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default Achart;
