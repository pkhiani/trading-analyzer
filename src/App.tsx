import React, { useState } from 'react';
import TradingViewWidget from './components/TradingViewWidget';
import SymbolInput from './components/SymbolInput';
import ChartControls from './components/ChartControls';
import ChartPreview from './components/ChartPreview';
import StrategyAnalysis from './components/StrategyAnalysis';
import { analyzeChartWithStrategy } from './services/tradingStrategy';
import type { StrategyAnalysis as StrategyAnalysisType } from './services/tradingStrategy';

function App() {
  const [symbol, setSymbol] = useState('SPY');
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<StrategyAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSymbolSubmit = () => {
    setChartImage(null);
    setAnalysis(null);
    setError(null);
  };

  const handleScreenshot = (imageData: string) => {
    setChartImage(imageData);
    setAnalysis(null);
    setError(null);
  };

  const handleClosePreview = () => {
    setChartImage(null);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!chartImage) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeChartWithStrategy(chartImage);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze chart. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Trading Analysis</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <SymbolInput 
              symbol={symbol} 
              onSymbolChange={setSymbol}
              onSubmit={handleSymbolSubmit}
            />
            <ChartControls onScreenshot={handleScreenshot} />
            <div className="h-[600px]">
              <TradingViewWidget symbol={symbol} />
            </div>
          </div>

          <ChartPreview 
            imageData={chartImage} 
            onClose={handleClosePreview}
          />
          
          {chartImage && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Strategy Analysis</h2>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Chart'}
                </button>
              </div>
              {error && (
                <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              <StrategyAnalysis analysis={analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;