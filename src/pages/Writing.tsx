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
      
      {/* Parallax Background Characters */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, layerIndex) => (
          <div
            key={layerIndex}
            ref={el => parallaxRefs.current[layerIndex] = el}
            className="absolute inset-0"
            style={{
              zIndex: -layerIndex - 1,
              opacity: 0.1 - layerIndex * 0.015
            }}
          >
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='0.8'%3E%3C!-- Character sketches layer ${layerIndex + 1} --%3E%3C!-- Standing character --%3E%3Ccircle cx='80' cy='80' r='20' /%3E%3Cline x1='80' y1='100' x2='80' y2='180' /%3E%3Cline x1='80' y1='120' x2='60' y2='140' /%3E%3Cline x1='80' y1='120' x2='100' y2='140' /%3E%3Cline x1='80' y1='180' x2='70' y2='220' /%3E%3Cline x1='80' y1='180' x2='90' y2='220' /%3E%3C!-- Action pose --%3E%3Ccircle cx='200' cy='60' r='18' /%3E%3Cpath d='M200 78 L190 120 L210 140' /%3E%3Cline x1='190' y1='90' x2='170' y2='110' /%3E%3Cline x1='210' y1='90' x2='230' y2='105' /%3E%3C!-- Female character --%3E%3Ccircle cx='320' cy='90' r='16' /%3E%3Cpath d='M320 106 Q310 120 320 140 Q330 120 320 106' /%3E%3Cline x1='320' y1='140' x2='320' y2='200' /%3E%3Cline x1='320' y1='160' x2='300' y2='180' /%3E%3Cline x1='320' y1='160' x2='340' y2='180' /%3E%3C!-- Running character --%3E%3Ccircle cx='120' cy='300' r='15' /%3E%3Cpath d='M120 315 L110 350 L130 370' /%3E%3Cline x1='110' y1='330' x2='95' y2='345' /%3E%3Cline x1='130' y1='330' x2='145' y2='340' /%3E%3C!-- Sitting character --%3E%3Ccircle cx='280' cy='320' r='14' /%3E%3Cpath d='M280 334 L280 360 L290 360 L290 380' /%3E%3Cpath d='M280 360 L270 360 L270 380' /%3E%3Cline x1='280' y1='345' x2='265' y2='355' /%3E%3Cline x1='280' y1='345' x2='295' y2='355' /%3E%3C!-- Guidelines and construction lines --%3E%3Cline x1='${50 + layerIndex * 30}' y1='500' x2='${350 - layerIndex * 20}' y2='500' stroke-dasharray='3,3' opacity='0.3'/%3E%3Cline x1='50' y1='${400 + layerIndex * 40}' x2='350' y2='${400 + layerIndex * 40}' stroke-dasharray='2,2' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: `${400 + layerIndex * 50}px ${600 + layerIndex * 100}px`,
              backgroundPosition: `${layerIndex * 20}px ${layerIndex * 30}px`
            }} />
          </div>
        ))}
      </div>
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl font-bold text-ink-black mb-8">
            Writing
          </h1>
          
          {/* Book Section 1 */}
          <section className="mb-20 bg-card/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
              Young Adult Novel 1
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              [Placeholder text] Coming soon - An exciting adventure story for young adults exploring themes of friendship, courage, and self-discovery.
            </p>
          </section>
          
          {/* Book Section 2 */}
          <section className="mb-20 bg-card/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
              Young Adult Novel 2
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              [Placeholder text] A compelling story about overcoming challenges and finding your place in the world.
            </p>
          </section>
          
          {/* Book Section 3 */}
          <section className="mb-20 bg-card/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
              Young Adult Novel 3
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              [Placeholder text] An inspiring tale of resilience and the power of human connection.
            </p>
          </section>
          
          {/* Book Section 4 */}
          <section className="mb-20 bg-card/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
              Young Adult Novel 4
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              [Placeholder text] A thought-provoking story that challenges readers to think differently about the world around them.
            </p>
          </section>
          
          {/* Placeholder Slideshow */}
          <section className="mb-20 bg-card/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-ink-black mb-6 text-center">
              Young Adult Book Series
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Book 1 Cover</span>
              </div>
              <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Book 2 Cover</span>
              </div>
              <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Book 3 Cover</span>
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