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
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(${mangaSketchesBackground})`
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
          
          {/* God of Lies - Left side */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className={`comic-panel-frame ${visibleElements.has("god-of-lies") ? "visible" : ""}`} data-scroll-animation="god-of-lies">
                <img 
                  src={godOfLiesCover} 
                  alt="God of Lies manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
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
          
          {/* Soul Tied - Right side */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                Soul Tied
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className={`comic-panel-frame ${visibleElements.has("soul-tied") ? "visible" : ""}`} data-scroll-animation="soul-tied">
                <img 
                  src={soulTiedCover} 
                  alt="Soul Tied manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          
          {/* The Burden - Left side */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className={`comic-panel-frame ${visibleElements.has("the-burden") ? "visible" : ""}`} data-scroll-animation="the-burden">
                <img 
                  src={theBurdenCover} 
                  alt="The Burden manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="order-2">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                The Burden
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.
              </p>
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