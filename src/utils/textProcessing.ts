
// Text processing utilities for humanizing AI-generated content

export const removeEmDashes = (text: string): string => {
  // Remove em dashes and replace with regular dashes
  return text
    .replace(/—/g, '-') // Replace em dashes with regular dashes
    .replace(/–/g, '-') // Replace en dashes with regular dashes
    .replace(/\s*-\s*/g, ' - ') // Normalize spacing around dashes
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
};

export const addTypos = (text: string): string => {
  const words = text.split(' ');
  const typoWords = words.map(word => {
    // Add subtle typos to about 2% of words
    if (Math.random() < 0.02 && word.length > 4) {
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

export type UseCase = 'academic' | 'professional' | 'casual' | 'social';

export const getHumanizationPrompts = (useCase: UseCase) => {
  const prompts = {
    academic: {
      name: 'Academic Paper',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Additionally, '],
        [/\bMoreover,?\s*/gi, 'Furthermore, '],
        [/\bIn conclusion,?\s*/gi, 'In summary, '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bdemonstrate\b/gi, 'show'],
      ]
    },
    professional: {
      name: 'Professional/CV',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also, '],
        [/\bMoreover,?\s*/gi, 'Additionally, '],
        [/\bIn conclusion,?\s*/gi, 'In summary, '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'enable'],
        [/\boptimize\b/gi, 'improve'],
      ]
    },
    casual: {
      name: 'Blog/Article',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also, '],
        [/\bMoreover,?\s*/gi, 'Plus, '],
        [/\bIn conclusion,?\s*/gi, 'So, '],
        [/\bIt is important to note that\s*/gi, ''],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'help'],
        [/\bdemonstrate\b/gi, 'show'],
        [/\bimplement\b/gi, 'do'],
      ]
    },
    social: {
      name: 'Social Media',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Also '],
        [/\bMoreover,?\s*/gi, 'Plus '],
        [/\bIn conclusion,?\s*/gi, 'So '],
        [/\bIt is important to note that\s*/gi, ''],
        [/\bIt should be noted that\s*/gi, ''],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'help'],
      ]
    }
  };
  
  return prompts[useCase];
};

export const humanizeText = async (text: string, useCase: UseCase = 'professional'): Promise<string> => {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let humanized = text;
  const prompts = getHumanizationPrompts(useCase);
  
  // Apply use-case specific replacements
  prompts.replacements.forEach(([pattern, replacement]) => {
    humanized = humanized.replace(pattern, replacement);
  });
  
  // Common improvements for all use cases
  humanized = humanized
    .replace(/\. However,/g, '. But')
    .replace(/\. Therefore,/g, '. So')
    .replace(/\. Additionally,/g, '. And');
  
  return humanized;
};

export const rewriteWithAI = async (text: string, useCase: UseCase = 'professional'): Promise<string> => {
  // Simulate AI rewriting
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let rewritten = text;
  
  // Apply humanization first
  rewritten = await humanizeText(rewritten, useCase);
  
  // Add some variation based on use case
  if (useCase === 'social') {
    rewritten = rewritten.replace(/^(.*?)\./m, 'Hey, $1.');
  } else if (useCase === 'casual') {
    rewritten = rewritten.replace(/\bI believe that\b/gi, 'I think');
  }
  
  return rewritten;
};

// Apply transformations while preserving previous ones
export const applyTransformations = (
  originalText: string,
  transformations: {
    removeEmDashes?: boolean;
    addTypos?: boolean;
    humanize?: { useCase: UseCase };
    aiRewrite?: { useCase: UseCase };
  }
): string => {
  let result = originalText;
  
  // Always apply in this order to preserve transformations
  if (transformations.removeEmDashes) {
    result = removeEmDashes(result);
  }
  
  if (transformations.addTypos) {
    result = addTypos(result);
  }
  
  return result;
};
