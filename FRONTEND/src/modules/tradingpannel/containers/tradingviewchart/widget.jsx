
    import React, { useEffect, useRef, useState, memo } from 'react';

    const TradingViewWidget = ({symbol , setSymbol}) => {
        const containerRef = useRef(null);
        // const [symbol, setSymbol] = useState('BTCUSDT');
    
        useEffect(() => {
            // Load the TradingView script
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.type = 'text/javascript';
            script.async = true;
            script.onload = () => {
                if (window.TradingView) {
                    loadChart(symbol);
                }
            };
            document.head.appendChild(script);
    
            // Cleanup script if the component unmounts
            return () => {
                document.head.removeChild(script);
            };
        }, [symbol]);
    
        const loadChart = (symbol) => {
            if (containerRef.current && window.TradingView) {
                new window.TradingView.widget({
                    autosize: true,
                    symbol: `BYBIT:${symbol}.P`,
                    interval: '5',
                    timezone: 'Asia/Karachi',
                    style: '1',
                    theme: 'dark',
                    locale: 'en',
                    withdateranges: true,
                    hide_side_toolbar: false,
                    allow_symbol_change: false, // Prevents user from searching/changing the symbol
                    details: true,
                    calendar: false,
                    toolbar_bg: '#ffffff',
                    container_id: containerRef.current.id,
                    support_host: "https://www.tradingview.com"
                });
            }
        };
    
        const handleSymbolChange = (event) => {
            setSymbol(event.target.value);
        };
    
        return (
            <div>
                <select onChange={handleSymbolChange} value={symbol}>
                    <option value="BTCUSDT">BTCUSDT</option>
                    <option value="ETHUSDT">ETHUSDT</option>
                </select>
                <br />
                <div
                    className="tradingview-widget-container"
                    id="tvchart"
                    ref={containerRef}
                    style={{ height: '86vh', width: '100%' }} // Changed width to 100vw
                ></div>
            </div>
        );
    };
    
    export default memo(TradingViewWidget);
    