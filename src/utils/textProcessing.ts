
// Text processing utilities for humanizing AI-generated content

export const removeEmDashes = (text: string): string => {
  // Remove em dashes and replace with regular dashes or remove entirely
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
    // Add subtle typos to about 3% of words
    if (Math.random() < 0.03 && word.length > 4) {
      const typoType = Math.random();
      
      if (typoType < 0.3) {
        // Swap adjacent letters
        const pos = Math.floor(Math.random() * (word.length - 1));
        const chars = word.split('');
        [chars[pos], chars[pos + 1]] = [chars[pos + 1], chars[pos]];
        return chars.join('');
      } else if (typoType < 0.6) {
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

export const humanizeText = async (text: string): string => {
  // Simulate AI processing - in a real app, this would call an API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let humanized = text;
  
  // Remove overly formal language patterns
  humanized = humanized
    .replace(/\bFurthermore,?\s*/gi, 'Also, ')
    .replace(/\bMoreover,?\s*/gi, 'Plus, ')
    .replace(/\bIn conclusion,?\s*/gi, 'So, ')
    .replace(/\bIt is important to note that\s*/gi, '')
    .replace(/\bIt should be noted that\s*/gi, '')
    .replace(/\bin order to\b/gi, 'to')
    .replace(/\butilize\b/gi, 'use')
    .replace(/\bfacilitate\b/gi, 'help')
    .replace(/\bdemonstrate\b/gi, 'show')
    .replace(/\bimplement\b/gi, 'do')
    .replace(/\boptimize\b/gi, 'improve');
  
  // Add more casual connectors
  humanized = humanized
    .replace(/\. However,/g, '. But')
    .replace(/\. Therefore,/g, '. So')
    .replace(/\. Additionally,/g, '. And');
  
  // Simplify complex sentences occasionally
  const sentences = humanized.split('. ');
  const simplifiedSentences = sentences.map(sentence => {
    if (sentence.length > 100 && Math.random() < 0.3) {
      // Split long sentences sometimes
      const parts = sentence.split(', ');
      if (parts.length > 2) {
        const midPoint = Math.floor(parts.length / 2);
        return parts.slice(0, midPoint).join(', ') + '. ' + 
               parts.slice(midPoint).join(', ');
      }
    }
    return sentence;
  });
  
  return simplifiedSentences.join('. ').replace(/\.\s*\./g, '.');
};

export const rewriteWithAI = async (text: string): string => {
  // Simulate AI rewriting - in a real implementation, this would call OpenAI or similar
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, apply multiple humanization techniques
  let rewritten = text;
  
  // Make it more conversational
  rewritten = rewritten
    .replace(/^(.*?)\./m, 'You know, $1.')
    .replace(/\bI believe that\b/gi, 'I think')
    .replace(/\bIt is essential\b/gi, "It's really important")
    .replace(/\bThis approach\b/gi, 'This way')
    .replace(/\bsubsequently\b/gi, 'then')
    .replace(/\bconsequently\b/gi, 'so');
  
  // Add some casual interjections
  const interjections = ['honestly', 'basically', 'actually', 'really'];
  const sentences = rewritten.split('. ');
  const withInterjections = sentences.map(sentence => {
    if (Math.random() < 0.2) {
      const interjection = interjections[Math.floor(Math.random() * interjections.length)];
      return sentence.replace(/^(\w+)/, `$1, ${interjection},`);
    }
    return sentence;
  });
  
  return withInterjections.join('. ');
};
