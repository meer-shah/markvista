import React from 'react';
import './Table.css';

const Tabledata = ({ data, setData }) => {
  return (
    <div className="table-data-wrapper">
      <div className="table-data-form">
        <table className='table-head'>
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Trade Direction</th>
              <th>Risk %</th>
              <th>Outcome</th>
              <th>PNL (USD)</th>
              <th>Payout</th>
              <th>New Balance</th>
              
            </tr>
          </thead>
        </table>
        <div className="table-body-wrapper">
          <table className='table-head'>
            <tbody className="table-body">
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Date}</td>
                  <td>{item.TradeDirection}</td>
                  <td>{item.RiskPercentage}</td>
                  <td>{item.Outcome}</td>
                  <td>{item.PNL}</td>
                  <td>{item.Payout}</td>
                  <td>{item.NewBalance}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tabledata;
