'use client';
import React from 'react';
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

const productSales = [
  {
    name: 'Jan',
    LONG: 4000,
    SHORT: 2400,
  },
  {
    name: 'Feb',
     LONG: 3000,
    SHORT: 2210,
  },
  {
    name: 'Mar',
     LONG: 2000,
    SHORT: 2290,
  },
  {
    name: 'Apr',
     LONG: 2780,
    SHORT: 2000,
  },
  {
    name: 'May',
     LONG: 1890,
    SHORT: 2181,
  },
  {
    name: 'Jun',
     LONG: 2390,
    SHORT: 2500,
  },
];

const LSComponent = () => {
  return (
<div>
<p className='small__heading Asmall__heading'>Long Short Analysis</p>

    <ResponsiveContainer width="100%" height={400}>
       
      <AreaChart
        data={productSales}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <YAxis />
        <XAxis dataKey="name" />
        
        <Tooltip content={<CustomTooltip />} 
        wrapperStyle={{
          background: '#555',
          color: 'var(--color-text)',
          fontFamily: 'var(--basic-font-family)',
          fontSize: '12px',
          padding: '6px',
        }}
        cursor={{ stroke: '#fff', strokeWidth: 1 }}/>
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
      <div className="p-4 rounded-md" style={{ background: '#555', color: 'var(--color-text)', fontFamily: 'var(--basic-font-family)', fontSize: '12px', padding: '6px' }}>
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
