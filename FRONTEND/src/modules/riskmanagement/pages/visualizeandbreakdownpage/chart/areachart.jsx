import React from 'react';
import './areachart.css';
import Achart from '../../../containers/Areachart/Achart';

const Areachart = ({ data }) => {
  // Extracting only 'No' and 'NewBalance' fields for the chart
  const chartData = data.map(item => ({
    No: item.No,
    AccountBalance: item.NewBalance,
  }));

  return (
    <div className='app__wrapper'>
      <div className='chart-container'>
        <p className='small__heading Asmall__heading'>Account Growth Over Number of Trades</p>
        <Achart data={chartData} />
      </div>
    </div>
  );
};

export default Areachart;
