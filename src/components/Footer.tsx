
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm">for better writing</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://twitter.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-500 transition-colors"
            >
              <span className="text-sm font-medium">Twitter</span>
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
          
          <p className="text-xs text-slate-400 text-center">
            © 2024 HumanizeAI. Transform AI text into natural, human-sounding content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
