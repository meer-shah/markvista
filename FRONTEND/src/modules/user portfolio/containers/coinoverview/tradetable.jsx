import React from 'react';
import './coinoverview.css'; // Import the CSS file for styling

const TradedTable = ({ title, data, isProfit }) => {
  const renderLine = (percentage) => {
    const lineStyle = {
      width: `${percentage}%`,
      backgroundColor: isProfit ? 'var(--color-profit)' : 'var(--color-loss)',
      height: '100%',
    };
    return (
      <div className="line-container">
        <div className="line" style={lineStyle}></div>
      </div>
    );
  };

  return (
    <div className="section">
      <p>{title}</p>
      <div className="table-data-wrapper">
        <table className="table-head">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>{isProfit ? 'Profit' : 'Loss'}</th>
              <th>Holdings</th>
            </tr>
          </thead>
        </table>
        <div className="table-body-wrapper height">
          <table className="table-head">
            <tbody className="table-body">
              {data.map((pair) => (
                <tr key={pair.id}>
                  <td>{pair.id}</td>
                  <td>{pair.name}</td>
                  <td>
                    {renderLine(isProfit ? pair.profit : pair.loss)}
                    <br />
                    {isProfit ? (
                      <>
                        {pair.profit}% (${(pair.profit * 10).toFixed(2)})
                      </>
                    ) : (
                      <>
                        {pair.loss}% (${(pair.loss * 10).toFixed(2)})
                      </>
                    )}
                  </td>
                  <td>{pair.holdings}%</td>
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
