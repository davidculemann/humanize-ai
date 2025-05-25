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
