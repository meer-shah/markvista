

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Breakdown from './breakdown/breakdown';
// import AreaChart from './chart/areachart';
// import Tabledata from './visulaize/Table';


// const Main = () => {
//   const { id } = useParams();
//   const [dummyData, setDummyData] = useState([]);

//   return (
//     <div className="app">
//       <Breakdown id={id} setData={setDummyData} />
//       <Tabledata data={dummyData} setData={setDummyData} />
//       <AreaChart data={dummyData} />
//     </div>
//   );
// };

// export default Main;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Breakdown from './breakdown/breakdown';
import AreaChart from './chart/areachart';
import Tabledata from './visulaize/Table';

const Main = () => {
  const { id } = useParams();
  const [dummyData, setDummyData] = useState([]);
  const [isStrategyRun, setIsStrategyRun] = useState(false); // Track if strategy is run

  return (
    <div className="app">
      <Breakdown id={id} setData={setDummyData} setIsStrategyRun={setIsStrategyRun} />
      {isStrategyRun && (
        <>
          <Tabledata data={dummyData} setData={setDummyData} />
          <AreaChart data={dummyData} />
        </>
      )}
    </div>
  );
};

export default Main;
