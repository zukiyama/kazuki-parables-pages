import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import surnameProPendragonCover from "@/assets/surname-pendragon-cover-new.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";
import mrMiracleCover from "@/assets/mr-miracle-cover-new.jpg";
import godsCover from "@/assets/gods-cover-new.jpg";
import scriptedCover from "@/assets/scripted-cover-new.jpg";
import orangesGoldCover from "@/assets/oranges-gold-cover.jpg";

const Comics = () => {
  const visibleElements = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden">
      <Navigation />
      
      {/* Wooden Newsstand Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 opacity-20"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-900/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
        
        {/* Wood grain texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(139, 69, 19, 0.1) 0px,
            rgba(160, 82, 45, 0.1) 2px,
            rgba(139, 69, 19, 0.1) 4px
          )`
        }}></div>
      </div>
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Newsstand Header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-amber-100 border-4 border-amber-800 rounded-lg px-12 py-6 shadow-2xl transform -rotate-1">
              <h1 className="font-heading text-6xl font-bold text-amber-900 mb-2 tracking-wide">
                COMICS
              </h1>
              <div className="w-full h-1 bg-amber-800 rounded"></div>
              <p className="font-body text-xl text-amber-800 mt-4 font-semibold">
                Korean Manhwa & Stories
              </p>
            </div>
            
            {/* Little drawings on the stand */}
            <div className="mt-8 flex justify-center items-center gap-8">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center transform rotate-12">
                <span className="text-2xl">👾</span>
              </div>
              <div className="w-12 h-12 bg-amber-200 rounded flex items-center justify-center transform -rotate-6">
                <span className="text-lg">🛸</span>
              </div>
            </div>
          </div>
          
          {/* Featured Comics - Newsstand Top Shelf */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="h-1 bg-gradient-to-r from-transparent to-amber-800 flex-1"></div>
              <h2 className="font-heading text-4xl font-bold text-amber-900 bg-amber-100 px-6 py-2 rounded-lg border-2 border-amber-800">
                FEATURED
              </h2>
              <div className="h-1 bg-gradient-to-l from-transparent to-amber-800 flex-1"></div>
            </div>
            
            {/* Two featured comics side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* God of Lies */}
              <div className={`newsstand-comic-large ${visibleElements.has("god-of-lies") ? "visible" : ""}`} data-scroll-animation="god-of-lies">
                <div className="bg-amber-50 border-4 border-amber-800 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={godOfLiesCover} 
                      alt="God of Lies manhwa cover"
                      className="w-full rounded-lg shadow-xl border-2 border-amber-700"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      ₩4,500
                    </div>
                    <div className="absolute top-2 left-2 bg-amber-900 text-white px-2 py-1 rounded text-xs">
                      2026.06
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-heading text-3xl font-bold text-amber-900 mb-3 text-center">
                      God of Lies
                    </h3>
                    <p className="font-body text-amber-800 leading-relaxed text-center">
                      A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Surname Pendragon */}
              <div className={`newsstand-comic-large ${visibleElements.has("surname-pendragon") ? "visible" : ""}`} data-scroll-animation="surname-pendragon">
                <div className="bg-amber-50 border-4 border-amber-800 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={surnameProPendragonCover} 
                      alt="Surname Pendragon comic cover"
                      className="w-full rounded-lg shadow-xl border-2 border-amber-700"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      £4.50
                    </div>
                    <div className="absolute top-2 left-2 bg-amber-900 text-white px-2 py-1 rounded text-xs">
                      2026.10
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-heading text-3xl font-bold text-amber-900 mb-3 text-center">
                      Surname Pendragon
                    </h3>
                    <p className="font-body text-amber-800 leading-relaxed text-center">
                      A modern retelling of King Arthur set in contemporary times. Follow a young office worker who unknowingly carries the legendary bloodline.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Coming Soon Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-amber-200 border-3 border-amber-900 rounded-lg px-8 py-4 shadow-xl transform rotate-1">
              <h2 className="font-heading text-4xl font-bold text-amber-900">
                Coming 2026
              </h2>
            </div>
          </div>
          
          {/* Pencils and erasers on shelf */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="w-2 h-16 bg-yellow-400 rounded-full transform rotate-12 shadow-md"></div>
            <div className="w-2 h-14 bg-red-500 rounded-full transform -rotate-6 shadow-md"></div>
            <div className="w-2 h-18 bg-blue-500 rounded-full transform rotate-3 shadow-md"></div>
            <div className="w-8 h-4 bg-pink-300 rounded transform -rotate-12 shadow-md"></div>
            <div className="w-6 h-3 bg-white rounded transform rotate-6 shadow-md border border-gray-300"></div>
          </div>
            
            {/* God of Lies - Slide from left */}
            <div className={`mb-16 scroll-slide-left ${visibleElements.has("god-of-lies") ? "visible" : ""}`} data-scroll-animation="god-of-lies">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="relative group">
                    <img 
                      src={godOfLiesCover} 
                      alt="God of Lies manga cover"
                      className="w-full max-w-lg mx-auto rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-4xl font-bold text-ink-black mb-6">
                      God of Lies
                    </h3>
                    <p className="font-body text-lg text-muted-foreground leading-relaxed">
                      A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Surname Pendragon - Slide from right */}
            <div className={`mb-16 scroll-slide-right ${visibleElements.has("surname-pendragon") ? "visible" : ""}`} data-scroll-animation="surname-pendragon">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:order-2 relative group">
                    <img 
                      src={surnameProPendragonCover} 
                      alt="Surname Pendragon manga cover"
                      className="w-full max-w-lg mx-auto rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                  </div>
                  <div className="lg:order-1">
                    <h3 className="font-heading text-4xl font-bold text-ink-black mb-6">
                      Surname Pendragon
                    </h3>
                    <p className="font-body text-lg text-muted-foreground leading-relaxed">
                      A modern retelling of the King Arthur stories set in contemporary times. Follow a young office worker who unknowingly carries the bloodline of the legendary king. As ancient powers awaken in the modern world, he must discover his true heritage and embrace a destiny he never imagined possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coming Soon Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6">
              <div className="hand-drawn-line flex-1"></div>
              <h2 className="hand-drawn-text text-4xl font-bold text-ink-black">
                Coming 2026
              </h2>
              <div className="hand-drawn-line flex-1"></div>
            </div>
          </div>
          
          {/* Other Comics - Smaller shelf items alternating */}
          <div className="space-y-8">
            
            {/* The Burden - Left */}
            <div className={`newsstand-slide-left ${visibleElements.has("the-burden") ? "visible" : ""}`} data-scroll-animation="the-burden">
              <div className="bg-amber-100/90 border-3 border-amber-700 rounded-xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="relative group">
                    <img 
                      src={theBurdenCover} 
                      alt="The Burden manhwa cover"
                      className="w-full rounded-lg shadow-lg border-2 border-amber-600 transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      ₩3,200
                    </div>
                    <div className="absolute top-2 left-2 bg-amber-900 text-white px-1 py-0.5 rounded text-xs">
                      2026.07
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-heading text-2xl font-bold text-amber-900 mb-3">
                      The Burden
                    </h3>
                    <p className="font-body text-amber-800 leading-relaxed">
                      A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other comics would continue here with similar structure */}
            
          </div>
        </div>
      </main>
      
      <footer className="bg-amber-200 border-t-4 border-amber-800 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-amber-900 font-bold">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;