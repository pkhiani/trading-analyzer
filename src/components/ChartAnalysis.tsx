import React, { useState } from 'react';
import { Brain, Loader2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { analyzeChartImage, ChartAnalysisResult } from '../services/openai';

interface ChartAnalysisProps {
  imageData: string | null;
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ imageData }) => {
  const [analysis, setAnalysis] = useState<ChartAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!imageData) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeChartImage(imageData);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze chart. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!imageData) return null;

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="text-purple-600" />
          Chart Analysis
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ArrowRight size={20} />
          )}
          {loading ? 'Analyzing...' : 'Analyze Chart'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img src={imageData} alt="Chart Screenshot" className="w-full h-full object-contain" />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {analysis.trend === 'uptrend' ? (
                    <TrendingUp className="text-green-500" />
                  ) : (
                    <TrendingDown className="text-red-500" />
                  )}
                  <h4 className="font-semibold">Trend Analysis</h4>
                </div>
                <p className="text-gray-700">
                  Overall Trend: <span className="font-medium">{analysis.trend}</span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Key Levels</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Support: {analysis.supportLevels.join(', ')}
                  </p>
                  <p className="text-gray-700">
                    Resistance: {analysis.resistanceLevels.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Patterns Detected</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.patterns.map((pattern, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Recommendation</h4>
              <p className="text-gray-700">
                {analysis.recommendation}
                <span className="text-sm text-gray-500 ml-2">
                  (Confidence: {(analysis.confidence * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartAnalysis;