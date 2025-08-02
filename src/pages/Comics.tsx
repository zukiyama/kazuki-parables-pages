import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";

const Comics = () => {
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = (index + 1) * 0.2;
          ref.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Parallax Background - Multiple layers of manga sketches */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(6)].map((_, layerIndex) => (
            <div
              key={layerIndex}
              ref={el => parallaxRefs.current[layerIndex] = el}
              className="absolute inset-0"
              style={{
                zIndex: -layerIndex - 1,
                opacity: 0.08 - layerIndex * 0.01
              }}
            >
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='500' height='700' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23333' stroke-width='0.6'%3E%3C!-- Layer ${layerIndex + 1} - Character and location sketches --%3E%3C!-- Character studies --%3E%3Ccircle cx='${80 + layerIndex * 30}' cy='${90 + layerIndex * 20}' r='25' /%3E%3Cline x1='${65 + layerIndex * 30}' y1='${85 + layerIndex * 20}' x2='${70 + layerIndex * 30}' y2='${85 + layerIndex * 20}' /%3E%3Cline x1='${90 + layerIndex * 30}' y1='${85 + layerIndex * 20}' x2='${95 + layerIndex * 30}' y2='${85 + layerIndex * 20}' /%3E%3Cpath d='M${70 + layerIndex * 30} ${100 + layerIndex * 20} Q${80 + layerIndex * 30} ${105 + layerIndex * 20} ${90 + layerIndex * 30} ${100 + layerIndex * 20}' /%3E%3C!-- Body construction --%3E%3Cline x1='${80 + layerIndex * 30}' y1='${115 + layerIndex * 20}' x2='${80 + layerIndex * 30}' y2='${200 + layerIndex * 20}' /%3E%3Cline x1='${80 + layerIndex * 30}' y1='${140 + layerIndex * 20}' x2='${60 + layerIndex * 30}' y2='${170 + layerIndex * 20}' /%3E%3Cline x1='${80 + layerIndex * 30}' y1='${140 + layerIndex * 20}' x2='${100 + layerIndex * 30}' y2='${170 + layerIndex * 20}' /%3E%3C!-- Vehicle sketch --%3E%3Crect x='${200 + layerIndex * 40}' y='${150 + layerIndex * 30}' width='120' height='60' rx='10' stroke-dasharray='4,2'/%3E%3Ccircle cx='${220 + layerIndex * 40}' cy='${190 + layerIndex * 30}' r='15' /%3E%3Ccircle cx='${300 + layerIndex * 40}' cy='${190 + layerIndex * 30}' r='15' /%3E%3C!-- Building perspective --%3E%3Cpath d='M${350 + layerIndex * 20} ${100 + layerIndex * 40} L${400 + layerIndex * 20} ${80 + layerIndex * 40} L${400 + layerIndex * 20} ${250 + layerIndex * 40} L${350 + layerIndex * 20} ${270 + layerIndex * 40} Z' stroke-dasharray='3,3'/%3E%3Cline x1='${350 + layerIndex * 20}' y1='${130 + layerIndex * 40}' x2='${400 + layerIndex * 20}' y2='${110 + layerIndex * 40}' stroke-dasharray='2,2'/%3E%3Cline x1='${350 + layerIndex * 20}' y1='${160 + layerIndex * 40}' x2='${400 + layerIndex * 20}' y2='${140 + layerIndex * 40}' stroke-dasharray='2,2'/%3E%3C!-- Action poses --%3E%3Ccircle cx='${150 + layerIndex * 35}' cy='${350 + layerIndex * 50}' r='18' /%3E%3Cpath d='M${150 + layerIndex * 35} ${368 + layerIndex * 50} L${140 + layerIndex * 35} ${410 + layerIndex * 50} L${160 + layerIndex * 35} ${430 + layerIndex * 50}' /%3E%3Cline x1='${140 + layerIndex * 35}' y1='${380 + layerIndex * 50}' x2='${120 + layerIndex * 35}' y2='${400 + layerIndex * 50}' /%3E%3Cline x1='${160 + layerIndex * 35}' y1='${380 + layerIndex * 50}' x2='${180 + layerIndex * 35}' y2='${395 + layerIndex * 50}' /%3E%3C!-- Perspective guidelines --%3E%3Cline x1='50' y1='${500 + layerIndex * 60}' x2='450' y2='${520 + layerIndex * 60}' stroke-dasharray='5,5' opacity='0.3'/%3E%3Cline x1='100' y1='${450 + layerIndex * 70}' x2='400' y2='${470 + layerIndex * 70}' stroke-dasharray='3,3' opacity='0.4'/%3E%3C!-- Japanese text guidelines --%3E%3Crect x='${250 + layerIndex * 25}' y='${300 + layerIndex * 45}' width='80' height='100' stroke-dasharray='2,2' opacity='0.3'/%3E%3Cline x1='${260 + layerIndex * 25}' y1='${310 + layerIndex * 45}' x2='${320 + layerIndex * 25}' y2='${310 + layerIndex * 45}' stroke-dasharray='1,1' opacity='0.3'/%3E%3Cline x1='${260 + layerIndex * 25}' y1='${325 + layerIndex * 45}' x2='${315 + layerIndex * 25}' y2='${325 + layerIndex * 45}' stroke-dasharray='1,1' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: `${500 + layerIndex * 100}px ${700 + layerIndex * 150}px`,
                backgroundPosition: `${layerIndex * 40}px ${layerIndex * 60}px`
              }} />
            </div>
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl font-bold text-ink-black mb-4">
              Comics & Manga
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Korean-style web comics and Japanese manga stories
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
          
          {/* Soul Tied */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                Soul Tied
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <img 
                  src={soulTiedCover} 
                  alt="Soul Tied manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* The Burden */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="relative group">
                <img 
                  src={theBurdenCover} 
                  alt="The Burden manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
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