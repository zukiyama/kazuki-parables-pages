import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
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
import backgroundSphere from "@/assets/about-background-new.jpeg";
import japaneseRoom from "@/assets/about-japanese-room.png";
import taiChiPark from "@/assets/about-tai-chi-park.png";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
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
          <div className="relative pointer-events-none overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <OptimizedImage 
              src={backgroundSphere}
              alt=""
              className="w-full h-auto object-cover opacity-80"
            />
          </div>
        </div>

        {/* Three Photos Row - positioned 30px above footer */}
        <div className="relative mb-[30px] -mx-6">
          <div className="flex gap-[14px] justify-between" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <div className="flex-1 aspect-[4/3] overflow-hidden">
              <OptimizedImage 
                src={photographerWindow}
                alt="Photographer in shop window"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex-1 aspect-[4/3] overflow-hidden">
              <OptimizedImage 
                src={japaneseRoom}
                alt="Japanese room with city view"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex-1 aspect-[4/3] overflow-hidden">
              <OptimizedImage 
                src={taiChiPark}
                alt="Tai chi practice in park"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 -mt-[105px] relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-white">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
