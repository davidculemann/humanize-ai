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
import { Copy, Minus, Plus, Shuffle, Sparkles } from 'lucide-react';
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
    setOutputText('');
  };

  const handleUseCaseChange = (newUseCase: UseCase, newCustomPrompt?: string) => {
    setUseCase(newUseCase);
    setCustomPrompt(newCustomPrompt || '');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-800">Original Text</CardTitle>
              <div className="flex items-center gap-2">
                <ContentTypeSelector
                  useCase={useCase}
                  customPrompt={customPrompt}
                  onUseCaseChange={handleUseCaseChange}
                  isMobile={isMobile}
                />
                <Badge variant="outline" className="text-slate-500">
                  {inputText.length} chars
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Paste your AI-generated text here to make it sound more human..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                resetTransformations();
              }}
              className="min-h-[300px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700 leading-relaxed"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleAIRewrite}
                disabled={!inputText.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Rewrite
              </Button>
              
              <Button
                onClick={handleHumanize}
                disabled={!inputText.trim() || isProcessing}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Humanize
              </Button>
              
              <Button
                onClick={() => handleTransformation('removeEmDashes')}
                disabled={!inputText.trim()}
                variant="outline"
                className={appliedTransformations.removeEmDashes ? "bg-green-50 border-green-200" : ""}
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Dashes
              </Button>
              
              <div className="col-span-1 flex items-center justify-between h-10 px-2 rounded-md border border-slate-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="!h-8 !w-8 text-slate-600 hover:bg-slate-100"
                  onClick={() => handleTransformation('addTypos', Math.max(0, appliedTransformations.addTypos.level - 1))}
                  disabled={!inputText.trim() || appliedTransformations.addTypos.level === 0}
                  aria-label="Decrease typos"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-slate-700 select-none">
                  {appliedTransformations.addTypos.level} Typos
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="!h-8 !w-8 text-slate-600 hover:bg-slate-100"
                  onClick={() => handleTransformation('addTypos', Math.min(5, appliedTransformations.addTypos.level + 1))}
                  disabled={!inputText.trim() || appliedTransformations.addTypos.level === 5}
                  aria-label="Increase typos"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-800">Humanized Text</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-slate-500">
                  {outputText.length} chars
                </Badge>
                {outputText && (
                  <Button
                    onClick={() => handleCopy(outputText)}
                    size="sm"
                    variant="ghost"
                    className="hover:bg-slate-100"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="min-h-[300px] p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg border border-slate-200">
              {outputText ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {outputText}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    Your humanized text will appear here...
                  </p>
                </div>
              )}
            </div>

            {outputText && (
              <Button
                onClick={() => handleCopy(outputText)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Humanized Text
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8 bg-white shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-700 font-medium">Processing your text...</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
