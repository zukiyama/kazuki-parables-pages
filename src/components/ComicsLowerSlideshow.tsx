import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GodOfLiesGallery } from "@/components/GodOfLiesGallery";
import { COMICS_LOWER_SCREENS, nextComicsScreen, paperArrowOverlap } from "@/lib/comics-slideshow";

type Comic = { cover: string; title: string; description: ReactNode; teaser: string; format: string };

export function ComicsLowerSlideshow({ children, comics, panorama, pendragon, pendragonPortrait, open }: {
  children: ReactNode; comics: Comic[]; panorama: string; pendragon: string; pendragonPortrait: string; open: boolean;
}) {
  const [viewport, api] = useEmblaCarousel({ loop: true, startIndex: 1, duration: 20 });
  const [screen, setScreen] = useState(1);
  const [traveling, setTraveling] = useState(false);
  const travelingRef = useRef(false);
  const [selected, setSelected] = useState<Comic | null>(null);
  const [closing, setClosing] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLElement>(null);
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const enlargedRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const closeRef = useRef(false);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const measure = () => shellRef.current?.style.setProperty("--chapter-footer-height", `${footer.offsetHeight}px`);
    measure(); const observer = new ResizeObserver(measure); observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!api) return;
    const sync = () => { setScreen(api.selectedScrollSnap()); travelingRef.current = false; setTraveling(false); };
    // Keep footer/layout and React updates out of the moving frames.
    sync(); api.on("settle", sync); api.on("reInit", sync);
    return () => { api.off("settle", sync); api.off("reInit", sync); };
  }, [api]);
  // Embla's settle event fires ~700ms after the slide has visually landed, so
  // waiting for it left the arrows hidden over an already-stationary slide.
  // Bring them back the moment the track is within a few pixels of its target.
  useEffect(() => {
    if (!api) return;
    const reveal = () => {
      if (!travelingRef.current) return;
      const target = api.scrollSnapList()[api.selectedScrollSnap()];
      if (target === undefined) return;
      const raw = Math.abs(api.scrollProgress() - target);
      if (Math.min(raw, 1 - raw) < 0.004) { travelingRef.current = false; setTraveling(false); }
    };
    api.on("scroll", reveal);
    return () => { api.off("scroll", reveal); };
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const paintArrows = () => {
      const paper = paperRef.current?.getBoundingClientRect();
      if (!paper) return;
      // Read all geometry before writing the paint-only clipping properties.
      const arrows = [leftArrowRef.current, rightArrowRef.current].map(button => ({
        button, bounds: button?.querySelector("svg")?.getBoundingClientRect(),
      }));
      arrows.forEach(({ button, bounds }) => {
        if (!button || !bounds) return;
        const [start, end] = paperArrowOverlap(bounds.left, bounds.width, paper.left, paper.right);
        button.style.setProperty("--paper-arrow-start", `${start}%`);
        button.style.setProperty("--paper-arrow-end", `${100 - end}%`);
      });
    };
    // Embla emits scroll before applying its frame's transform. Paint after
    // that render, but before the browser paints, to avoid a one-frame lag.
    let mounted = true;
    const afterRender = () => queueMicrotask(() => { if (mounted) paintArrows(); });
    paintArrows();
    api.on("scroll", afterRender); api.on("reInit", afterRender); api.on("settle", afterRender);
    const observer = new ResizeObserver(paintArrows);
    if (shellRef.current) observer.observe(shellRef.current);
    return () => {
      mounted = false;
      api.off("scroll", afterRender); api.off("reInit", afterRender); api.off("settle", afterRender);
      observer.disconnect();
    };
  }, [api]);
  useEffect(() => { if (!open) api?.scrollTo(1, true); }, [api, open]);
  useEffect(() => {
    [panorama, pendragon, pendragonPortrait, ...comics.map(c => c.cover)].forEach(src => {
      const image = new Image(); image.src = src; void image.decode().catch(() => {});
    });
  }, [panorama, pendragon, pendragonPortrait]);
  const sourceTransform = () => {
    const source = sourceRef.current?.getBoundingClientRect();
    const target = enlargedRef.current?.getBoundingClientRect();
    if (!source || !target || !target.width || !target.height) return "none";
    return `translate(${source.left + source.width / 2 - target.left - target.width / 2}px, ${source.top + source.height / 2 - target.top - target.height / 2}px) scale(${source.width / target.width}, ${source.height / target.height})`;
  };
  const mountCover = useCallback((image: HTMLImageElement | null) => {
    enlargedRef.current = image;
    if (!image || reduced()) return;
    animationRef.current = image.animate([{ transform: sourceTransform() }, { transform: "none" }], {
      duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, []);
  const close = async () => {
    if (closeRef.current) return;
    closeRef.current = true; setClosing(true); animationRef.current?.cancel();
    if (!reduced()) {
      const animation = enlargedRef.current?.animate([{ transform: "none" }, { transform: sourceTransform() }], {
        duration: 320, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards",
      });
      try { await animation?.finished; } catch { /* Unmounted. */ }
    }
    setSelected(null); setClosing(false); closeRef.current = false;
  };
  const navigate = (direction: -1 | 1) => {
    if (!api) return;
    travelingRef.current = true; setTraveling(true);
    const next = nextComicsScreen(api.selectedScrollSnap(), direction);
    if (reduced()) api.scrollTo(next, true);
    else if (direction === 1) api.scrollNext();
    else api.scrollPrev();
  };
  return (
    <div ref={shellRef} className={`comics-lower-slideshow ${traveling ? "is-traveling" : ""}`} role="region" aria-label="Comics and scripts slideshow" aria-roledescription="carousel">
      <div ref={viewport} className="comics-lower-slideshow__viewport">
        <div className="comics-lower-slideshow__track">
          <section className="comics-lower-slideshow__slide comics-pendragon-slide" aria-label={COMICS_LOWER_SCREENS[0]} aria-hidden={screen !== 0} ref={element => { if (screen !== 0) element?.setAttribute("inert", ""); else element?.removeAttribute("inert"); }}>
            <picture><source media="(orientation: portrait)" srcSet={pendragonPortrait} /><img className="comics-pendragon-slide__image" src={pendragon} alt="Surname Pendragon" /></picture>
            <div className="comics-pendragon-slide__copy">
              <p className="comics-pendragon-slide__kicker">Screenplay Adaptation</p>
              <h2>Surname Pendragon</h2>
              <p>A modern retelling of Arthurian legend. Invoking a very British mysticism, this high concept drama fuses 60s retro-future espionage with contemporary fantasy.</p>
              <p>Starting his new job at <em>Camelot Enterprises</em>, Arthur Drake has never cared much for career—or adventure—but that’s about to change. After misplacing a set of sensitive documents and a chance encounter with a deranged homeless man, he is drawn into a bizarre netherworld and a legacy he’d rather avoid.</p>
              <p className="comics-pendragon-slide__kicker">Feature Film • Drama • In Development</p>
            </div>
          </section>
          <section className="comics-lower-slideshow__slide comics-story-slide" aria-label={COMICS_LOWER_SCREENS[1]} aria-hidden={screen !== 1} ref={element => { if (screen !== 1) element?.setAttribute("inert", ""); else element?.removeAttribute("inert"); }}>
            <img className="comics-story-slide__background" src={panorama} alt="" aria-hidden="true" />
            <GodOfLiesGallery>{children}</GodOfLiesGallery>
          </section>
          <section className="comics-lower-slideshow__slide comics-shelf-slide" aria-label={COMICS_LOWER_SCREENS[2]} aria-hidden={screen !== 2} ref={element => { paperRef.current = element; if (screen !== 2) element?.setAttribute("inert", ""); else element?.removeAttribute("inert"); }}>
            <h2>Stories waiting to be told…</h2>
            <div className="comics-shelf-slide__grid">
              {comics.map(comic => <Button variant="link" className="comics-shelf-slide__cover" key={comic.title} aria-label={`Explore ${comic.title}`} onClick={event => {
                sourceRef.current = event.currentTarget.querySelector("img"); setSelected(comic);
              }}><img src={comic.cover} alt={`${comic.title} comic cover`} width={640} height={960} draggable={false} /></Button>)}
            </div>
          </section>
        </div>
      </div>
      <Button ref={leftArrowRef} variant="link" className="comics-lower-slideshow__arrow comics-lower-slideshow__arrow--left" aria-label="Previous comics screen" onClick={() => navigate(-1)}><svg viewBox="0 0 36 48" aria-hidden="true"><path d="M30 5 6 24 30 43Z" fill="currentColor" /></svg><svg className="comics-lower-slideshow__arrow-paper" viewBox="0 0 36 48" aria-hidden="true"><path d="M30 5 6 24 30 43Z" fill="currentColor" /></svg></Button>
      <Button ref={rightArrowRef} variant="link" className="comics-lower-slideshow__arrow comics-lower-slideshow__arrow--right" aria-label="Next comics screen" onClick={() => navigate(1)}><svg viewBox="0 0 36 48" aria-hidden="true"><path d="m6 5 24 19L6 43Z" fill="currentColor" /></svg><svg className="comics-lower-slideshow__arrow-paper" viewBox="0 0 36 48" aria-hidden="true"><path d="m6 5 24 19L6 43Z" fill="currentColor" /></svg></Button>
      <div ref={footerRef} className="comics-lower-slideshow__footer"><Footer variant="dark" /></div>
      <Dialog.Root open={selected !== null} onOpenChange={value => { if (!value) void close(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="comics-reader__overlay" />
          <Dialog.Content className={`comics-reader ${closing ? "is-closing" : ""}`} aria-describedby="comic-reader-description" onEscapeKeyDown={event => { event.preventDefault(); void close(); }} onPointerDownOutside={event => { event.preventDefault(); void close(); }} onCloseAutoFocus={event => { event.preventDefault(); sourceRef.current?.closest<HTMLElement>("button")?.focus(); }}>
            <Button variant="link" className="comics-reader__image" aria-label="Close comic details" onClick={() => void close()}>{selected && <img ref={mountCover} src={selected.cover} alt={`${selected.title} comic cover`} width={640} height={960} />}</Button>
            <div className="comics-reader__copy"><p className="comics-reader__format">{selected?.format}</p><Dialog.Title>{selected?.title}</Dialog.Title><div id="comic-reader-description">{selected?.description}</div><p className="comics-reader__teaser">{selected?.teaser}</p></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}