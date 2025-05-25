
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2, FileText, Briefcase, User, MessageSquare, Palette, Code } from 'lucide-react';
import { UseCase } from '@/utils/textProcessing';

interface ContentTypeSelectorProps {
  useCase: UseCase;
  customPrompt?: string;
  onUseCaseChange: (useCase: UseCase, customPrompt?: string) => void;
  isMobile?: boolean;
}

const useCaseOptions = [
  { value: 'academic' as UseCase, name: 'Academic Paper', icon: FileText, description: 'Research papers, essays, formal writing' },
  { value: 'professional' as UseCase, name: 'Professional/CV', icon: Briefcase, description: 'Resumes, cover letters, business documents' },
  { value: 'casual' as UseCase, name: 'Blog/Article', icon: User, description: 'Blog posts, articles, informal writing' },
  { value: 'social' as UseCase, name: 'Social Media', icon: MessageSquare, description: 'Posts, captions, social content' },
  { value: 'creative' as UseCase, name: 'Creative Writing', icon: Palette, description: 'Stories, creative content, fiction' },
  { value: 'technical' as UseCase, name: 'Technical Docs', icon: Code, description: 'Documentation, tutorials, guides' },
  { value: 'custom' as UseCase, name: 'Custom', icon: Settings2, description: 'Define your own use case' },
];

const ContentTypeSelector = ({ useCase, customPrompt, onUseCaseChange, isMobile = false }: ContentTypeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUseCase, setTempUseCase] = useState(useCase);
  const [tempCustomPrompt, setTempCustomPrompt] = useState(customPrompt || '');

  // Update temp values when props change
  useEffect(() => {
    setTempUseCase(useCase);
    setTempCustomPrompt(customPrompt || '');
  }, [useCase, customPrompt]);

  const currentOption = useCaseOptions.find(option => option.value === useCase);

  const handleSave = () => {
    onUseCaseChange(tempUseCase, tempUseCase === 'custom' ? tempCustomPrompt : undefined);
    setIsOpen(false);
  };

  const SelectorContent = () => (
    <div className="space-y-6">
      <div className="grid gap-3">
        {useCaseOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                tempUseCase === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setTempUseCase(option.value)}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{option.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tempUseCase === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="custom-prompt">Custom Use Case</Label>
          <Input
            id="custom-prompt"
            placeholder="Describe your content type..."
            value={tempCustomPrompt}
            onChange={(e) => setTempCustomPrompt(e.target.value)}
            autoComplete="off"
          />
        </div>
      )}

      <Button onClick={handleSave} className="w-full">
        Apply Content Type
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">{currentOption?.name}</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Content Type</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <SelectorContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">{currentOption?.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Content Type</DialogTitle>
        </DialogHeader>
        <SelectorContent />
      </DialogContent>
    </Dialog>
  );
};

export default ContentTypeSelector;
