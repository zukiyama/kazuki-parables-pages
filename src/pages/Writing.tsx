import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";

const Writing = () => {
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = (index + 1) * 0.3;
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
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading text-5xl font-bold text-ink-black mb-8 text-center">
            Writing
          </h1>
          
          {/* KAIJU - Book 1 of Parable Trilogy */}
          <section className="mb-32 relative">
            {/* Magazine Cover */}
            <div className="relative w-full max-w-2xl mx-auto mb-8">
              <div className="aspect-[3/4] bg-gradient-to-b from-orange-200 to-yellow-100 rounded-lg shadow-xl overflow-hidden relative">
                {/* Magazine Cover Image */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100">
                  {/* Sky with meteor shower and creatures */}
                  <div className="absolute top-4 left-4 w-2 h-8 bg-white rotate-45 opacity-70"></div>
                  <div className="absolute top-8 right-8 w-1 h-6 bg-white rotate-12 opacity-60"></div>
                  <div className="absolute top-12 left-1/3 w-1 h-4 bg-white -rotate-12 opacity-50"></div>
                  
                  {/* Kyoto street scene */}
                  <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-orange-200 via-yellow-100 to-transparent">
                    {/* Buildings */}
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gray-300 border-r border-gray-400"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-2/3 bg-gray-200 border-l border-gray-400"></div>
                    
                    {/* Parade elements */}
                    <div className="absolute bottom-8 left-1/4 w-8 h-12 bg-red-400 rounded-t-lg opacity-80"></div>
                    <div className="absolute bottom-8 left-1/3 w-6 h-10 bg-blue-400 rounded-t-lg opacity-80"></div>
                    <div className="absolute bottom-8 right-1/3 w-7 h-11 bg-green-400 rounded-t-lg opacity-80"></div>
                    
                    {/* People */}
                    <div className="absolute bottom-4 left-1/5 w-2 h-4 bg-gray-600 rounded-t-full"></div>
                    <div className="absolute bottom-4 left-2/5 w-2 h-4 bg-gray-700 rounded-t-full"></div>
                    <div className="absolute bottom-4 right-1/4 w-2 h-4 bg-gray-600 rounded-t-full"></div>
                  </div>
                </div>
                
                {/* Magazine Title - PARABLE */}
                <div className="absolute top-8 right-8 text-white font-bold text-xl">
                  <div className="text-right">PAR</div>
                  <div className="text-right pl-4">AB</div>
                  <div className="text-right pl-8">LE</div>
                </div>
                
                {/* Date and Price */}
                <div className="absolute top-8 left-8 text-black font-bold text-sm">
                  <div>1979年5月</div>
                  <div>¥180</div>
                </div>
                
                {/* Parallax reveal - Boy with red balloon */}
                <div 
                  ref={el => parallaxRefs.current[0] = el}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ clipPath: 'polygon(85% 10%, 100% 10%, 100% 25%, 85% 25%)' }}
                >
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <div className="relative">
                      {/* Pencil sketch of boy */}
                      <svg width="60" height="80" viewBox="0 0 60 80" className="opacity-80">
                        <g fill="none" stroke="#333" strokeWidth="1">
                          <circle cx="30" cy="15" r="8" />
                          <line x1="30" y1="23" x2="30" y2="50" />
                          <line x1="30" y1="30" x2="20" y2="40" />
                          <line x1="30" y1="30" x2="40" y2="35" />
                          <line x1="30" y1="50" x2="25" y2="70" />
                          <line x1="30" y1="50" x2="35" y2="70" />
                        </g>
                      </svg>
                      {/* Red balloon */}
                      <div className="absolute -top-8 left-8 w-4 h-6 bg-red-500 rounded-full"></div>
                      <div className="absolute -top-2 left-10 w-px h-8 bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold text-ink-black mb-4">
                KAIJU - Book 1 of Parable Trilogy
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                A mystery unfolds in a small Japanese town where a group of boys discover that no one remembers how they got there. Set against the backdrop of 1970s Japan, strange creatures appear in the sky while the children search for answers in their forgotten past.
              </p>
            </div>
            
            {/* Additional 70s sci-fi imagery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-b from-purple-200 to-pink-200 h-32 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">70s Sci-Fi Set 1</span>
              </div>
              <div className="bg-gradient-to-b from-green-200 to-blue-200 h-32 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Alien World Painting</span>
              </div>
              <div className="bg-gradient-to-b from-orange-200 to-red-200 h-32 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">70s Sci-Fi Set 2</span>
              </div>
            </div>
          </section>
          
          {/* HOAX */}
          <section className="mb-32 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-heading text-4xl font-bold text-ink-black mb-4">
                  HOAX
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  [Placeholder text] A story set in the Australian outback where a commune holds secrets that challenge everything the residents believe about their reality.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-video bg-gradient-to-b from-orange-300 to-red-200 rounded-lg relative overflow-hidden">
                  {/* Australian outback commune scene */}
                  <div className="absolute inset-0">
                    {/* Sky */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-200 to-orange-200"></div>
                    
                    {/* Grass and landscape */}
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-green-300 to-green-200"></div>
                    
                    {/* Arch sign */}
                    <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
                      <div className="w-32 h-16 border-4 border-brown-600 rounded-t-full bg-brown-400 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">THE SECRET EVERYWHERE</span>
                      </div>
                      {/* Fairy lights */}
                      <div className="absolute -inset-2">
                        <div className="w-1 h-1 bg-yellow-300 rounded-full absolute top-2 left-4"></div>
                        <div className="w-1 h-1 bg-yellow-300 rounded-full absolute top-3 left-8"></div>
                        <div className="w-1 h-1 bg-yellow-300 rounded-full absolute top-2 right-4"></div>
                        <div className="w-1 h-1 bg-yellow-300 rounded-full absolute top-3 right-8"></div>
                      </div>
                    </div>
                    
                    {/* Buildings and caravans */}
                    <div className="absolute bottom-8 left-4 w-8 h-6 bg-gray-400 rounded"></div>
                    <div className="absolute bottom-8 left-16 w-6 h-4 bg-blue-300 rounded"></div>
                    <div className="absolute bottom-8 right-8 w-10 h-5 bg-green-400 rounded"></div>
                    <div className="absolute bottom-8 right-24 w-7 h-4 bg-red-300 rounded"></div>
                    
                    {/* Vegetable patches */}
                    <div className="absolute bottom-16 left-1/4 w-12 h-4 bg-green-500 opacity-60 rounded"></div>
                    <div className="absolute bottom-12 right-1/4 w-10 h-3 bg-green-500 opacity-60 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* OBA */}
          <section className="mb-32 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <div className="aspect-video bg-gradient-to-r from-green-400 to-green-600 rounded-lg relative overflow-hidden">
                  {/* African village scene with girl silhouette */}
                  <div className="absolute inset-0">
                    {/* Jungle background */}
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-green-600 to-green-500"></div>
                    
                    {/* Village area */}
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-orange-300 to-green-400"></div>
                    
                    {/* Girl silhouette overlay */}
                    <div className="absolute left-4 top-1/4 w-16 h-20">
                      <svg viewBox="0 0 40 50" className="w-full h-full">
                        <path d="M20 5 C25 5 25 15 20 15 C15 15 15 5 20 5 Z M20 15 L20 35 M15 25 L25 25 M20 35 L15 45 M20 35 L25 45" 
                              fill="#000" opacity="0.8"/>
                      </svg>
                    </div>
                    
                    {/* Village elements */}
                    <div className="absolute bottom-8 left-8 w-6 h-8 bg-orange-600 rounded-t-full"></div>
                    <div className="absolute bottom-8 left-20 w-8 h-6 bg-orange-500 rounded"></div>
                    <div className="absolute bottom-12 right-12 w-4 h-6 bg-green-700 rounded-t-lg"></div>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <h2 className="font-heading text-4xl font-bold text-ink-black mb-4">
                  OBA
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  [Placeholder text] Set on the edge of an African jungle, this story follows a young girl's journey as her village faces mysterious changes that threaten their way of life.
                </p>
              </div>
            </div>
          </section>
          
          {/* SIPHONS */}
          <section className="mb-32 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-heading text-4xl font-bold text-ink-black mb-4">
                  SIPHONS
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  [Placeholder text] A mysterious story involving an old Russian television set from the 1970s that broadcasts strange children's shows with otherworldly implications.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-video bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                  {/* Retro Russian TV */}
                  <div className="w-2/3 h-2/3 bg-gray-700 rounded-lg border-4 border-gray-600 relative">
                    {/* TV Screen */}
                    <div className="absolute inset-4 bg-black rounded flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-b from-green-300 to-green-500 rounded flex items-center justify-center">
                        {/* Strange children's show content */}
                        <div className="relative">
                          <div className="w-8 h-12 bg-purple-400 rounded-t-full"></div>
                          <div className="w-6 h-8 bg-yellow-400 rounded-full absolute -top-2 -right-2"></div>
                          <div className="w-4 h-6 bg-red-400 rounded absolute top-4 -left-2"></div>
                        </div>
                      </div>
                    </div>
                    {/* TV Controls */}
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="absolute bottom-6 right-2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Young Adult Books Section */}
          <section className="mb-20">
            <h2 className="font-heading text-4xl font-bold text-ink-black mb-8 text-center">
              Young Adult Book Series
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Professor Barnabas and Darwin */}
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="aspect-[3/4] bg-gradient-to-b from-orange-200 to-red-300 rounded-lg mb-4 flex items-center justify-center relative">
                  {/* Victorian London scene */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-orange-200 rounded-lg">
                    <div className="absolute bottom-4 left-4 w-8 h-12 bg-gray-600 rounded-t-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-10 bg-gray-700 rounded-t-lg"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-center z-10 bg-white/80 px-2 py-1 rounded">Victorian Shop</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-ink-black mb-2">
                  Professor Barnabas and Darwin
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  A Victorian tale of an old professor's knick-knack shop and the young boy who discovers its magical secrets.
                </p>
              </div>
              
              {/* Two Fly */}
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="aspect-[3/4] bg-gradient-to-b from-blue-300 to-gray-400 rounded-lg mb-4 flex items-center justify-center relative">
                  {/* Test pilot academy with aliens */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-gray-300 rounded-lg">
                    <div className="absolute top-8 left-4 w-3 h-6 bg-silver-400 transform rotate-45"></div>
                    <div className="absolute top-12 right-6 w-4 h-2 bg-red-400 rounded-full"></div>
                    <div className="absolute bottom-8 left-1/3 w-12 h-4 bg-green-600 rounded"></div>
                  </div>
                  <span className="text-sm font-bold text-center z-10 bg-white/80 px-2 py-1 rounded">Space Academy</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-ink-black mb-2">
                  Two Fly
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  A young test pilot's journey through an academy in a world where aliens have taken over and space battles rage.
                </p>
              </div>
              
              {/* The Land is the Dream of the Sky */}
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="aspect-[3/4] bg-gradient-to-b from-gray-500 to-gray-700 rounded-lg mb-4 flex items-center justify-center relative">
                  {/* Wasteland with robots */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg">
                    <div className="absolute bottom-8 left-8 w-4 h-6 bg-gray-400 rounded"></div>
                    <div className="absolute bottom-12 right-6 w-3 h-5 bg-gray-300 rounded"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-center z-10 bg-white/80 px-2 py-1 rounded">Robot Wasteland</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-ink-black mb-2">
                  The Land is the Dream of the Sky
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  In a grey wasteland filled with robots, one small boy remains as the last human in a world city.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Writing;