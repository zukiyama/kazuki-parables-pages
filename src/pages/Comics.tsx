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
        {/* Parallax Background - Professional manga character sketches */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(8)].map((_, layerIndex) => (
            <div
              key={layerIndex}
              ref={el => parallaxRefs.current[layerIndex] = el}
              className="absolute inset-0"
              style={{
                zIndex: -layerIndex - 1,
                opacity: 0.12 - layerIndex * 0.015
              }}
            >
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23333' stroke-width='0.8'%3E%3C!-- Professional manga character sketches layer ${layerIndex + 1} --%3E%3C!-- Main character study --%3E%3Ccircle cx='${100 + layerIndex * 40}' cy='${80 + layerIndex * 30}' r='22' stroke-width='1.2'/%3E%3Cpath d='M${85 + layerIndex * 40} ${75 + layerIndex * 30} Q${90 + layerIndex * 40} ${70 + layerIndex * 30} ${95 + layerIndex * 40} ${75 + layerIndex * 30}' stroke-width='1'/%3E%3Cpath d='M${105 + layerIndex * 40} ${75 + layerIndex * 30} Q${110 + layerIndex * 40} ${70 + layerIndex * 30} ${115 + layerIndex * 40} ${75 + layerIndex * 30}' stroke-width='1'/%3E%3Cpath d='M${88 + layerIndex * 40} ${85 + layerIndex * 30} Q${100 + layerIndex * 40} ${90 + layerIndex * 30} ${112 + layerIndex * 40} ${85 + layerIndex * 30}' stroke-width='1'/%3E%3Cpath d='M${100 + layerIndex * 40} ${102 + layerIndex * 30} L${100 + layerIndex * 40} ${180 + layerIndex * 30}' stroke-width='1.5'/%3E%3Cpath d='M${100 + layerIndex * 40} ${125 + layerIndex * 30} Q${80 + layerIndex * 40} ${140 + layerIndex * 30} ${75 + layerIndex * 40} ${160 + layerIndex * 30}' stroke-width='1.2'/%3E%3Cpath d='M${100 + layerIndex * 40} ${125 + layerIndex * 30} Q${120 + layerIndex * 40} ${140 + layerIndex * 30} ${125 + layerIndex * 40} ${160 + layerIndex * 30}' stroke-width='1.2'/%3E%3C!-- Hair details --%3E%3Cpath d='M${78 + layerIndex * 40} ${65 + layerIndex * 30} Q${85 + layerIndex * 40} ${55 + layerIndex * 30} ${95 + layerIndex * 40} ${60 + layerIndex * 30}' stroke-width='0.8'/%3E%3Cpath d='M${95 + layerIndex * 40} ${60 + layerIndex * 30} Q${105 + layerIndex * 40} ${55 + layerIndex * 30} ${115 + layerIndex * 40} ${62 + layerIndex * 30}' stroke-width='0.8'/%3E%3C!-- Female character --%3E%3Ccircle cx='${280 + layerIndex * 35}' cy='${120 + layerIndex * 40}' r='20' stroke-width='1'/%3E%3Cpath d='M${265 + layerIndex * 35} ${115 + layerIndex * 40} Q${270 + layerIndex * 35} ${110 + layerIndex * 40} ${275 + layerIndex * 35} ${115 + layerIndex * 40}' stroke-width='0.8'/%3E%3Cpath d='M${285 + layerIndex * 35} ${115 + layerIndex * 40} Q${290 + layerIndex * 35} ${110 + layerIndex * 40} ${295 + layerIndex * 35} ${115 + layerIndex * 40}' stroke-width='0.8'/%3E%3Cpath d='M${270 + layerIndex * 35} ${125 + layerIndex * 40} Q${280 + layerIndex * 35} ${130 + layerIndex * 40} ${290 + layerIndex * 35} ${125 + layerIndex * 40}' stroke-width='0.8'/%3E%3Cpath d='M${280 + layerIndex * 35} ${140 + layerIndex * 40} L${280 + layerIndex * 35} ${210 + layerIndex * 40}' stroke-width='1.2'/%3E%3C!-- Long hair --%3E%3Cpath d='M${260 + layerIndex * 35} ${100 + layerIndex * 40} Q${250 + layerIndex * 35} ${130 + layerIndex * 40} ${255 + layerIndex * 35} ${160 + layerIndex * 40}' stroke-width='1'/%3E%3Cpath d='M${300 + layerIndex * 35} ${100 + layerIndex * 40} Q${310 + layerIndex * 35} ${130 + layerIndex * 40} ${305 + layerIndex * 35} ${160 + layerIndex * 40}' stroke-width='1'/%3E%3C!-- Cute robot/mech design --%3E%3Crect x='${450 + layerIndex * 25}' y='${200 + layerIndex * 50}' width='40' height='50' rx='8' stroke-width='1.5'/%3E%3Ccircle cx='${460 + layerIndex * 25}' cy='${210 + layerIndex * 50}' r='3' fill='%23333'/%3E%3Ccircle cx='${480 + layerIndex * 25}' cy='${210 + layerIndex * 50}' r='3' fill='%23333'/%3E%3Cpath d='M${465 + layerIndex * 25} ${220 + layerIndex * 50} Q${470 + layerIndex * 25} ${225 + layerIndex * 50} ${475 + layerIndex * 25} ${220 + layerIndex * 50}' stroke-width='1'/%3E%3Crect x='${458 + layerIndex * 25}' y='${250 + layerIndex * 50}' width='8' height='15' rx='2' stroke-width='1'/%3E%3Crect x='${474 + layerIndex * 25}' y='${250 + layerIndex * 50}' width='8' height='15' rx='2' stroke-width='1'/%3E%3C!-- Sci-fi vehicle --%3E%3Cellipse cx='${200 + layerIndex * 45}' cy='${350 + layerIndex * 60}' rx='50' ry='20' stroke-width='1.5'/%3E%3Cpath d='M${170 + layerIndex * 45} ${340 + layerIndex * 60} Q${200 + layerIndex * 45} ${320 + layerIndex * 60} ${230 + layerIndex * 45} ${340 + layerIndex * 60}' stroke-width='1.2'/%3E%3Ccircle cx='${185 + layerIndex * 45}' cy='${335 + layerIndex * 60}' r='4' stroke-width='0.8'/%3E%3Ccircle cx='${215 + layerIndex * 45}' cy='${335 + layerIndex * 60}' r='4' stroke-width='0.8'/%3E%3C!-- Action pose character --%3E%3Ccircle cx='${380 + layerIndex * 30}' cy='${450 + layerIndex * 70}' r='18' stroke-width='1'/%3E%3Cpath d='M${380 + layerIndex * 30} ${468 + layerIndex * 70} Q${370 + layerIndex * 30} ${490 + layerIndex * 70} ${365 + layerIndex * 30} ${520 + layerIndex * 70}' stroke-width='1.5'/%3E%3Cpath d='M${375 + layerIndex * 30} ${480 + layerIndex * 70} Q${350 + layerIndex * 30} ${485 + layerIndex * 70} ${340 + layerIndex * 30} ${495 + layerIndex * 70}' stroke-width='1.2'/%3E%3Cpath d='M${385 + layerIndex * 30} ${480 + layerIndex * 70} Q${410 + layerIndex * 30} ${475 + layerIndex * 70} ${420 + layerIndex * 30} ${485 + layerIndex * 70}' stroke-width='1.2'/%3E%3C!-- Construction guidelines --%3E%3Cline x1='${50 + layerIndex * 60}' y1='${600 + layerIndex * 80}' x2='${550 - layerIndex * 30}' y2='${600 + layerIndex * 80}' stroke-dasharray='5,5' opacity='0.4' stroke-width='0.6'/%3E%3Cline x1='${100 + layerIndex * 50}' y1='${650 + layerIndex * 90}' x2='${500 - layerIndex * 40}' y2='${650 + layerIndex * 90}' stroke-dasharray='3,3' opacity='0.3' stroke-width='0.6'/%3E%3Cline x1='${150 + layerIndex * 40}' y1='${50 + layerIndex * 20}' x2='${150 + layerIndex * 40}' y2='${750 + layerIndex * 100}' stroke-dasharray='4,4' opacity='0.25' stroke-width='0.5'/%3E%3C!-- Expression studies --%3E%3Ccircle cx='${120 + layerIndex * 55}' cy='${650 + layerIndex * 85}' r='15' stroke-width='0.8'/%3E%3Cpath d='M${112 + layerIndex * 55} ${645 + layerIndex * 85} L${118 + layerIndex * 55} ${645 + layerIndex * 85}' stroke-width='0.6'/%3E%3Cpath d='M${122 + layerIndex * 55} ${645 + layerIndex * 85} L${128 + layerIndex * 55} ${645 + layerIndex * 85}' stroke-width='0.6'/%3E%3Cpath d='M${115 + layerIndex * 55} ${655 + layerIndex * 85} Q${120 + layerIndex * 55} ${660 + layerIndex * 85} ${125 + layerIndex * 55} ${655 + layerIndex * 85}' stroke-width='0.8'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: `${600 + layerIndex * 120}px ${800 + layerIndex * 160}px`,
                backgroundPosition: `${layerIndex * 50}px ${layerIndex * 70}px`
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