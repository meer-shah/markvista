import React from 'react';
import './Achart.css';
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

const Achart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ right: 30 }}>
        <XAxis dataKey="No" />
        <YAxis />
        <CartesianGrid strokeOpacity={0} />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{
            
            color: 'var(--color-white)',
            fontFamily: 'var(--basic-font-family)',
            fontSize: '12px',
            padding: '6px',
          }}
          cursor={{ stroke: 'var(--color-white)', strokeWidth: 1 }}
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
      <div className="p-4 rounded-md" style={{ background: 'var(--color-section)', color: 'var(--color-text)', fontFamily: 'var(--basic-font-family)', fontSize: '10px', padding: '6px' }}>
        <p className="text-medium">{`Number of Trades: ${payload[0].payload.No}`}</p>
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
