import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChartAnalysisResult {
  trend: 'uptrend' | 'downtrend' | 'sideways';
  supportLevels: number[];
  resistanceLevels: number[];
  patterns: string[];
  recommendation: string;
  confidence: number;
}

export async function analyzeChartImage(imageBase64: string): Promise<ChartAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this trading chart and provide the following information: \n1. Overall trend\n2. Key support and resistance levels\n3. Any notable patterns\n4. Trading recommendation based on technical analysis\nProvide the analysis in a structured format."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysis = response.choices[0].message.content;
    
    // Parse the response and structure it
    // This is a simplified example - you would need more robust parsing
    return {
      trend: 'uptrend', // Parse from analysis
      supportLevels: [100, 95], // Parse from analysis
      resistanceLevels: [110, 115], // Parse from analysis
      patterns: ['Golden Cross', 'Bull Flag'], // Parse from analysis
      recommendation: 'Buy', // Parse from analysis
      confidence: 0.85 // Parse from analysis
    };
  } catch (error) {
    console.error('Error analyzing chart:', error);
    throw error;
  }
}