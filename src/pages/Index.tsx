
import React from 'react';
import TextProcessor from '@/components/TextProcessor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
            De-ChatGPT-ify
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform AI-generated text into natural, human-sounding content. 
            Remove that robotic feel and add authentic imperfections.
          </p>
        </div>
        
        <TextProcessor />
        
        <div className="text-center mt-16 text-slate-500">
          <p className="text-sm">
            Made for humans, by humans (with a little AI help) ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
