import React from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import App from './App';
import { Description, Inputpart1, Inputpart2, Riskprofile, Main } from './modules/riskmanagement/pages';
import Trade from './modules/tradingpannel/pages/trade/trade';
import Portfoliooverview from './modules/user portfolio/pages/portfolio overview/portfoliooverview';
import Radio from './modules/user portfolio/pages/set goals/setgoals';
import Setgoals from './modules/user portfolio/pages/set goals/setgoals';
import APICONNECTION from './modules/tradingpannel/pages/connectapi/apiconnection';
// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'userportfolio',
        element: <Portfoliooverview/>,
      },
      {
        path: 'apiconnection',
        element: <APICONNECTION/>,
      },
      {
        path: 'setgoals',
        element: <Setgoals/>,
      },
      {
        path: 'description/:id',
        element: <Description />,
      },
      {
        path: 'inputpart1',
        element: <Inputpart1 />,
      },
      {
        path: 'inputpart2',
        element: <Inputpart2 />,
      },
      {
        path: 'riskprofile',
        element: <Riskprofile />,
      },
      
      {
        path: 'tradingpanel',
        element: <Trade/>,
      },
      {
        path: 'main',
        element: <Main />,
      },
      {
        path: 'main/:id',
        element: <Main />,
      },
      {
        path: 'edit1/:id',
        element: <Inputpart1 />, // Or whichever component handles the edit form
      },
      {
        path: 'edit2/:id',
        element: <Inputpart2 />, // Or whichever component handles the edit form
      }
    ],
  },
]);

// Render the application
ReactDOM.render(<RouterProvider router={router} />, document.getElementById('root'));
