
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Sparkles, Minus, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  humanizeText, 
  removeEmDashes, 
  addTypos, 
  rewriteWithAI 
} from '@/utils/textProcessing';

const TextProcessor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const humanized = await humanizeText(inputText);
      setOutputText(humanized);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to humanize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveEmDashes = () => {
    if (!inputText.trim()) return;
    const cleaned = removeEmDashes(inputText);
    setOutputText(cleaned);
  };

  const handleAddTypos = () => {
    if (!inputText.trim()) return;
    const withTypos = addTypos(inputText);
    setOutputText(withTypos);
  };

  const handleAIRewrite = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const rewritten = await rewriteWithAI(inputText);
      setOutputText(rewritten);
    } catch (error) {
      toast({
        title: "Error",
        description: "AI rewrite failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-slate-700">Input Text</h2>
              <Badge variant="outline" className="text-slate-500">
                {inputText.length} chars
              </Badge>
            </div>
            
            <Textarea
              placeholder="Paste your AI-generated text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[400px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700 leading-relaxed"
            />
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={handleAIRewrite}
                disabled={!inputText.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Rewrite
              </Button>
              
              <Button
                onClick={handleHumanize}
                disabled={!inputText.trim() || isProcessing}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Humanize
              </Button>
              
              <Button
                onClick={handleRemoveEmDashes}
                disabled={!inputText.trim()}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Em Dashes
              </Button>
              
              <Button
                onClick={handleAddTypos}
                disabled={!inputText.trim()}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Add Typos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-slate-700">Humanized Text</h2>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-slate-500">
                  {outputText.length} chars
                </Badge>
                {outputText && (
                  <Button
                    onClick={() => handleCopy(outputText)}
                    size="sm"
                    variant="ghost"
                    className="hover:bg-slate-100 transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="min-h-[400px] p-4 bg-slate-50/50 rounded-lg border border-slate-200">
              {outputText ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {outputText}
                </p>
              ) : (
                <p className="text-slate-400 italic text-center mt-32">
                  Your humanized text will appear here...
                </p>
              )}
            </div>

            {outputText && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handleCopy(outputText)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-6 bg-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-slate-700">Processing your text...</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
