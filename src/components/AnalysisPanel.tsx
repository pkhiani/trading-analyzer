import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Signal {
  type: 'buy' | 'sell' | 'warning';
  symbol: string;
  price: string;
  reason: string;
  timestamp: string;
}

const signals: Signal[] = [
  {
    type: 'buy',
    symbol: 'AAPL',
    price: '$175.23',
    reason: 'Golden Cross pattern detected',
    timestamp: '2 min ago'
  },
  {
    type: 'warning',
    symbol: 'TSLA',
    price: '$242.50',
    reason: 'High volatility detected',
    timestamp: '5 min ago'
  },
  {
    type: 'sell',
    symbol: 'MSFT',
    price: '$390.27',
    reason: 'Resistance level reached',
    timestamp: '10 min ago'
  }
];

const AnalysisPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Market Signals</h2>
      <div className="space-y-4">
        {signals.map((signal, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50">
            {signal.type === 'buy' && (
              <TrendingUp className="text-green-500 mt-1" size={20} />
            )}
            {signal.type === 'sell' && (
              <TrendingDown className="text-red-500 mt-1" size={20} />
            )}
            {signal.type === 'warning' && (
              <AlertTriangle className="text-yellow-500 mt-1" size={20} />
            )}
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-semibold">{signal.symbol}</span>
                <span className="text-gray-500 text-sm">{signal.timestamp}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{signal.reason}</div>
              <div className="text-sm font-medium mt-1">{signal.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPanel;