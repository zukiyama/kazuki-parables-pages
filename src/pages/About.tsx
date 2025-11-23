import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import artistPortrait from "@/assets/artist-portrait.png";
import bannerImage from "@/assets/about-banner-washing-line.jpg";
import windowCity from "@/assets/about-window-city.png";
import aerialStreet from "@/assets/about-aerial-street.jpeg";
import japaneseRoomView from "@/assets/about-japanese-room-view.png";
import photographerWindow from "@/assets/about-photographer-window.jpeg";
import shopWindow from "@/assets/about-shop-window.png";
import taiChi from "@/assets/about-tai-chi.png";
import pigeonSeine from "@/assets/about-pigeon-seine.jpeg";
import parisAerial from "@/assets/about-paris-aerial.jpeg";
import backgroundSphere from "@/assets/about-background-new.png";
import japaneseRoom from "@/assets/about-japanese-room.png";
import taiChiPark from "@/assets/about-tai-chi-park.png";
import signatureYamakawa from "@/assets/signature-yamakawa.jpeg";
import childPortrait from "@/assets/about-child-portrait.jpeg";
import cityscapeAerial from "@/assets/about-cityscape-aerial.png";

const About = () => {
  const visibleElements = useScrollAnimation();
  const [showCityscape, setShowCityscape] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollPosition / pageHeight;
      
      // Trigger cityscape fade-in a few seconds after scrolling 2/3 down the page
      if (scrollPercentage >= 0.66 && !showCityscape) {
        setTimeout(() => {
          setShowCityscape(true);
        }, 3000); // 3 second delay after reaching 2/3 scroll
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCityscape]);
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Banner */}
      <div className="w-full h-[40vh] relative overflow-hidden mt-16 max-sm:h-[20vh]">
        <OptimizedImage 
          src={bannerImage}
          alt="Vintage Japanese cityscape"
          className="w-full h-full object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Artist Portrait & Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="w-80 h-80 relative">
              <OptimizedImage 
                src={artistPortrait}
                alt="Kazuki Yamakawa portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2 flex items-center">
            <div className="space-y-6">
              <h1 className="font-heading text-4xl lg:text-5xl tracking-tight text-foreground">
                Kazuki Yamakawa
              </h1>
              <p className="font-body text-base lg:text-lg leading-relaxed text-foreground/80 max-w-2xl">
                This is the website of Kazuki Yamakawa. Very little is known aside from the 
                impressions we have drawn from the writing and music. A writer and composer, 
                this is the website where his work is displayed. It is not even known if this 
                represents an individual or a collective—though it is believed to be a person 
                with that name.
              </p>
            </div>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="relative -mx-6 mb-3">
          {/* Faded background image - full width with slim equal borders */}
          <div 
            data-scroll-animation="background-image"
            className={`relative pointer-events-none overflow-hidden scroll-fade-up ${visibleElements.has("background-image") ? "visible" : ""}`}
            style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
          >
            {/* Cityscape layer behind everything - desktop only */}
            <div 
              className={`absolute inset-0 max-sm:hidden z-0 ${showCityscape ? 'animate-cityscape-fade-in' : 'opacity-0'}`}
              style={{ animationDuration: '10s', animationFillMode: 'forwards' }}
            >
              <OptimizedImage
                src={cityscapeAerial}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* White gradient at top of cityscape */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            </div>
            
            {/* Mobile: Child portrait as background */}
            <OptimizedImage
              src={childPortrait}
              alt=""
              className="w-full h-auto object-cover sm:hidden"
            />
            
            {/* Desktop: PNG overlay with transparent areas - slightly enlarged to cover edges */}
            <div 
              className="relative z-10 max-sm:hidden" 
              style={{ 
                transform: 'scale(1.02)',
                transformOrigin: 'center bottom'
              }}
            >
              <OptimizedImage
                src={backgroundSphere}
                alt=""
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* White overlay to replicate 80% opacity faded effect - affects both cityscape and background */}
            <div className="absolute inset-0 bg-white/40 max-sm:hidden pointer-events-none z-20" />
            
            {/* Desktop text and signature - hidden on mobile */}
            <div 
              data-scroll-animation="quote-text"
              className={`absolute top-[15%] left-[8%] max-w-md pointer-events-auto max-sm:hidden scroll-slide-left ${visibleElements.has("quote-text") ? "visible" : ""}`}
            >
              <p className="font-body text-base lg:text-lg leading-relaxed text-foreground/90 mb-6 italic">
                I have always preferred to withdraw from society, finding solace in quiet observation 
                rather than participation. The world moves too quickly for meaningful reflection, and 
                in my solitude, I discover the stories worth telling.
              </p>
              <OptimizedImage 
                src={signatureYamakawa}
                alt="Yamakawa signature"
                className="w-32 h-auto opacity-90"
              />
            </div>
            
            {/* Mobile text - shown only on mobile */}
            <div className="hidden max-sm:block absolute inset-0 bg-black/40 pointer-events-auto">
              <div className="flex items-center justify-center h-full px-6 text-center">
                <p className="font-body text-xl text-white leading-relaxed max-w-md drop-shadow-lg">
                  A writer and composer exploring the spaces between memory and imagination
                </p>
              </div>
            </div>
            
            {/* Desktop text at bottom right - hidden on mobile */}
            <div 
              data-scroll-animation="bottom-right-text"
              className={`absolute bottom-[24%] right-[12%] max-w-md pointer-events-auto max-sm:hidden scroll-slide-right z-30 ${visibleElements.has("bottom-right-text") ? "visible" : ""}`}
            >
              <p className="font-body text-2xl lg:text-3xl text-white italic">
                the eye closes,<br/><span className="inline-block pl-8 mt-6">reality appears</span>
              </p>
            </div>
          </div>
        </div>

      </div>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 relative z-10 max-sm:py-8 -mt-[63px]">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-white">
            kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
