// Text processing utilities for humanizing AI-generated content

import { aiService } from './aiService';

export const removeEmDashes = (text: string): string => {
  // Remove em dashes and replace with regular dashes
  return text
    .replace(/—/g, '-') // Replace em dashes with regular dashes
    .replace(/–/g, '-') // Replace en dashes with regular dashes
    .replace(/\s*-\s*/g, ' - ') // Normalize spacing around dashes
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
};

export type UseCase = 'academic' | 'professional' | 'casual' | 'social' | 'creative' | 'custom';

export const getHumanizationPrompts = (useCase: UseCase, customPrompt?: string) => {
  // This function is not directly used for AI prompting anymore but kept for potential future use or non-AI based text processing rules.
  const prompts = {
    academic: {
      name: 'Academic Paper',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Additionally, '],
        [/\bMoreover,?\s*/gi, 'Also, '],
        [/\bIn conclusion,?\s*/gi, 'To conclude, '],
        [/\bIt is important to note that\s*/gi, 'Note that '],
        [/\bIt should be noted that\s*/gi, 'Notably, '],
        [/\bIt is worth mentioning that\s*/gi, 'Worth noting, '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bdemonstrate\b/gi, 'show'],
        [/\bcommence\b/gi, 'begin'],
        [/\bterminate\b/gi, 'end'],
      ]
    },
    professional: {
      name: 'Professional/CV',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also, '],
        [/\bMoreover,?\s*/gi, 'Additionally, '],
        [/\bIn conclusion,?\s*/gi, 'In summary, '],
        [/\bIt is important to note that\s*/gi, ''],
        [/\bIt should be emphasized that\s*/gi, ''],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'enable'],
        [/\boptimize\b/gi, 'improve'],
        [/\bleverage\b/gi, 'use'],
        [/\bsynergize\b/gi, 'work together'],
      ]
    },
    casual: {
      name: 'Blog/Article',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also, '],
        [/\bMoreover,?\s*/gi, 'Plus, '],
        [/\bIn conclusion,?\s*/gi, 'So, '],
        [/\bIt is important to note that\s*/gi, 'Worth noting - '],
        [/\bIt should be noted that\s*/gi, 'Just so you know, '],
        [/\bIt is worth mentioning that\s*/gi, 'By the way, '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'help'],
        [/\bdemonstrate\b/gi, 'show'],
        [/\bsubsequently\b/gi, 'then'],
        [/\bnevertheless\b/gi, 'but'],
      ]
    },
    social: {
      name: 'Social Media',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also '],
        [/\bMoreover,?\s*/gi, 'Plus '],
        [/\bIn conclusion,?\s*/gi, 'So '],
        [/\bIt is important to note that\s*/gi, 'BTW '],
        [/\bIt should be noted that\s*/gi, 'Just saying '],
        [/\bIt is worth mentioning that\s*/gi, 'Oh and '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'help'],
        [/\bdemonstrate\b/gi, 'show'],
        [/\bsubsequently\b/gi, 'then'],
        [/\bnevertheless\b/gi, 'but'],
        [/\bhowever\b/gi, 'but'],
      ]
    },
    creative: {
      name: 'Creative Writing',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Then '],
        [/\bMoreover,?\s*/gi, 'What\'s more, '],
        [/\bIn conclusion,?\s*/gi, 'Finally, '],
        [/\bIt is important to note that\s*/gi, 'Interestingly, '],
        [/\bIt should be noted that\s*/gi, 'Curiously, '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bdemonstrate\b/gi, 'show'],
        [/\bsubsequently\b/gi, 'then'],
        [/\bnevertheless\b/gi, 'yet'],
      ]
    },
    custom: {
      name: customPrompt || 'Custom',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also, '],
        [/\bMoreover,?\s*/gi, 'Additionally, '],
        [/\bIn conclusion,?\s*/gi, 'In summary, '],
        [/\bIt is important to note that\s*/gi, ''],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
      ]
    }
  };
  
  return prompts[useCase];
};

export const processText = async (
  text: string,
  useCase: UseCase = 'professional',
  customPrompt?: string,
  signal?: AbortSignal
): Promise<string> => {
  console.log('Starting AI text processing with use case:', useCase, customPrompt ? `Custom: ${customPrompt}` : '');
  
  try {
    const result = await aiService.processText(text, useCase, customPrompt, signal);
    console.log('AI text processing completed successfully');
    return result;
  } catch (error) {
    console.error('AI text processing failed:', error);
    throw error;
  }
};
