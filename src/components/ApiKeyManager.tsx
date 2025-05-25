
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle } from 'lucide-react';
import { aiService } from '@/utils/aiService';

interface ApiKeyManagerProps {
  onKeySet?: () => void;
}

const ApiKeyManager = ({ onKeySet }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const existingKey = aiService.getApiKey();
    setHasKey(!!existingKey);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      aiService.setApiKey(apiKey.trim());
      setHasKey(true);
      setIsOpen(false);
      setApiKey('');
      onKeySet?.();
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setHasKey(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="w-4 h-4" />
          {hasKey ? (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              API Key Set
            </Badge>
          ) : (
            'Set API Key'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>DeepSeek API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            <p>To use AI-powered humanization, you need a DeepSeek API key.</p>
            <p className="mt-2">
              Get your API key from{' '}
              <a 
                href="https://platform.deepseek.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                platform.deepseek.com
              </a>
            </p>
          </div>

          {hasKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">API key is configured</span>
              </div>
              <Button 
                onClick={handleRemoveKey} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Remove API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleSaveKey} 
                disabled={!apiKey.trim()}
                className="w-full"
              >
                Save API Key
              </Button>
            </div>
          )}

          <div className="text-xs text-slate-500">
            Your API key is stored locally in your browser and never sent to our servers.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;
