import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import boardgame from "@/assets/god-of-lies-carousel-boardgame.png.asset.json";
import shopping from "@/assets/god-of-lies-carousel-shopping.png.asset.json";
import office from "@/assets/god-of-lies-carousel-office.png.asset.json";
import kitchen from "@/assets/god-of-lies-carousel-kitchen.png.asset.json";

const scenes = [
  { src: boardgame.url, alt: "Chang-Min and Seok-seol playing a board game" },
  { src: shopping.url, alt: "God of Lies illustration — shopping" },
  { src: office.url, alt: "God of Lies illustration — office" },
  { src: kitchen.url, alt: "God of Lies illustration — kitchen" },
];

export function GodOfLiesCarousel({ children }: { children: ReactNode }) {
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "center", duration: 26 });
  const [selected, setSelected] = useState(0);
  const syncSelection = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    syncSelection();
    api.on("select", syncSelection);
    api.on("reInit", syncSelection);
    return () => { api.off("select", syncSelection); api.off("reInit", syncSelection); };
  }, [api, syncSelection]);
  const goTo = (index: number) => api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <div className="god-of-lies-carousel" role="region" aria-label="God of Lies slideshow" aria-roledescription="carousel">
      <div className="god-of-lies-carousel__viewport" ref={viewportRef}>
        <div className="god-of-lies-carousel__track">
          <div className="god-of-lies-carousel__slide" role="group" aria-label="God of Lies story" aria-hidden={selected !== 0}>
            <div className="comics-hill-blurb">{children}</div>
          </div>
          {scenes.map((scene, index) => (
            <div className="god-of-lies-carousel__slide" key={scene.src} role="group" aria-label={`Illustration ${index + 1} of ${scenes.length}`}>
              <Button variant="link" className="god-of-lies-carousel__image" onClick={() => goTo(index + 1)} aria-label={`View illustration ${index + 1}`}>
                <img src={scene.src} alt={scene.alt} width={1536} height={1024} loading="eager" decoding="async" draggable={false} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="god-of-lies-carousel__thumbnails" aria-label="Choose slideshow image">
        <Button variant="link" className={`god-of-lies-carousel__thumbnail god-of-lies-carousel__story ${selected === 0 ? "is-selected" : ""}`} aria-label="Back to God of Lies story" aria-pressed={selected === 0} onClick={() => goTo(0)} title="God of Lies story"><AlignLeft /></Button>
        {scenes.map((scene, index) => (
          <Button variant="link" key={scene.src} className={`god-of-lies-carousel__thumbnail ${selected === index + 1 ? "is-selected" : ""}`} aria-label={`Show illustration ${index + 1}`} aria-pressed={selected === index + 1} onClick={() => goTo(index + 1)}>
            <img src={scene.src} alt="" width={1536} height={1024} draggable={false} />
          </Button>
        ))}
      </div>
    </div>
  );
}