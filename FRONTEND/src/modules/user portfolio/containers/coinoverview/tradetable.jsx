import React from 'react';
import './coinoverview.css'; // Import the CSS file for styling

const TradedTable = ({ title, data, isProfit }) => {
  return (
    <div className="section">
      <p>{title}</p>
      <div className="table-data-wrapper">
        <table className="table-head">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>{isProfit ? 'Profit (USD)' : 'Loss (USD)'}</th>
            </tr>
          </thead>
        </table>
        <div className="table-body-wrapper height">
          <table className="table-body">
            <tbody>
              {data.map((pair, index) => (
                <tr key={pair.symbol}>
                  <td>{index + 1}</td>
                  <td>{pair.symbol}</td>
                  <td style={{ color: isProfit ? 'var(--color-profit)' : 'var(--color-loss)' }}>
                    ${isProfit ? pair.totalPnL.toFixed(2) : pair.totalLoss.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TradedTable);
