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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(222.2, 84%, 4.9%)' }}>
      <Navigation />
      
      {/* Pencil sketches background with preloading */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(${mangaSketchesBackground})`,
            backgroundColor: 'hsl(222.2, 84%, 4.9%)' // Fallback while loading
          }}
        ></div>
      </div>
      
      {/* Pencil overlay at bottom */}
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl font-bold text-ink-black mb-4">
              Comics
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Korean style web comics and manga with original stories and characters
            </p>
          </div>
          
          {/* God of Lies */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="relative group">
                <img 
                  src={godOfLiesCover} 
                  alt="God of Lies manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
            <div className="order-2">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                God of Lies
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
              </p>
            </div>
          </div>
          
          {/* Division and Coming Soon Text */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6">
              <div className="hand-drawn-line flex-1"></div>
              <h2 className="hand-drawn-text text-5xl font-bold text-ink-black">
                2026
              </h2>
              <div className="hand-drawn-line flex-1"></div>
            </div>
          </div>
          
          {/* Soul Tied - Hidden initially, reveals only on scroll */}
          <div 
            className={`mb-16 flex flex-col items-center text-center scroll-slide-left ${visibleElements.has("soul-tied") ? "visible" : ""}`} 
            data-scroll-animation="soul-tied"
            style={{ 
              opacity: visibleElements.has("soul-tied") ? 1 : 0,
              transform: visibleElements.has("soul-tied") ? 'translateX(0)' : 'translateX(-100px)',
              transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'opacity 0.3s ease-out' : 'all 0.8s ease-out'
            }}
          >
            <div className="relative group mb-6">
              <img 
                src={soulTiedCover} 
                alt="Soul Tied manga cover"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                style={{ backgroundColor: 'hsl(217.2, 32.6%, 17.5%)' }} // Dark placeholder
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                Soul Tied
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
                [Placeholder text] Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
              </p>
            </div>
          </div>
          
          {/* The Burden - Hidden initially, reveals only on scroll */}
          <div 
            className={`mb-16 flex flex-col items-center text-center scroll-slide-right ${visibleElements.has("the-burden") ? "visible" : ""}`} 
            data-scroll-animation="the-burden"
            style={{ 
              opacity: visibleElements.has("the-burden") ? 1 : 0,
              transform: visibleElements.has("the-burden") ? 'translateX(0)' : 'translateX(100px)',
              transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'opacity 0.3s ease-out' : 'all 0.8s ease-out'
            }}
          >
            <div className="relative group mb-6">
              <img 
                src={theBurdenCover} 
                alt="The Burden manga cover"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                style={{ backgroundColor: 'hsl(217.2, 32.6%, 17.5%)' }} // Dark placeholder
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                The Burden
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
                [Placeholder text] A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-12 mt-20" style={{ backgroundColor: 'hsl(217.2, 32.6%, 17.5%)' }}>
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