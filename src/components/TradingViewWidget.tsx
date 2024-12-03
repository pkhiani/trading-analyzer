import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
                  "studies": [
            "STD;EMA"
          ],
        "support_host": "https://www.tradingview.com"
      }`;
    
      if (container.current) {
        container.current.innerHTML = '';
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";
        container.current.appendChild(widgetContainer);
        container.current.appendChild(script);
      }
  
      return () => {
        if (container.current) {
          container.current.innerHTML = '';
        }
      };
    }, [symbol]);
  
    return (
      <div 
        className="tradingview-widget-container" 
        ref={container} 
        style={{ 
          height: "100%", 
          width: "100%",
          background: "white",
          borderRadius: "0.5rem",
          overflow: "hidden"
        }}
      >
        <div 
          className="tradingview-widget-container__widget" 
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    );
  }
  
  export default memo(TradingViewWidget);