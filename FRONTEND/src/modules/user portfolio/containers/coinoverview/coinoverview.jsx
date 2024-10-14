
import React from 'react';
import './coinoverview.css'; // Import the CSS file for styling
import TradedTable from './tradetable'; // Import the reusable table component

const CoinOverview = () => {
  const bestTradedPairs = [
    { id: 1, name: 'BTC', profit: 50, holdings: 25 },
    { id: 2, name: 'ETH', profit: 30, holdings: 20 },
    { id: 3, name: 'BNB', profit: 20, holdings: 15 },
    { id: 4, name: 'ADA', profit: 25, holdings: 10 },
    { id: 5, name: 'SOL', profit: 15, holdings: 8 },
    { id: 6, name: 'DOT', profit: 18, holdings: 12 },
    { id: 7, name: 'AVAX', profit: 22, holdings: 14 },
    { id: 8, name: 'MATIC', profit: 28, holdings: 18 },
    { id: 9, name: 'LUNA', profit: 12, holdings: 6 },
    { id: 10, name: 'ATOM', profit: 10, holdings: 5 },
    { id: 11, name: 'UNI', profit: 26, holdings: 13 },
    { id: 12, name: 'LINK', profit: 24, holdings: 11 },
    { id: 13, name: 'XMR', profit: 14, holdings: 7 },
    { id: 14, name: 'AAVE', profit: 16, holdings: 9 },
    { id: 15, name: 'FTT', profit: 19, holdings: 10 },
    { id: 16, name: 'VET', profit: 21, holdings: 13 },
    { id: 17, name: 'THETA', profit: 17, holdings: 9 },
    { id: 18, name: 'FIL', profit: 11, holdings: 6 },
    { id: 19, name: 'TRX', profit: 13, holdings: 7 },
    { id: 20, name: 'NEAR', profit: 23, holdings: 14 },
  ];

  const worstTradedPairs = [
    { id: 1, name: 'DOGE', loss: 40, holdings: 10 },
    { id: 2, name: 'XRP', loss: 20, holdings: 5 },
    { id: 3, name: 'SHIB', loss: 30, holdings: 8 },
    { id: 4, name: 'BCH', loss: 25, holdings: 12 },
    { id: 5, name: 'EOS', loss: 18, holdings: 6 },
    { id: 6, name: 'XTZ', loss: 22, holdings: 9 },
    { id: 7, name: 'IOTA', loss: 28, holdings: 7 },
    { id: 8, name: 'ZIL', loss: 15, holdings: 4 },
    { id: 9, name: 'KSM', loss: 12, holdings: 3 },
    { id: 10, name: 'SUSHI', loss: 26, holdings: 10 },
    { id: 11, name: 'CRV', loss: 24, holdings: 8 },
    { id: 12, name: 'RUNE', loss: 14, holdings: 5 },
    { id: 13, name: 'YFI', loss: 20, holdings: 9 },
    { id: 14, name: 'ONE', loss: 17, holdings: 6 },
    { id: 15, name: 'ALGO', loss: 19, holdings: 7 },
    { id: 16, name: 'DASH', loss: 16, holdings: 4 },
    { id: 17, name: 'ZEC', loss: 23, holdings: 9 },
    { id: 18, name: 'KAVA', loss: 13, holdings: 3 },
    { id: 19, name: 'REN', loss: 21, holdings: 8 },
    { id: 20, name: 'GRT', loss: 27, holdings: 10 },
  ];

  return (
    <div className="overview-container">
      <TradedTable
        title="Well Traded Coins"
        data={bestTradedPairs}
        isProfit={true}
      />
      <TradedTable
        title="Worst Traded Coins"
        data={worstTradedPairs}
        isProfit={false}
      />
    </div>
  );
};

export default React.memo(CoinOverview);
