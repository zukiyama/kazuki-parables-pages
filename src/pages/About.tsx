import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import artistPortrait from "@/assets/artist-portrait.png";
import bannerImage from "@/assets/about-banner-washing-line.jpg";
import spiralStairs from "@/assets/about-spiral-stairs.png";
import windowCity from "@/assets/about-window-city.png";
import shopWindow from "@/assets/about-shop-window.png";
import pigeonRiver from "@/assets/about-pigeon-river.jpeg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/5 to-background">
      <Navigation />
      
      {/* Hero Banner */}
      <div className="w-full h-[40vh] relative overflow-hidden mt-16">
        <OptimizedImage 
          src={bannerImage}
          alt="Vintage Japanese cityscape"
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Artist Portrait & Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="w-64 h-64 relative">
              <OptimizedImage 
                src={artistPortrait}
                alt="Kazuki Yamakawa portrait"
                className="w-full h-full object-cover grayscale"
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

        {/* Photo Grid - 4 photos arranged in a rectangular block */}
        <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Top Left - City view from room (smaller) */}
          <div className="col-span-1 aspect-[3/4] overflow-hidden">
            <OptimizedImage 
              src={windowCity}
              alt="Window overlooking city"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          {/* Top Right - Man in shop window (larger, prominent) */}
          <div className="col-span-2 aspect-[4/3] overflow-hidden">
            <OptimizedImage 
              src={shopWindow}
              alt="Shop window"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          {/* Bottom Left - Stairwell */}
          <div className="col-span-1 aspect-square overflow-hidden">
            <OptimizedImage 
              src={spiralStairs}
              alt="Spiral staircase"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          {/* Bottom Right - Two pigeons */}
          <div className="col-span-2 aspect-[16/9] overflow-hidden">
            <OptimizedImage 
              src={pigeonRiver}
              alt="Pigeon by river"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-white">
            Email: kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
