// ============================================
// GROQ API CLIENT
// Reusable utility for all AI calls
// ============================================

interface GroqOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number; // milliseconds
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_OPTIONS: GroqOptions = {
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
  maxTokens: 8000,
  timeout: 30000, // 30 seconds
};

/**
 * Call Groq API and return raw text response
 */
export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {}
): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout!);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mergedOptions.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Groq API request timeout');
    }
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

/**
 * Call Groq API and parse JSON response
 */
export async function callGroqWithJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {}
): Promise<T> {
  const content = await callGroq(systemPrompt, userPrompt, options);
  return parseGroqJSON<T>(content);
}

/**
 * Parse JSON from Groq response (handles markdown code blocks)
 */
export function parseGroqJSON<T>(content: string): T {
  try {
    let jsonText = content.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    // Remove any leading/trailing whitespace
    jsonText = jsonText.trim();

    // Parse JSON
    const parsedData = JSON.parse(jsonText);
    return parsedData as T;
  } catch (error) {
    console.error('Error parsing Groq JSON response:', error);
    console.error('Response content (first 500 chars):', content.substring(0, 500));
    throw new Error(`Failed to parse JSON from Groq: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
  }
}

/**
 * Retry logic for Groq calls (useful for rate limits)
 */
export async function callGroqWithRetry<T>(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {},
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGroqWithJSON<T>(systemPrompt, userPrompt, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Groq API attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff, max 10s
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Groq API failed after retries');
}

/**
 * Validate Groq API key
 */
export function validateGroqKey(): boolean {
  return !!process.env.GROQ_API_KEY;
}