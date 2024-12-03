import { format } from 'date-fns';

export interface StrategyAnalysis {
  timeframes: {
    hourly: {
      trend: string;
      ema9: number;
    };
    daily: {
      gaps: {
        price: number;
        filled: boolean;
      }[];
      patterns: string[];
    };
    weekly: {
      supportZones: number[];
      resistanceZones: number[];
    };
  };
  entryPoints: {
    price: number;
    condition: string;
  }[];
  stopLoss: {
    price: number;
    reason: string;
  };
}

const SYSTEM_PROMPT = `You are a professional day trader analyzing charts with the following strategy:
1. 1 Hour timeframe - Identify the main trend for SPY
2. 1 Week timeframe - Identify support and resistance zones where candles close in proximity
3. 1 Day timeframe - Look for unfilled gaps and candle patterns (engulfing or harami)
4. 1 Hour timeframe - Verify support and resistance levels
5. 5 Min timeframe - Identify high/low of previous day and pre-market
6. 2 Min timeframe - Look for breaks above 9 EMA and resistance level for entry points
7. Set stop loss at 9 EMA or consolidation low

Analyze the chart and provide structured insights based on this strategy.`;

export async function analyzeChartWithStrategy(imageBase64: string): Promise<StrategyAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this chart according to the specified day trading strategy.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    // Parse and structure the response
    const analysis = parseStrategyResponse(response.choices[0].message.content || '');
    return analysis;
  } catch (error) {
    console.error('Error analyzing chart with strategy:', error);
    throw error;
  }
}

function parseStrategyResponse(content: string): StrategyAnalysis {
  // In a real implementation, you would parse the content string
  // and extract the relevant information. This is a placeholder.
  return {
    timeframes: {
      hourly: {
        trend: 'bullish',
        ema9: 450.75,
      },
      daily: {
        gaps: [
          { price: 448.32, filled: false },
        ],
        patterns: ['bullish engulfing'],
      },
      weekly: {
        supportZones: [445.50, 442.25],
        resistanceZones: [452.75, 455.00],
      },
    },
    entryPoints: [
      {
        price: 451.25,
        condition: 'Break above 9 EMA with volume confirmation',
      },
    ],
    stopLoss: {
      price: 449.75,
      reason: '9 EMA support level',
    },
  };
}