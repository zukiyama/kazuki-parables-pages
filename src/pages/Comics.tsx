import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import woodenNewsstandBackground from "@/assets/wooden-newsstand-background.png";

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
    <div className="min-h-screen relative overflow-hidden" 
         style={{
           backgroundImage: `url(${woodenNewsstandBackground})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'repeat-y'
         }}>
      <Navigation />
      
      {/* Subtle overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none"></div>
      
      <main className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-4xl">
        
        {/* Top Shelf - Featured Comics */}
        <div className="relative mb-16" style={{marginTop: '120px'}}>
          <div className="grid grid-cols-2 gap-8 px-8">
            
            {/* God of Lies - Top Left */}
            <div className={`newsstand-comic-shelf ${visibleElements.has("god-of-lies") ? "visible" : ""}`} data-scroll-animation="god-of-lies">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={godOfLiesCover} 
                  alt="God of Lies"
                  className="w-full h-auto rounded-lg shadow-xl"
                  style={{maxHeight: '280px', objectFit: 'cover'}}
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  ₩4,500
                </div>
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
                  2026.06
                </div>
                <div className="mt-2 p-2 bg-white/90 rounded">
                  <h3 className="font-bold text-sm text-center mb-1">God of Lies</h3>
                  <p className="text-xs text-gray-700 leading-tight">Deception and supernatural forces in modern urban life.</p>
                </div>
              </div>
            </div>
            
            {/* Surname Pendragon - Top Right */}
            <div className={`newsstand-comic-shelf ${visibleElements.has("surname-pendragon") ? "visible" : ""}`} data-scroll-animation="surname-pendragon">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={surnameProPendragonCover} 
                  alt="Surname Pendragon"
                  className="w-full h-auto rounded-lg shadow-xl"
                  style={{maxHeight: '280px', objectFit: 'cover'}}
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  £4.50
                </div>
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
                  2026.10
                </div>
                <div className="mt-2 p-2 bg-white/90 rounded">
                  <h3 className="font-bold text-sm text-center mb-1">Surname Pendragon</h3>
                  <p className="text-xs text-gray-700 leading-tight">Modern retelling of King Arthur stories.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Second Shelf */}
        <div className="relative mb-16" style={{marginTop: '80px'}}>
          <div className="grid grid-cols-4 gap-4 px-8">
            
            {/* The Burden */}
            <div className={`newsstand-comic-small ${visibleElements.has("the-burden") ? "visible" : ""}`} data-scroll-animation="the-burden">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={theBurdenCover} 
                  alt="The Burden"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩3,200
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">The Burden</h4>
                  <p className="text-xs text-gray-700 leading-tight">Family duty and sacrifice.</p>
                </div>
              </div>
            </div>
            
            {/* Mr. Miracle */}
            <div className={`newsstand-comic-small ${visibleElements.has("mr-miracle") ? "visible" : ""}`} data-scroll-animation="mr-miracle">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={mrMiracleCover} 
                  alt="Mr. Miracle"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩3,500
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">Mr. Miracle</h4>
                  <p className="text-xs text-gray-700 leading-tight">Mysterious neighborhood newcomer.</p>
                </div>
              </div>
            </div>
            
            {/* Soul Tied */}
            <div className={`newsstand-comic-small ${visibleElements.has("soul-tied") ? "visible" : ""}`} data-scroll-animation="soul-tied">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={soulTiedCover} 
                  alt="Soul Tied"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩3,800
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">Soul Tied</h4>
                  <p className="text-xs text-gray-700 leading-tight">Two men bound by fate.</p>
                </div>
              </div>
            </div>
            
            {/* Gods! */}
            <div className={`newsstand-comic-small ${visibleElements.has("gods") ? "visible" : ""}`} data-scroll-animation="gods">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={godsCover} 
                  alt="Gods!"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩4,200
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">Gods!</h4>
                  <p className="text-xs text-gray-700 leading-tight">Space station idol-gods.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Bottom Shelf */}
        <div className="relative mb-16" style={{marginTop: '80px'}}>
          <div className="grid grid-cols-4 gap-4 px-8">
            
            {/* Scripted */}
            <div className={`newsstand-comic-small ${visibleElements.has("scripted") ? "visible" : ""}`} data-scroll-animation="scripted">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={scriptedCover} 
                  alt="Scripted"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩3,800
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">Scripted</h4>
                  <p className="text-xs text-gray-700 leading-tight">Reincarnated actors question reality.</p>
                </div>
              </div>
            </div>
            
            {/* Oranges are Made of Gold */}
            <div className={`newsstand-comic-small ${visibleElements.has("oranges-gold") ? "visible" : ""}`} data-scroll-animation="oranges-gold">
              <div className="transform hover:scale-105 transition-all duration-300">
                <img 
                  src={orangesGoldCover} 
                  alt="Oranges are Made of Gold"
                  className="w-full h-auto rounded shadow-lg"
                  style={{maxHeight: '200px', objectFit: 'cover'}}
                />
                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                  ₩4,800
                </div>
                <div className="mt-1 p-1 bg-white/90 rounded">
                  <h4 className="font-bold text-xs text-center mb-1">Oranges are Made of Gold</h4>
                  <p className="text-xs text-gray-700 leading-tight">Korean orange empire inheritance.</p>
                </div>
              </div>
            </div>
            
            {/* Empty slots for authenticity */}
            <div className="opacity-50">
              <div className="w-full bg-amber-100 rounded shadow" style={{height: '200px', border: '2px dashed #d4a574'}}></div>
              <div className="mt-1 p-1 bg-white/50 rounded">
                <p className="text-xs text-gray-500 text-center">Coming Soon</p>
              </div>
            </div>
            
            <div className="opacity-50">
              <div className="w-full bg-amber-100 rounded shadow" style={{height: '200px', border: '2px dashed #d4a574'}}></div>
              <div className="mt-1 p-1 bg-white/50 rounded">
                <p className="text-xs text-gray-500 text-center">Coming Soon</p>
              </div>
            </div>
            
          </div>
        </div>
          
        
      </main>
    </div>
  );
};

export default Comics;