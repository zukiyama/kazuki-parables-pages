import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import mangaSketchesBackground from "@/assets/manga-sketches-background.jpg";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";

const Comics = () => {
  const visibleElements = useScrollAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrolled / maxScroll, 1);
      
      // Animate lines based on scroll progress
      const lines = document.querySelectorAll('[data-line]');
      lines.forEach((line, index) => {
        const element = line as HTMLElement;
        const delay = index * 0.1;
        const progress = Math.max(0, Math.min(1, (scrollProgress - delay) * 2));
        
        if (element.classList.contains('fixed') && element.style.width) {
          // Vertical line
          element.style.transform = `scaleY(${progress})`;
          element.style.transformOrigin = 'top';
        } else if (element.classList.contains('fixed') && element.style.height) {
          // Horizontal line
          element.style.transform = `scaleX(${progress})`;
          element.style.transformOrigin = 'left';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      
      {/* Irregular Mondrian-inspired comic panel grid */}
      <div className="relative z-10">
        {/* Vertical lines - irregular positioning */}
        <div className="fixed left-[15%] top-0 w-[4px] h-full bg-ink-black opacity-15 mondrian-line-scroll-draw" data-line="v1"></div>
        <div className="fixed left-[28%] top-0 w-[2px] h-full bg-ink-black opacity-12 mondrian-line-scroll-draw" data-line="v2"></div>
        <div className="fixed left-[42%] top-0 w-[3px] h-full bg-ink-black opacity-18 mondrian-line-scroll-draw" data-line="v3"></div>
        <div className="fixed left-[63%] top-0 w-[5px] h-full bg-ink-black opacity-14 mondrian-line-scroll-draw" data-line="v4"></div>
        <div className="fixed left-[78%] top-0 w-[2px] h-full bg-ink-black opacity-16 mondrian-line-scroll-draw" data-line="v5"></div>
        <div className="fixed left-[88%] top-0 w-[3px] h-full bg-ink-black opacity-13 mondrian-line-scroll-draw" data-line="v6"></div>
        
        {/* Horizontal lines - irregular positioning */}
        <div className="fixed top-[25%] left-0 h-[3px] w-full bg-ink-black opacity-14 mondrian-line-scroll-draw" data-line="h1"></div>
        <div className="fixed top-[38%] left-0 h-[2px] w-full bg-ink-black opacity-12 mondrian-line-scroll-draw" data-line="h2"></div>
        <div className="fixed top-[52%] left-0 h-[4px] w-full bg-ink-black opacity-16 mondrian-line-scroll-draw" data-line="h3"></div>
        <div className="fixed top-[67%] left-0 h-[2px] w-full bg-ink-black opacity-13 mondrian-line-scroll-draw" data-line="h4"></div>
        <div className="fixed top-[81%] left-0 h-[3px] w-full bg-ink-black opacity-15 mondrian-line-scroll-draw" data-line="h5"></div>
        <div className="fixed top-[92%] left-0 h-[2px] w-full bg-ink-black opacity-11 mondrian-line-scroll-draw" data-line="h6"></div>
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

        {/* God of Lies - Large panel fitting within Mondrian rectangle (left side, large) */}
        <div className="absolute" style={{ left: '5%', top: '30%', width: '23%', height: '22%' }}>
          <div className="relative h-full flex items-center justify-center">
            <img 
              src={godOfLiesCover} 
              alt="God of Lies manga cover"
              className="h-full w-auto object-contain rounded-none shadow-2xl transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>

        {/* God of Lies text panel (right side of image) */}
        <div className="absolute" style={{ left: '30%', top: '28%', width: '32%', height: '26%' }}>
          <div className="h-full flex flex-col justify-center p-4">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
              God of Lies
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
            </p>
          </div>
        </div>

        {/* Coming Soon 2026 Divider */}
        <div className="absolute" style={{ left: '45%', top: '58%', width: '15%', height: '8%' }}>
          <div className="h-full flex items-center justify-center">
            <h2 className="hand-drawn-text text-4xl font-bold text-ink-black opacity-60">
              2026
            </h2>
          </div>
        </div>

        {/* Soul Tied - Medium panel (bottom left, smaller) */}
        <div className="absolute" style={{ left: '8%', top: '70%', width: '18%', height: '18%' }}>
          <div className="relative h-full flex items-center justify-center">
            <img 
              src={soulTiedCover} 
              alt="Soul Tied manga cover"
              className="h-full w-auto object-contain rounded-none shadow-xl transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>

        {/* Soul Tied text panel (right of image) */}
        <div className="absolute" style={{ left: '30%', top: '68%', width: '30%', height: '22%' }}>
          <div className="h-full flex flex-col justify-center p-4">
            <h2 className="font-heading text-2xl font-bold text-ink-black mb-3">
              Soul Tied
            </h2>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
            </p>
          </div>
        </div>

        {/* The Burden - Small panel (top right, smallest) */}
        <div className="absolute" style={{ left: '68%', top: '32%', width: '15%', height: '15%' }}>
          <div className="relative h-full flex items-center justify-center">
            <img 
              src={theBurdenCover} 
              alt="The Burden manga cover"
              className="h-full w-auto object-contain rounded-none shadow-lg transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>

        {/* The Burden text panel (left of image) */}
        <div className="absolute" style={{ left: '85%', top: '30%', width: '12%', height: '19%' }}>
          <div className="h-full flex flex-col justify-center p-2">
            <h2 className="font-heading text-lg font-bold text-ink-black mb-2">
              The Burden
            </h2>
            <p className="font-body text-xs text-muted-foreground leading-tight">
              A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility.
            </p>
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