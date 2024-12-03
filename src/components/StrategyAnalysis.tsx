import React from 'react';
import { TrendingUp, TrendingDown, Target, Shield } from 'lucide-react';
import type { StrategyAnalysis } from '../services/tradingStrategy';

interface StrategyAnalysisProps {
  analysis: StrategyAnalysis | null;
}

const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeframeAnalysis timeframes={analysis.timeframes} />
        <EntryPoints entryPoints={analysis.entryPoints} stopLoss={analysis.stopLoss} />
      </div>
    </div>
  );
};

const TimeframeAnalysis: React.FC<{ timeframes: StrategyAnalysis['timeframes'] }> = ({ timeframes }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Timeframe Analysis</h3>
    
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h4 className="font-medium text-gray-700">Hourly</h4>
        <div className="flex items-center gap-2 mt-1">
          {timeframes.hourly.trend === 'bullish' ? (
            <TrendingUp className="text-green-500" size={18} />
          ) : (
            <TrendingDown className="text-red-500" size={18} />
          )}
          <span>{timeframes.hourly.trend}</span>
        </div>
        <div className="text-sm text-gray-600">
          9 EMA: {timeframes.hourly.ema9}
        </div>
      </div>

      <div className="border-b pb-2">
        <h4 className="font-medium text-gray-700">Daily</h4>
        <div className="text-sm space-y-1">
          {timeframes.daily.gaps.map((gap, i) => (
            <div key={i}>
              Gap at {gap.price} ({gap.filled ? 'Filled' : 'Unfilled'})
            </div>
          ))}
          <div className="mt-2">
            Patterns: {timeframes.daily.patterns.join(', ')}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700">Weekly</h4>
        <div className="text-sm space-y-1">
          <div>Support: {timeframes.weekly.supportZones.join(', ')}</div>
          <div>Resistance: {timeframes.weekly.resistanceZones.join(', ')}</div>
        </div>
      </div>
    </div>
  </div>
);

const EntryPoints: React.FC<{
  entryPoints: StrategyAnalysis['entryPoints'];
  stopLoss: StrategyAnalysis['stopLoss'];
}> = ({ entryPoints, stopLoss }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Trading Setup</h3>
    
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <Target size={18} className="text-green-500" />
          Entry Points
        </h4>
        {entryPoints.map((entry, i) => (
          <div key={i} className="mt-2 text-sm">
            <div className="font-medium">${entry.price}</div>
            <div className="text-gray-600">{entry.condition}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <Shield size={18} className="text-red-500" />
          Stop Loss
        </h4>
        <div className="mt-2 text-sm">
          <div className="font-medium">${stopLoss.price}</div>
          <div className="text-gray-600">{stopLoss.reason}</div>
        </div>
      </div>
    </div>
  </div>
);

export default StrategyAnalysis;