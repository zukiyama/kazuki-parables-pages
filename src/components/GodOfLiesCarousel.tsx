import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import plantShop from "@/assets/god-of-lies-carousel-plant-shop.asset.json";
import cottonCandy from "@/assets/god-of-lies-carousel-cotton-candy.asset.json";
import pear from "@/assets/god-of-lies-carousel-pear.asset.json";
import milk from "@/assets/god-of-lies-carousel-milk.asset.json";
import runner from "@/assets/god-of-lies-chibi-runner.png";
import bus from "@/assets/god-of-lies-chibi-bus.png";

const scenes = [
  { src: cottonCandy.url, alt: "Chang-Min and Seok-seol shopping with cotton candy" },
  { src: pear.url, alt: "Seok-seol reclining on a sliced pear" },
  { src: plantShop.url, alt: "Two men among flowers and plants" },
  { src: milk.url, alt: "Chang-Min holding milk beside Seok-seol in the kitchen" },
];

export function GodOfLiesCarousel({ children }: { children: ReactNode }) {
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "center", duration: 26 });
  const [selected, setSelected] = useState(0);
  const syncSelection = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const syncLighting = () => {
      const viewport = api.rootNode().getBoundingClientRect();
      const center = viewport.left + viewport.width / 2;
      api.slideNodes().forEach((slide) => {
        const picture = slide.querySelector<HTMLElement>(".god-of-lies-carousel__image");
        if (!picture) return;
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        const illumination = Math.max(0, 1 - distance / (rect.width * 0.6));
        picture.style.setProperty("--picture-brightness", String(0.74 + illumination * 0.26));
        picture.style.setProperty("--picture-scale", String(0.8 + illumination * 0.2));
      });
    };
    syncSelection();
    syncLighting();
    api.on("select", syncSelection);
    api.on("reInit", syncSelection);
    api.on("scroll", syncLighting);
    api.on("reInit", syncLighting);
    api.on("settle", syncLighting);
    return () => {
      api.off("select", syncSelection);
      api.off("reInit", syncSelection);
      api.off("scroll", syncLighting);
      api.off("reInit", syncLighting);
      api.off("settle", syncLighting);
    };
  }, [api, syncSelection]);
  const goTo = (index: number) => api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <div className="god-of-lies-carousel" role="region" aria-label="God of Lies slideshow" aria-roledescription="carousel">
      <div className="god-of-lies-carousel__viewport" ref={viewportRef}>
        <div className="god-of-lies-carousel__track">
          <div
            className="god-of-lies-carousel__slide god-of-lies-carousel__text"
            role="group"
            aria-label="God of Lies story"
            aria-hidden={selected !== 0}
            onClick={() => goTo(0)}
          >
            <div className="comics-hill-blurb">{children}</div>
          </div>
          {scenes.map((scene, index) => (
            <div className="god-of-lies-carousel__slide is-image" key={scene.src} role="group" aria-label={`Illustration ${index + 1} of ${scenes.length}`}>
              <div className={`god-of-lies-carousel__picture-reveal ${index === scenes.length - 1 ? "from-left" : "from-right"}`}>
              <Button variant="link" className="god-of-lies-carousel__image" onClick={() => goTo(index + 1)} aria-label={`View illustration ${index + 1}`}>
                <img src={scene.src} alt={scene.alt} width={1536} height={1024} loading="eager" decoding="async" draggable={false} />
              </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="god-of-lies-carousel__footer">
        <img src={runner} alt="A black-haired chibi man running towards the bus" className="god-of-lies-carousel__runner" width={546} height={472} draggable={false} />
      <div className="god-of-lies-carousel__thumbnails" aria-label="Choose slideshow image">
        <Button variant="link" className={`god-of-lies-carousel__thumbnail god-of-lies-carousel__story ${selected === 0 ? "is-selected" : ""}`} aria-label="Back to God of Lies story" aria-pressed={selected === 0} onClick={() => goTo(0)} title="God of Lies story"><AlignLeft /></Button>
        {scenes.map((scene, index) => (
          <Button variant="link" key={scene.src} className={`god-of-lies-carousel__thumbnail ${selected === index + 1 ? "is-selected" : ""}`} aria-label={`Show illustration ${index + 1}`} aria-pressed={selected === index + 1} onClick={() => goTo(index + 1)}>
            <img src={scene.src} alt="" width={1536} height={1024} draggable={false} />
          </Button>
        ))}
      </div>
        <img src={bus} alt="A green bus with a queue of chibi passengers" className="god-of-lies-carousel__bus" width={1132} height={458} draggable={false} />
      </div>
    </div>
  );
}