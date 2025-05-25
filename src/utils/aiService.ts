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

  async processText(
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

    const systemPrompt = this.buildProcessPrompt(useCase, customPrompt);
    
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
                content: `Transform the following text to sound genuinely human, natural, and engaging according to the specified style:\n\n${text}`,
              },
            ],
            temperature: 0.75, // Slightly increased for more creative humanization
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

  private buildProcessPrompt(useCase: string, customPrompt?: string): string {
    const basePrompt = `Your task is to transform the provided text to sound genuinely human, natural, and engaging.
This involves more than just superficial changes. You should significantly rewrite and restructure the text as needed to achieve a high-quality, human-like output.
Focus on:
1.  Natural Language: Eliminate robotic patterns, awkward phrasing, and overly formal/informal language inappropriate for the context.
2.  Varied Sentence Structures: Create a mix of sentence lengths and complexities.
3.  Flow and Cohesion: Ensure smooth transitions and logical connections between ideas.
4.  Authentic Voice: The text should feel like it was written by a person, not an AI.
5.  Clarity and Conciseness: Improve readability while preserving the original meaning.
6.  Adherence to Style: Strictly follow the specified use case or custom instructions for tone and style.

REMOVE ALL PREAMBLE. REMOVE ALL INTRODUCTORY PHRASES. REMOVE ALL CLOSING REMARKS.
Your response MUST be ONLY the processed text and nothing else.
Do NOT include any markdown formatting (e.g., do not use \`\`\` or backticks).

OUTPUT ONLY THE PROCESSED TEXT.`;

    const useCaseGuidance = {
      academic: 'Adapt the text for an academic audience. Maintain a formal, objective tone suitable for research papers and scholarly articles. Ensure precise language and logical argumentation.',
      professional: 'Adapt the text for a professional context. Use a clear, concise, and polished tone suitable for business documents, reports, CVs, and corporate communications.',
      casual: 'Adapt the text for a casual, conversational style. Make it engaging and relatable, suitable for blog posts, articles, or informal communication.',
      social: 'Adapt the text for social media. Make it engaging, concise, and personal, suitable for platforms like Twitter, Facebook, or LinkedIn. Use a natural, approachable voice.',
      creative: 'Adapt the text with creative flair. Enhance its imaginative and expressive qualities, suitable for storytelling, marketing copy, or other creative content.',
      custom: customPrompt || "Follow the user's custom instructions precisely to define the tone, style, and specific transformations required."
    };

    return basePrompt + '\n\nStyle Guidance:\n' + (useCaseGuidance[useCase as keyof typeof useCaseGuidance] || useCaseGuidance.professional);
  }
}

export const aiService = AIService.getInstance();
