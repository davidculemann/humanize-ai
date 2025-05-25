"use client"

import Footer from "@/components/Footer"
import TextProcessor from "@/components/TextProcessor"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Simplified background with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-semibold text-slate-800">HumanizeAI</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  AI Detection Bypass
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Natural Language
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI Text Humanizer
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Make AI Text
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Sound Human
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
              Transform robotic AI content into natural, engaging text that passes detection and connects with readers.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="pb-16">
          <div className="container mx-auto px-4">
            <TextProcessor />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Index
