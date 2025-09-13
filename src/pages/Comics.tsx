import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import mangaSketchesBackground from "@/assets/manga-sketches-background.jpg";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";

const Comics = () => {
  const visibleElements = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Pencil sketches background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url(${mangaSketchesBackground})`
          }}
        ></div>
      </div>
      
      {/* Mondrian-inspired comic panel grid */}
      <div className="relative z-10">
        {/* Vertical lines */}
        <div className="fixed left-[20%] top-0 w-[3px] h-full bg-ink-black opacity-40 mondrian-line-fade"></div>
        <div className="fixed left-[45%] top-0 w-[2px] h-full bg-ink-black opacity-30 mondrian-line-fade"></div>
        <div className="fixed left-[75%] top-0 w-[4px] h-full bg-ink-black opacity-35 mondrian-line-fade"></div>
        
        {/* Horizontal lines */}
        <div className="fixed top-[30%] left-0 h-[3px] w-full bg-ink-black opacity-40 mondrian-line-fade"></div>
        <div className="fixed top-[55%] left-0 h-[2px] w-full bg-ink-black opacity-30 mondrian-line-fade"></div>
        <div className="fixed top-[80%] left-0 h-[4px] w-full bg-ink-black opacity-25 mondrian-line-fade"></div>
      </div>

      <main className="relative z-20 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h1 className="font-heading text-5xl font-bold text-ink-black mb-4">
            Comics
          </h1>
          <p className="font-body text-xl text-muted-foreground">
            Korean style web comics and manga with original stories and characters
          </p>
        </div>

        {/* God of Lies - Large panel */}
        <div className="relative h-screen flex items-center justify-center px-6 mb-20">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Image panel */}
            <div className="lg:col-span-2 relative">
              <div className="relative group max-w-md mx-auto">
                <div className="absolute -inset-4 border-2 border-ink-black opacity-20 rounded-none comic-panel-border"></div>
                <img 
                  src={godOfLiesCover} 
                  alt="God of Lies manga cover"
                  className="w-full rounded-none shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
            
            {/* Text panel */}
            <div className="lg:col-span-3 lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-6 border-l-2 border-ink-black opacity-15 lg:block hidden"></div>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink-black mb-6">
                  God of Lies
                </h2>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon 2026 Divider */}
        <div className="text-center mb-20 px-6">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-[3px] bg-ink-black opacity-20"></div>
            <div className="relative bg-background px-8 inline-block">
              <h2 className="hand-drawn-text text-6xl font-bold text-ink-black opacity-60">
                2026
              </h2>
            </div>
          </div>
        </div>

        {/* Soul Tied - Medium panel */}
        <div className="relative flex justify-center items-center px-6 mb-32">
          <div className={`max-w-4xl w-full text-center scroll-slide-left ${visibleElements.has("soul-tied") ? "visible" : ""}`} data-scroll-animation="soul-tied">
            <div className="relative inline-block">
              <div className="absolute -inset-6 border-2 border-ink-black opacity-15 comic-panel-border"></div>
              <div className="relative group max-w-sm mx-auto mb-8">
                <img 
                  src={soulTiedCover} 
                  alt="Soul Tied manga cover"
                  className="w-full rounded-none shadow-xl transform group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                  Soul Tied
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Burden - Small panel */}
        <div className="relative flex justify-end items-center px-6 mb-20">
          <div className={`max-w-3xl w-full lg:w-2/3 text-center scroll-slide-right ${visibleElements.has("the-burden") ? "visible" : ""}`} data-scroll-animation="the-burden">
            <div className="relative inline-block">
              <div className="absolute -inset-4 border border-ink-black opacity-10 comic-panel-border"></div>
              <div className="relative group max-w-xs mx-auto mb-6">
                <img 
                  src={theBurdenCover} 
                  alt="The Burden manga cover"
                  className="w-full rounded-none shadow-lg transform group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="font-heading text-2xl font-bold text-ink-black mb-3">
                  The Burden
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;