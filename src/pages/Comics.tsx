import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import mangaSketchesBackground from "@/assets/manga-sketches-background.jpg";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import surnameProPendragonCover from "@/assets/surname-pendragon-cover.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";
import mrMiracleCover from "@/assets/mr-miracle-cover.jpg";
import godsCover from "@/assets/gods-cover.jpg";
import scriptedCover from "@/assets/scripted-cover.jpg";
import orangesGoldCover from "@/assets/oranges-gold-cover.jpg";

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
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl font-bold text-ink-black mb-4">
              Comics
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Korean style web comics and manga with original stories and characters
            </p>
          </div>
          
          {/* Featured Comics - Newsstand Style */}
          <div className="mb-20">
            <h2 className="font-heading text-4xl font-bold text-ink-black text-center mb-12">
              Featured
            </h2>
            
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
          
          {/* Other Comics - Newsstand Style Alternating */}
          <div className="space-y-12">
            
            {/* The Burden - Left image, right text */}
            <div className={`scroll-slide-left ${visibleElements.has("the-burden") ? "visible" : ""}`} data-scroll-animation="the-burden">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative group">
                    <img 
                      src={theBurdenCover} 
                      alt="The Burden manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      The Burden
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mr. Miracle - Right image, left text */}
            <div className={`scroll-slide-right ${visibleElements.has("mr-miracle") ? "visible" : ""}`} data-scroll-animation="mr-miracle">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="md:order-2 relative group">
                    <img 
                      src={mrMiracleCover} 
                      alt="Mr. Miracle manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:order-1">
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      Mr. Miracle
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Soul Tied - Left image, right text */}
            <div className={`scroll-slide-left ${visibleElements.has("soul-tied") ? "visible" : ""}`} data-scroll-animation="soul-tied">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative group">
                    <img 
                      src={soulTiedCover} 
                      alt="Soul Tied manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      Soul Tied
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gods! - Right image, left text */}
            <div className={`scroll-slide-right ${visibleElements.has("gods") ? "visible" : ""}`} data-scroll-animation="gods">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="md:order-2 relative group">
                    <img 
                      src={godsCover} 
                      alt="Gods! manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:order-1">
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      Gods!
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scripted - Left image, right text */}
            <div className={`scroll-slide-left ${visibleElements.has("scripted") ? "visible" : ""}`} data-scroll-animation="scripted">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative group">
                    <img 
                      src={scriptedCover} 
                      alt="Scripted manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      Scripted
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Oranges are Made of Gold - Right image, left text */}
            <div className={`scroll-slide-right ${visibleElements.has("oranges-gold") ? "visible" : ""}`} data-scroll-animation="oranges-gold">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="md:order-2 relative group">
                    <img 
                      src={orangesGoldCover} 
                      alt="Oranges are Made of Gold manga cover"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:order-1">
                    <h3 className="font-heading text-2xl font-bold text-ink-black mb-3">
                      Oranges are Made of Gold
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      A 99-year-old Korean CEO controls a vast orange empire built on rare oranges that grow only on Jeju Island. Instead of naming an heir, he forces his two sons to compete - whoever makes the most profit in one year inherits everything. A tale spanning generations, exploring family legacy, competition, and the price of empire.
                    </p>
                  </div>
                </div>
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