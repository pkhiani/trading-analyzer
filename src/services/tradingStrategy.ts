import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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

const SYSTEM_PROMPT = `You are a professional day trader analyzing charts. Analyze the provided chart and return a JSON object with the following structure:

{
  "timeframes": {
    "hourly": {
      "trend": "bullish" or "bearish",
      "ema9": number (current 9 EMA value)
    },
    "daily": {
      "gaps": [
        {
          "price": number,
          "filled": boolean
        }
      ],
      "patterns": string[] (detected patterns like "bullish engulfing", "harami")
    },
    "weekly": {
      "supportZones": number[],
      "resistanceZones": number[]
    }
  },
  "entryPoints": [
    {
      "price": number,
      "condition": string (entry condition description)
    }
  ],
  "stopLoss": {
    "price": number,
    "reason": string (stop loss reasoning)
  }
}

Return ONLY the JSON object with no additional text or explanation.

Use this strategy:

1. 1 Hour - Look for trend (SPY)
2. 1 Week - Support and Resistance zones (candles close in proximity)
3. 1 Day - Look for gaps not filled
Candle patterns - engulfing or harami
4. 1 Hour - Verify S&R Levels
5. 5 Min - High/low of prev day and pre market
6. 2 Min - Break above 9 EMA and Resistance level - ENTER TRADE
7. Stop Loss at 9EMA or Consolidation Low

`;

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
              text: 'Analyze this chart according to the specified day trading strategy. Return the analysis as a JSON object.',
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
      max_tokens: 1000,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content || '';
    console.log(content)
    return parseStrategyResponse(content);
  } catch (error) {
    console.error('Error analyzing chart with strategy:', error);
    throw error;
  }
}

function parseStrategyResponse(content: string): StrategyAnalysis {
  try {
    // Extract JSON from the response, handling potential markdown formatting
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Apply strict validation and transformation
    return {
      timeframes: {
        hourly: {
          trend: String(parsed.timeframes?.hourly?.trend || 'neutral').toLowerCase(),
          ema9: Number(parsed.timeframes?.hourly?.ema9 || 0)
        },
        daily: {
          gaps: Array.isArray(parsed.timeframes?.daily?.gaps) 
            ? parsed.timeframes.daily.gaps.map(gap => ({
                price: Number(gap.price || 0),
                filled: Boolean(gap.filled)
              }))
            : [],
          patterns: Array.isArray(parsed.timeframes?.daily?.patterns)
            ? parsed.timeframes.daily.patterns.map(String)
            : []
        },
        weekly: {
          supportZones: Array.isArray(parsed.timeframes?.weekly?.supportZones)
            ? parsed.timeframes.weekly.supportZones.map(Number)
            : [],
          resistanceZones: Array.isArray(parsed.timeframes?.weekly?.resistanceZones)
            ? parsed.timeframes.weekly.resistanceZones.map(Number)
            : []
        }
      },
      entryPoints: Array.isArray(parsed.entryPoints)
        ? parsed.entryPoints.map(point => ({
            price: Number(point.price || 0),
            condition: String(point.condition || '')
          }))
        : [],
      stopLoss: {
        price: Number(parsed.stopLoss?.price || 0),
        reason: String(parsed.stopLoss?.reason || 'No stop loss specified')
      }
    };
  } catch (error) {
    console.error('Error parsing strategy response:', error);
    return getDefaultAnalysis();
  }
}

function getDefaultAnalysis(): StrategyAnalysis {
  return {
    timeframes: {
      hourly: {
        trend: 'neutral',
        ema9: 0
      },
      daily: {
        gaps: [],
        patterns: []
      },
      weekly: {
        supportZones: [],
        resistanceZones: []
      }
    },
    entryPoints: [],
    stopLoss: {
      price: 0,
      reason: 'Unable to determine stop loss'
    }
  };
}