import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import officeView from "@/assets/office-window-view.webp";
import boysTowerBlocks from "@/assets/boys-tower-blocks.webp";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.webp";

const slides = [
  { image: officeView, name: "Thoughts of the heart", duration: 12600 },
  { image: boysTowerBlocks, name: "Parable", duration: 11400 },
  { image: kyotoTvShop, name: "Summer 1979", duration: 42000 },
];
const letterOrder = [1, 4, 2, 6, 3, 5, 7];

/** Real Embla gesture surface with a separate dissolve layer, not sliding artwork. */
export default function HomeCinematicSlideshow() {
  const navigate = useNavigate();
  const root = useRef<HTMLElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportRef, api] = useEmblaCarousel({ loop: true, duration: 0 });

  useEffect(() => {
    let cancelled = false;
    Promise.all(slides.map(async ({ image }) => {
      const img = new Image();
      img.src = image;
      await img.decode().catch(() => {});
    })).then(() => { if (!cancelled) setDecoded(true); });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => { cancelled = true; observer.disconnect(); media.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!api) return;
    const sync = () => setActive(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => { api.off("select", sync); api.off("reInit", sync); };
  }, [api]);

  useEffect(() => {
    if (!api || !visible || !decoded || reducedMotion) return;
    const timer = window.setTimeout(() => api.scrollNext(), slides[active].duration);
    return () => window.clearTimeout(timer);
  }, [api, active, visible, decoded, reducedMotion]);

  return (
    <section ref={root} aria-label="Parable slideshow" aria-roledescription="carousel" className="home-cinematic-slideshow relative w-full overflow-hidden bg-ink-black">
      <div ref={viewportRef} className="absolute inset-0 cursor-pointer touch-pan-y"
        onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; dragged.current = false; }}
        onPointerMove={(event) => { const start = pointerStart.current; if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) dragged.current = true; }}
        onPointerUp={() => { pointerStart.current = null; }}
        onClick={() => { if (!dragged.current) navigate("/writing#kaiju"); }}>
        <div className="flex h-full" aria-hidden="true">
          {slides.map(({ name }) => <div key={name} className="h-full min-w-0 flex-[0_0_100%]" />)}
        </div>
      </div>
      {slides.map(({ image, name }, index) => (
        <div key={name} aria-hidden={active !== index} data-active={active === index} className={`home-cinematic-slideshow__slide pointer-events-none absolute inset-0 transition-opacity duration-1000 ${active === index ? "opacity-100" : "opacity-0"}`}>
          <img src={image} alt={name} className={`absolute inset-0 h-full w-full object-cover ${decoded && visible && active === index ? index === 0 ? "animate-slow-zoom-hold" : index === 1 ? "animate-slow-zoom-out" : "" : ""}`} />
          <div className="absolute inset-0 bg-ink-black/25" />
          {index === 0 && <div className="absolute inset-0 flex items-center justify-center px-8"><blockquote className="max-w-3xl text-center font-heading text-3xl italic leading-snug text-background md:text-5xl">‘Feelings are the thoughts of the heart.’</blockquote></div>}
          {index === 1 && active === index && decoded && visible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 aria-label="PARABLE" className="home-cinematic-slideshow__parable flex gap-1 text-5xl font-black leading-none text-background sm:gap-2 sm:text-7xl lg:text-9xl">
                {"PARABLE".split("").map((letter, i) => <span key={i} aria-hidden="true" className={`animate-letter-fall-${letterOrder[i]} opacity-0`}>{letter}</span>)}
              </h2>
            </div>
          )}
          {index === 2 && <div className="absolute inset-0 flex items-center px-8 md:px-16"><div className="max-w-md text-background"><p className="font-heading text-3xl md:text-4xl">summer 1979</p><p className="mt-1 font-heading text-2xl md:text-3xl">Osaka Japan</p><h2 className="mt-5 border-t border-background/30 pt-4 font-heading text-4xl">KAIJU</h2><p className="mt-2 font-body text-sm">mysterious beast</p><p className="mt-6 font-mono text-xl font-bold md:text-2xl">SOMETHING IS COMING</p></div></div>}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-5">
        <Button variant="ghost" size="icon" className="pointer-events-auto text-background hover:bg-ink-black/40 hover:text-background" aria-label="Previous slideshow picture" onClick={() => api?.scrollPrev()}><ChevronLeft /></Button>
        <div className="flex gap-3">
          {slides.map(({ name }, index) => <Button key={name} variant="ghost" size="icon" aria-label={`View ${name}`} aria-pressed={active === index} onClick={() => api?.scrollTo(index)} className="pointer-events-auto h-8 w-8 rounded-none hover:bg-ink-black/40"><span className={`h-1.5 w-1.5 rounded-full bg-background ${active === index ? "opacity-100" : "opacity-40"}`} /></Button>)}
        </div>
        <Button variant="ghost" size="icon" className="pointer-events-auto text-background hover:bg-ink-black/40 hover:text-background" aria-label="Next slideshow picture" onClick={() => api?.scrollNext()}><ChevronRight /></Button>
      </div>
    </section>
  );
}