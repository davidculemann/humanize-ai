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

export const addTypos = (text: string, typoLevel: number = 1): string => {
  if (typoLevel <= 0) return text;

  const words = text.split(' ');
  // Adjust typoRate based on typoLevel. Max 10% at level 5.
  const typoRate = Math.min(0.10, (typoLevel * 0.02)); 

  const typoWords = words.map(word => {
    if (Math.random() < typoRate && word.length > 4) {
      const typoType = Math.random();
      
      if (typoType < 0.4) {
        // Swap adjacent letters
        const pos = Math.floor(Math.random() * (word.length - 1));
        const chars = word.split('');
        [chars[pos], chars[pos + 1]] = [chars[pos + 1], chars[pos]];
        return chars.join('');
      } else if (typoType < 0.7) {
        // Remove a letter
        const pos = Math.floor(Math.random() * word.length);
        return word.slice(0, pos) + word.slice(pos + 1);
      } else {
        // Double a letter
        const pos = Math.floor(Math.random() * word.length);
        return word.slice(0, pos + 1) + word[pos] + word.slice(pos + 1);
      }
    }
    return word;
  });
  
  return typoWords.join(' ');
};

export type UseCase = 'academic' | 'professional' | 'casual' | 'social' | 'creative' | 'custom';

export const getHumanizationPrompts = (useCase: UseCase, customPrompt?: string) => {
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

export const humanizeText = async (text: string, useCase: UseCase = 'professional', customPrompt?: string): Promise<string> => {
  console.log('Starting AI humanization with use case:', useCase);
  
  try {
    const result = await aiService.humanizeText(text, useCase, customPrompt);
    console.log('AI humanization completed successfully');
    return result;
  } catch (error) {
    console.error('AI humanization failed:', error);
    throw error;
  }
};

export const rewriteWithAI = async (text: string, useCase: UseCase = 'professional', customPrompt?: string): Promise<string> => {
  console.log('Starting AI rewrite with use case:', useCase);
  
  try {
    const result = await aiService.rewriteText(text, useCase, customPrompt);
    console.log('AI rewrite completed successfully');
    return result;
  } catch (error) {
    console.error('AI rewrite failed:', error);
    throw error;
  }
};

// Apply transformations while preserving previous ones
export const applyTransformations = (
  originalText: string,
  transformations: {
    removeEmDashes?: boolean;
    addTypos?: { level: number };
    humanize?: { useCase: UseCase; customPrompt?: string };
    aiRewrite?: { useCase: UseCase; customPrompt?: string };
  }
): string => {
  let result = originalText;
  
  if (transformations.removeEmDashes) {
    result = removeEmDashes(result);
  }
  
  if (transformations.addTypos && transformations.addTypos.level > 0) {
    result = addTypos(result, transformations.addTypos.level);
  }
  
  return result;
};
