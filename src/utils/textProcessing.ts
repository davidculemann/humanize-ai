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

export type UseCase = 'academic' | 'professional' | 'casual' | 'social' | 'creative' | 'technical' | 'custom';

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
        [/\bimplement\b/gi, 'do'],
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
    technical: {
      name: 'Technical Documentation',
      replacements: [
        [/\bFurthermore,?\s*/gi, 'Additionally, '],
        [/\bMoreover,?\s*/gi, 'Also, '],
        [/\bIn conclusion,?\s*/gi, 'To summarize, '],
        [/\bIt is important to note that\s*/gi, 'Note: '],
        [/\bIt should be noted that\s*/gi, 'Important: '],
        [/\bin order to\b/gi, 'to'],
        [/\butilize\b/gi, 'use'],
        [/\bfacilitate\b/gi, 'enable'],
        [/\bleverage\b/gi, 'use'],
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
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let humanized = text;
  const prompts = getHumanizationPrompts(useCase, customPrompt);
  
  console.log('Humanizing text with use case:', useCase);
  
  // Apply use-case specific replacements
  prompts.replacements.forEach(([pattern, replacement]) => {
    if (typeof pattern === 'string') {
      humanized = humanized.replace(new RegExp(pattern, 'gi'), replacement as string);
    } else {
      humanized = humanized.replace(pattern, replacement as string);
    }
  });
  
  // Common AI-ish patterns to replace
  humanized = humanized
    .replace(/\. However,/g, '. But')
    .replace(/\. Therefore,/g, '. So')
    .replace(/\. Additionally,/g, '. And')
    .replace(/\. Consequently,/g, '. As a result')
    .replace(/\bSignificantly,?\s*/gi, '')
    .replace(/\bNotably,?\s*/gi, '')
    .replace(/\bInterestingly,?\s*/gi, '')
    .replace(/\bImportantly,?\s*/gi, '')
    .replace(/\bEssentially,?\s*/gi, '')
    .replace(/\bUltimately,?\s*/gi, '')
    .replace(/\bFundamentally,?\s*/gi, '')
    .replace(/\bBasically,?\s*/gi, '')
    .replace(/\. It's worth noting that/gi, '. Note that')
    .replace(/\. It's important to understand that/gi, '. Remember that')
    .replace(/\. It's crucial to recognize that/gi, '. Keep in mind that')
    .replace(/\bcomprehensive\b/gi, 'complete')
    .replace(/\boptimal\b/gi, 'best')
    .replace(/\brobust\b/gi, 'strong')
    .replace(/\bseamless\b/gi, 'smooth')
    .replace(/\benhance\b/gi, 'improve')
    .replace(/\bleverage\b/gi, 'use')
    .replace(/\bsynergistic\b/gi, 'cooperative')
    .replace(/\binnovative\b/gi, 'new')
    .replace(/\bparadigm\b/gi, 'approach')
    .replace(/\. This ensures that/gi, '. This means')
    .replace(/\. This approach allows for/gi, '. This lets you')
    .replace(/\. By implementing this/gi, '. Doing this')
    // Remove redundant phrases
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log('Original length:', text.length, 'Humanized length:', humanized.length);
  return humanized;
};

export const rewriteWithAI = async (text: string, useCase: UseCase = 'professional', customPrompt?: string): Promise<string> => {
  // Simulate AI rewriting
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('AI rewriting text with use case:', useCase);
  
  let rewritten = text;
  
  // Apply humanization first
  rewritten = await humanizeText(rewritten, useCase, customPrompt);
  
  // Additional rewriting based on use case
  if (useCase === 'social') {
    // Make it more conversational
    rewritten = rewritten
      .replace(/^(.*?)(\.|\!|\?)/, (match, sentence, punct) => {
        if (!sentence.toLowerCase().startsWith('hey') && !sentence.toLowerCase().startsWith('so')) {
          return 'Hey! ' + sentence + punct;
        }
        return match;
      })
      .replace(/\bI think that\b/gi, 'I think')
      .replace(/\bI believe that\b/gi, 'I believe');
  } else if (useCase === 'casual') {
    // Make it more relaxed
    rewritten = rewritten
      .replace(/\bI think that\b/gi, 'I think')
      .replace(/\bI believe that\b/gi, 'I feel like')
      .replace(/\bIt appears that\b/gi, 'It looks like')
      .replace(/\bIt seems that\b/gi, 'It seems like');
  } else if (useCase === 'academic') {
    // Make it less robotic while keeping formality
    rewritten = rewritten
      .replace(/\bThis study shows\b/gi, 'The research indicates')
      .replace(/\bThe results demonstrate\b/gi, 'Findings show')
      .replace(/\bIt can be concluded\b/gi, 'We can conclude');
  }
  
  // Add some sentence variety
  const sentences = rewritten.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    // Occasionally start sentences differently
    const rewrittenSentences = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (index > 0 && Math.random() < 0.3 && trimmed.length > 0) {
        // Sometimes vary sentence starters
        if (trimmed.startsWith('The ')) {
          return trimmed.replace(/^The /, 'This ');
        } else if (trimmed.startsWith('This ')) {
          return trimmed.replace(/^This /, 'The ');
        }
      }
      return trimmed;
    });
    rewritten = rewrittenSentences.join('. ') + '.';
  }
  
  console.log('AI rewrite completed');
  return rewritten;
};

// Apply transformations while preserving previous ones
export const applyTransformations = (
  originalText: string,
  transformations: {
    removeEmDashes?: boolean;
    addTypos?: boolean;
    humanize?: { useCase: UseCase; customPrompt?: string };
    aiRewrite?: { useCase: UseCase; customPrompt?: string };
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
