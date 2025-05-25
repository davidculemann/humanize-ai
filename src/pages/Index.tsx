import Footer from '@/components/Footer';
import TextProcessor from '@/components/TextProcessor';

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Layers - Corrected z-index order */}
      <div className="fixed inset-0 z-[-3] bg-background" />
      <img 
        src="/shadow.png" 
        alt="Background Shadow" 
        className="fixed inset-0 z-[-2] h-full w-full object-cover opacity-60 dark:invert" 
      />
      <div 
        className="fixed inset-0 z-[-1] h-1/2 bg-gradient-to-b from-background via-background/80 to-transparent" 
      /> {/* This fade is behind the grid */}
      <div className="fixed inset-0 z-0 background-grid opacity-30" /> {/* Grid is now on top of the fade */}
      

      {/* Actual Page Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex justify-center sm:justify-start">
            <img src="/logo.svg" alt="HumanizeAI Logo" className="h-10 w-auto" />
          </div>
        </header>
        <main className="flex-1">
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
