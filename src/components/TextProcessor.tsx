"use client"

import ContentTypeSelector from '@/components/ContentTypeSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  applyTransformations,
  humanizeText,
  rewriteWithAI,
  type UseCase
} from '@/utils/textProcessing';
import { Copy, Minus, Plus, Shuffle, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

const TextProcessor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [useCase, setUseCase] = useState<UseCase>('professional');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedTransformations, setAppliedTransformations] = useState({
    removeEmDashes: false,
    addTypos: { level: 0 },
  });
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

  const handleTransformation = (type: 'removeEmDashes' | 'addTypos', value?: number | boolean) => {
    const textToTransform = outputText.trim() ? outputText : inputText;
    if (!textToTransform.trim()) return;

    const newAppliedTransformations = { ...appliedTransformations };

    if (type === 'removeEmDashes') {
      newAppliedTransformations.removeEmDashes = !newAppliedTransformations.removeEmDashes;
    } else if (type === 'addTypos') {
      if (typeof value === 'number') {
        newAppliedTransformations.addTypos = { level: value };
      } else {
        newAppliedTransformations.addTypos = { level: 0 };
      }
    }
    
    setAppliedTransformations(newAppliedTransformations);
    
    const result = applyTransformations(textToTransform, newAppliedTransformations);
    setOutputText(result);
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      let result = await humanizeText(inputText, useCase, customPrompt);
      result = applyTransformations(result, appliedTransformations);
      
      setOutputText(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to humanize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIRewrite = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      let result = await rewriteWithAI(inputText, useCase, customPrompt);
      result = applyTransformations(result, appliedTransformations);
      
      setOutputText(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "AI rewrite failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTransformations = () => {
    setAppliedTransformations({
      removeEmDashes: false,
      addTypos: { level: 0 },
    });
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
            <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              Text Humanizer
            </CardTitle>
            <ContentTypeSelector
              useCase={useCase}
              customPrompt={customPrompt}
              onUseCaseChange={handleUseCaseChange}
              isMobile={isMobile}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
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
                  setAppliedTransformations({ removeEmDashes: false, addTypos: { level: 0 } });
                }}
                className="min-h-[320px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500/30 text-slate-800 leading-relaxed text-base shadow-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAIRewrite}
                  disabled={!inputText.trim() || isProcessing}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Rewrite
                </Button>

                <Button
                  onClick={handleHumanize}
                  disabled={!inputText.trim() || isProcessing}
                  variant="outline"
                  className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-blue-600 shadow-sm transition-all duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Humanize
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-800">Humanized Text</h3>
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

              <div className="min-h-[320px] p-6 bg-gradient-to-br from-green-50/30 to-blue-50/20 rounded-xl border border-slate-200/80 overflow-y-auto shadow-inner inset-shadow-light">
                {outputText ? (
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-base">{outputText}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-75">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-base font-medium mb-2">Ready to humanize</p>
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
                  Copy Humanized Text
                </Button>
              )}
            </div>
          </div>

          {(inputText.trim() || outputText.trim()) && (
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <h4 className="text-base font-semibold text-slate-800 mb-4">Fine-tune Output</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={() => handleTransformation("removeEmDashes")}
                  variant="outline"
                  size="sm"
                  className={
                    appliedTransformations.removeEmDashes
                      ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200/70 shadow-sm"
                      : "border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                  }
                >
                  <Minus className="w-3 h-3 mr-2" />
                  Remove Dashes
                </Button>

                <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-slate-300 bg-white shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="!h-7 !w-7 text-slate-600 hover:bg-slate-100 rounded-md"
                    onClick={() =>
                      handleTransformation("addTypos", Math.max(0, appliedTransformations.addTypos.level - 1))
                    }
                    disabled={appliedTransformations.addTypos.level === 0}
                    aria-label="Decrease typos"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-slate-700 min-w-[50px] text-center select-none">
                    {appliedTransformations.addTypos.level} Typos
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="!h-7 !w-7 text-slate-600 hover:bg-slate-100 rounded-md"
                    onClick={() =>
                      handleTransformation("addTypos", Math.min(5, appliedTransformations.addTypos.level + 1))
                    }
                    disabled={appliedTransformations.addTypos.level === 5}
                    aria-label="Increase typos"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-blue-50/30 to-purple-50/30 backdrop-blur-md flex items-center justify-center z-50">
          <Card className="p-6 sm:p-8 bg-white shadow-2xl border-0 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative h-8 w-8">
                <div className="animate-spin rounded-full h-full w-full border-2 border-blue-200"></div>
                <div className="animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-blue-500 absolute top-0 left-0"></div>
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-lg">Processing your text...</p>
                <p className="text-slate-500 text-sm">This may take a few moments.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
