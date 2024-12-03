import React from 'react';
import { TrendingUp, TrendingDown, Target, Shield, AlertTriangle } from 'lucide-react';
import type { StrategyAnalysis } from '../services/tradingStrategy';

interface StrategyAnalysisProps {
  analysis: StrategyAnalysis | null;
}

const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;

  const hasData = analysis.timeframes.hourly.ema9 !== 0 || 
                 analysis.timeframes.daily.patterns.length > 0 ||
                 analysis.timeframes.weekly.supportZones.length > 0 ||
                 analysis.entryPoints.length > 0;

  if (!hasData) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle size={20} />
          <p>No significant trading patterns or signals detected in the current chart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeframeAnalysis timeframes={analysis.timeframes} />
        <TradingSetup entryPoints={analysis.entryPoints} stopLoss={analysis.stopLoss} />
      </div>
    </div>
  );
};

const TimeframeAnalysis: React.FC<{ timeframes: StrategyAnalysis['timeframes'] }> = ({ timeframes }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Market Analysis</h3>
    
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h4 className="font-medium text-gray-700">Hourly Trend</h4>
        <div className="flex items-center gap-2 mt-1">
          {timeframes.hourly.trend === 'bullish' ? (
            <TrendingUp className="text-green-500" size={18} />
          ) : timeframes.hourly.trend === 'bearish' ? (
            <TrendingDown className="text-red-500" size={18} />
          ) : null}
          <span className="capitalize">{timeframes.hourly.trend}</span>
          {timeframes.hourly.ema9 > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              (9 EMA: {timeframes.hourly.ema9.toFixed(2)})
            </span>
          )}
        </div>
      </div>

      {(timeframes.daily.gaps.length > 0 || timeframes.daily.patterns.length > 0) && (
        <div className="border-b pb-2">
          <h4 className="font-medium text-gray-700">Daily Patterns</h4>
          {timeframes.daily.gaps.length > 0 && (
            <div className="mt-1 space-y-1">
              {timeframes.daily.gaps.map((gap, i) => (
                <div key={i} className="text-sm">
                  Gap at ${gap.price.toFixed(2)} 
                  <span className={gap.filled ? 'text-gray-500' : 'text-blue-600'}>
                    ({gap.filled ? 'Filled' : 'Unfilled'})
                  </span>
                </div>
              ))}
            </div>
          )}
          {timeframes.daily.patterns.length > 0 && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Patterns:</span>{' '}
              {timeframes.daily.patterns.join(', ')}
            </div>
          )}
        </div>
      )}

      {(timeframes.weekly.supportZones.length > 0 || timeframes.weekly.resistanceZones.length > 0) && (
        <div>
          <h4 className="font-medium text-gray-700">Key Levels</h4>
          {timeframes.weekly.resistanceZones.length > 0 && (
            <div className="text-sm mt-1">
              <span className="text-red-600">Resistance:</span>{' '}
              ${timeframes.weekly.resistanceZones.map(n => n.toFixed(2)).join(', ')}
            </div>
          )}
          {timeframes.weekly.supportZones.length > 0 && (
            <div className="text-sm mt-1">
              <span className="text-green-600">Support:</span>{' '}
              ${timeframes.weekly.supportZones.map(n => n.toFixed(2)).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const TradingSetup: React.FC<{
  entryPoints: StrategyAnalysis['entryPoints'];
  stopLoss: StrategyAnalysis['stopLoss'];
}> = ({ entryPoints, stopLoss }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Trading Setup</h3>
    
    <div className="space-y-4">
      {entryPoints.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Target size={18} className="text-green-500" />
            Entry Points
          </h4>
          <div className="mt-2 space-y-2">
            {entryPoints.map((entry, i) => (
              <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                <div className="font-medium">${entry.price.toFixed(2)}</div>
                <div className="text-gray-600">{entry.condition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stopLoss.price > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Shield size={18} className="text-red-500" />
            Stop Loss
          </h4>
          <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
            <div className="font-medium">${stopLoss.price.toFixed(2)}</div>
            <div className="text-gray-600">{stopLoss.reason}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default StrategyAnalysis;