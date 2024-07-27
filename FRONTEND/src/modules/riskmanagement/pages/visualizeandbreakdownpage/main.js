
// import React, { useState } from 'react';
// import Breakdown from './breakdown/breakdown';
// import AreaChart from './chart/areachart';
// import Tabledata from './visulaize/Table';
// import { generateData } from '../../constants/index';

// const Main = () => {
//   const [dummyData, setDummyData] = useState(
//     generateData(
//       10,    // count: Number of trades to simulate
//       0.5,   // winRate: Probability of winning a trade (0-1)
//       2,     // riskRewardRatio: Ratio of risk to reward
//       100,   // accountSize: Initial account size
//       1,     // initialRiskPerTrade: Initial risk per trade as a percentage of account size
//       100,    // increaseOnWin: Percentage increase in risk after a win
//       0,    // decreaseOnLoss: Percentage decrease in risk after a loss
//       100,    // maxRisk: Maximum allowable risk percentage
//       0,   // minRisk: Minimum allowable risk percentage
//       1000,     // reset: Number of consecutive wins or losses before resetting risk to initial value
//       0,    // growthThreshold: Growth threshold percentage for payouts
//       0     // payoutPercentage: Payout percentage of profits above the growth threshold
//     )
//   );
//    // Initial dummy data

//   return (
//     <div className="app">
//       <Breakdown/>,
//       <Tabledata data={dummyData} setData={setDummyData} />,
//       <AreaChart data={dummyData} />
      
//     </div>
//   );
// };

// export default Main;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breakdown from './breakdown/breakdown';
import AreaChart from './chart/areachart';
import Tabledata from './visulaize/Table';
import { generateData } from '../../constants/index';

const Main = () => {
  const { id } = useParams();
  const [dummyData, setDummyData] = useState([]);

  return (
    <div className="app">
      <Breakdown id={id} setData={setDummyData} />
      <Tabledata data={dummyData} setData={setDummyData} />
      <AreaChart data={dummyData} />
    </div>
  );
};

export default Main;

