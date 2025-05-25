
import React from 'react';
import TextProcessor from '@/components/TextProcessor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              AI Text Humanizer
            </span>
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            HumanizeAI
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform AI-generated content into natural, human-sounding text. 
            Perfect for academic papers, professional documents, and social media posts.
          </p>
          <div className="flex justify-center items-center gap-6 mt-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Remove AI patterns
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Add human touches
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Context-aware rewriting
            </div>
          </div>
        </div>
        
        <TextProcessor />
        
        <div className="text-center mt-20 text-slate-400">
          <p className="text-sm">
            Making AI content indistinguishable from human writing ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
