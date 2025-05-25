"use client"

import ContentTypeSelector from '@/components/ContentTypeSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  processText,
  removeEmDashes,
  type UseCase
} from '@/utils/textProcessing';
import { Copy, Sparkles, Wand2, X } from 'lucide-react';
import { useRef, useState } from 'react';

const TextProcessor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [useCase, setUseCase] = useState<UseCase>('professional');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    const processedInput = removeEmDashes(inputText);

    try {
      let result = await processText(processedInput, useCase, customPrompt, signal);
      if (signal.aborted) return;
      result = removeEmDashes(result);
      
      setOutputText(result);
    } catch (error) {
      const typedError = error as Error | { name?: string; message?: string };
      if (typedError.name === 'AbortError') {
        toast({
          title: "Processing Cancelled",
          description: "The text transformation was cancelled.",
        });
        setOutputText("");
      } else {
        toast({
          title: "Error",
          description: typedError instanceof Error ? typedError.message : "Failed to process text. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleUseCaseChange = (newUseCase: UseCase, newCustomPrompt?: string) => {
    setUseCase(newUseCase);
    setCustomPrompt(newCustomPrompt || '');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-3 shrink-0 whitespace-nowrap">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              Text Humaniser
            </CardTitle>
            <div className="flex-shrink sm:flex-grow-0 sm:w-auto">
              <ContentTypeSelector
                useCase={useCase}
                customPrompt={customPrompt}
                onUseCaseChange={handleUseCaseChange}
                isMobile={isMobile}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-800">Original Text</h3>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  {inputText.length} characters
                </Badge>
              </div>

              <Textarea
                placeholder="Paste your AI-generated text here..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setOutputText("");
                }}
                className="min-h-[320px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500/30 text-slate-800 leading-relaxed text-base shadow-sm flex-grow"
              />

              <Button
                onClick={handleProcessText} 
                disabled={!inputText.trim() || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-colors duration-150 ease-in-out group"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2 text-blue-100/90 group-hover:text-white transition-colors duration-150" />
                Make it Human
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-800">Humanised Text</h3>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {outputText.length} characters
                  </Badge>
                  {outputText && (
                    <Button
                      onClick={() => handleCopy(outputText)}
                      size="icon"
                      variant="ghost"
                      className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 w-8 h-8"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="min-h-[320px] p-6 bg-gradient-to-br from-green-50/30 to-blue-50/20 rounded-xl border border-slate-200/80 overflow-y-auto shadow-inner inset-shadow-light scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 h-0">
                {outputText ? (
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-base">{outputText}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-75">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-base font-medium mb-2">Ready to humanise</p>
                    <p className="text-slate-400 text-sm">Your transformed text will appear here</p>
                  </div>
                )}
              </div>

              {outputText && (
                <Button
                  onClick={() => handleCopy(outputText)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25 transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Humanised Text
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-blue-50/30 to-purple-50/30 backdrop-blur-md flex items-center justify-center z-50">
          <Card className="p-6 sm:p-8 bg-white shadow-2xl border-0 rounded-xl w-full max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-8 w-8">
                <div className="animate-spin rounded-full h-full w-full border-2 border-blue-200"></div>
                <div className="animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-blue-500 absolute top-0 left-0"></div>
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-lg">Processing your text...</p>
                <p className="text-slate-500 text-sm">This may take a few moments.</p>
              </div>
            </div>
            <Button
              onClick={handleCancelProcessing}
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Processing
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
