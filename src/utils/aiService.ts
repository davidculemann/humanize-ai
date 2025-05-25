interface AIResponse {
  text: string;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  private constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || null;
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(key: string) {
    console.warn("setApiKey is deprecated. API key should be set via VITE_DEEPSEEK_API_KEY environment variable.");
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
       this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || null;
       if (!this.apiKey) {
        console.error("VITE_DEEPSEEK_API_KEY not found in environment variables. Make sure it is set in your .env file and prefixed with VITE_ (e.g., VITE_DEEPSEEK_API_KEY).");
       }
    }
    return this.apiKey;
  }

  async humanizeText(
    text: string,
    useCase: string,
    customPrompt?: string,
    signal?: AbortSignal
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        "API key not set. Please configure the VITE_DEEPSEEK_API_KEY environment variable."
      );
    }

    const systemPrompt = this.buildSystemPrompt(useCase, customPrompt);
    
    try {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Humanize the following text:\n\n${text}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
          signal,
        }
      );

      if (signal?.aborted) {
        throw new DOMException('Aborted by user', 'AbortError');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async rewriteText(
    text: string,
    useCase: string,
    customPrompt?: string,
    signal?: AbortSignal
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        "API key not set. Please configure the VITE_DEEPSEEK_API_KEY environment variable."
      );
    }

    const systemPrompt = this.buildRewritePrompt(useCase, customPrompt);
    
    try {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Rewrite the following text:\n\n${text}`,
              },
            ],
            temperature: 0.8,
            max_tokens: 4000,
          }),
          signal,
        }
      );

      if (signal?.aborted) {
        throw new DOMException('Aborted by user', 'AbortError');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  private buildSystemPrompt(useCase: string, customPrompt?: string): string {
    const basePrompt = `Your task is to humanize the provided text.
REMOVE ALL PREAMBLE. REMOVE ALL INTRODUCTORY PHRASES. REMOVE ALL CLOSING REMARKS.
Your response MUST be ONLY the humanized text and nothing else.
Do NOT include any markdown formatting (e.g., do not use \`\`\` or backticks).
Focus on:
1. Natural language, removing robotic patterns.
2. Varied sentence structures.
3. Conversational transitions.
4. Eliminating artificial phrasing.
5. Maintaining original meaning.

OUTPUT ONLY THE PROCESSED TEXT.`;

    const useCasePrompts = {
      academic: 'Write in an academic style suitable for research papers and scholarly work, but make it sound like it was written by a human researcher rather than AI.',
      professional: 'Write in a professional tone suitable for business documents, CVs, and corporate communications.',
      casual: 'Write in a casual, conversational tone suitable for blog posts and articles.',
      social: 'Write in a casual, engaging tone suitable for social media posts with natural personality.',
      creative: 'Write with creative flair suitable for storytelling and creative content.',
      custom: customPrompt || "Follow the user's custom instructions for tone and style."
    };

    return basePrompt + (useCasePrompts[useCase as keyof typeof useCasePrompts] || useCasePrompts.professional);
  }

  private buildRewritePrompt(useCase: string, customPrompt?: string): string {
    const basePrompt = `Your task is to rewrite the provided text according to the specified use case.
REMOVE ALL PREAMBLE. REMOVE ALL INTRODUCTORY PHRASES. REMOVE ALL CLOSING REMARKS.
Your response MUST be ONLY the rewritten text and nothing else.
Do NOT include any markdown formatting (e.g., do not use \`\`\` or backticks).
Focus on:
1. Preserving core meaning.
2. Significantly changing structure and flow.
3. Using different vocabulary.
4. Sounding natural and human-written.
5. Adapting tone for the use case.

OUTPUT ONLY THE REWRITTEN TEXT.`;

    const useCasePrompts = {
      academic: 'Rewrite in an academic style with proper scholarly language and structure.',
      professional: 'Rewrite in a professional business tone.',
      casual: 'Rewrite in a casual, conversational style.',
      social: 'Rewrite for social media with engaging, personal language.',
      creative: 'Rewrite with creative and expressive language.',
      custom: customPrompt || "Follow the user's custom instructions for rewriting."
    };

    return basePrompt + (useCasePrompts[useCase as keyof typeof useCasePrompts] || useCasePrompts.professional);
  }
}

export const aiService = AIService.getInstance();
