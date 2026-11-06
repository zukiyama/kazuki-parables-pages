import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useHeroHeight } from "@/hooks/useHeroHeight";
import japaneseBackground from "@/assets/japanese-painting-background.webp";
import parableBoysStreet from "@/assets/parable-boys-street.webp";
import toNoOneBedroom from "@/assets/to-no-one-bedroom.webp.asset.json";
import sixtiesVarietyShow from "@/assets/sixties-variety-show.webp";
import circlesSingleCover from "@/assets/circles-single-cover-v4-small.webp";
import uniqueFaces from "@/assets/god-of-lies-faces-wide.webp";
import HomeCinematicSlideshow from "@/components/home/HomeCinematicSlideshow";

/** Text-only reveal: bands stay in normal flow; only copy fades in. */
const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-[opacity,filter] duration-700 ease-out ${shown ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomeCinematic = () => {
  useScrollToTop();
  useHeroHeight();
  type UpperSide = "to-no-one" | "kaiju";
  type PairSide = "circles" | "god-of-lies";
  // Cursor-like pointers drive both dividers, including iPadOS trackpads. Finger taps only glow before navigation.
  const [upperHover, setUpperHover] = useState<UpperSide | null>(null);
  const [upperPress, setUpperPress] = useState<UpperSide | null>(null);
  const [pairHover, setPairHover] = useState<PairSide | null>(null);
  const [pairPress, setPairPress] = useState<PairSide | null>(null);
  const upperHandlers = (side: UpperSide) => ({
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType !== "touch") setUpperHover(side); },
    onPointerMove: (e: React.PointerEvent) => { if (e.pointerType !== "touch" && upperHover !== side) setUpperHover(side); },
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType === "touch") setUpperPress(side); },
    onPointerUp: () => setUpperPress(null),
    onPointerCancel: () => setUpperPress(null),
  });
  const pairHandlers = (side: PairSide) => ({
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType !== "touch") setPairHover(side); },
    onPointerMove: (e: React.PointerEvent) => { if (e.pointerType !== "touch" && pairHover !== side) setPairHover(side); },
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType === "touch") setPairPress(side); },
    onPointerUp: () => setPairPress(null),
    onPointerCancel: () => setPairPress(null),
  });
  const [ready, setReady] = useState(false);
  // Faces sheet: 1595x630, 122px column pitch. Scale so the narrow (1/3) panel shows a whole number of
  // columns, keeping both the narrow and widened (2/3) left edges inside a white gutter; the picture never rescales on hover.
  const pairRef = useRef<HTMLElement>(null);
  const [facesBox, setFacesBox] = useState<React.CSSProperties>({});
  useEffect(() => {
    const el = pairRef.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      const h = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
      if (!cw || !h) return;
      const w = window.matchMedia("(min-width: 768px)").matches ? cw / 3 : cw;
      const k = Math.max(1, Math.floor((w * 630) / (h * 122)));
      const sc = w / (k * 122);
      setFacesBox({ width: 1595 * sc, height: 630 * sc, right: -5 * sc, left: "auto", top: "50%", transform: "translateY(-50%)", maxWidth: "none" });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => img.decode().catch(() => {}).finally(() => setReady(true));
    img.onerror = () => setReady(true);
    img.src = japaneseBackground;
    [parableBoysStreet, toNoOneBedroom.url, uniqueFaces].forEach((src) => {
      const i = new Image();
      i.src = src;
      i.decode?.().catch(() => {});
    });
  }, []);

  return (
    <div className="home-cinematic relative min-h-screen-stable flex flex-col overflow-hidden bg-ink-black">
      <Navigation />

      <section className="relative mt-14 flex h-[calc(var(--hero-h,100dvh)-56px)] items-end overflow-hidden" style={{ backgroundColor: "hsl(20, 30%, 15%)" }}>
        <img
          src={japaneseBackground}
          alt="Japanese painting"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100 animate-slow-zoom-hold" : "opacity-0"}`}
          fetchPriority="high"
          width={2560}
          height={1440}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent" />
        <div className={`relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-background/80">Writer · Musician</p>
          <h1 className="font-heading text-6xl leading-[0.9] text-background md:text-9xl">
            Kazuki<br />Yamakawa
          </h1>
          <div className="home-cinematic-opening-links mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm uppercase tracking-[0.25em] text-background/80">
            <Link to="/writing" className="hover:text-background">Fiction</Link>
            <Link to="/comics" className="hover:text-background">Comics & Scripts</Link>
            <Link to="/music" className="hover:text-background">Music</Link>
          </div>
        </div>
      </section>

      <section
        className="home-cinematic-upper grid w-full bg-ink-black md:grid-cols-[1fr_2fr]"
        data-hover={upperHover ?? undefined}
        data-press={upperPress ?? undefined}
        onPointerLeave={(e) => { if (e.pointerType !== "touch") setUpperHover(null); }}
        aria-label="Featured fiction and comic"
      >
        <Link to="/comics" {...upperHandlers("to-no-one")} className="home-cinematic-upper__panel home-cinematic-upper__to-no-one group relative block min-w-0 overflow-hidden bg-ink-black">
          <div className="home-cinematic-upper__art absolute inset-0">
            <img src={toNoOneBedroom.url} alt="" loading="lazy" decoding="async" width={1774} height={887} className="home-cinematic-upper__img home-cinematic-upper__img--to-no-one absolute inset-y-0 left-0 h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-ink-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-16 pt-6 [text-shadow:0_1px_3px_hsl(var(--ink-black)/0.95),0_2px_14px_hsl(var(--ink-black)/0.8)] md:px-10 md:pb-24">
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] font-medium text-background/95"><span className="font-mono">01</span> · Original comic</p></Reveal>
            <Reveal delay={120}><h2 className="font-heading text-4xl text-background lg:text-5xl">To No One</h2></Reveal>
            <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">Read more →</span></Reveal>
          </div>
        </Link>

        <Link to="/writing#kaiju" {...upperHandlers("kaiju")} className="home-cinematic-upper__panel home-cinematic-upper__kaiju group relative block min-w-0 overflow-hidden bg-ink-black">
          <div className="home-cinematic-upper__art absolute inset-0">
            <img src={parableBoysStreet} alt="" loading="lazy" decoding="async" className="home-cinematic-upper__img home-cinematic-upper__img--kaiju absolute object-cover" style={{ objectPosition: "52% bottom" }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/75 via-ink-black/10 to-transparent" />
          <div className="home-cinematic-upper__kaiju-copy relative z-10 flex h-full flex-col items-end justify-end px-6 pb-14 text-right md:px-16 md:pb-20">
            <Reveal>
              <div className="mb-4 flex items-center justify-end gap-4 text-xs uppercase tracking-[0.35em] text-background/70">
                <span className="font-mono">02</span>
                <span className="h-px w-10 bg-background/50" />
                <span>The Parable Trilogy · Book One</span>
              </div>
            </Reveal>
            <Reveal delay={120}><h2 className="font-heading text-5xl leading-[0.95] text-background md:text-8xl">KAIJU</h2></Reveal>
            <Reveal delay={240}><div className="mt-5 max-w-xl font-body text-base text-background/80 md:text-lg">A metaphysical fantasy. Summer 1979, Osaka — something is coming.</div></Reveal>
            <Reveal delay={360}><span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-background">Enter the story <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span></span></Reveal>
          </div>
        </Link>
      </section>

      <section
        ref={pairRef}
        className="home-cinematic-pair grid w-full bg-ink-black md:grid-cols-[2fr_1fr]"
        data-hover={pairHover ?? undefined}
        data-press={pairPress ?? undefined}
        onPointerLeave={(e) => { if (e.pointerType !== "touch") setPairHover(null); }}
      >
        <Link to="/music" {...pairHandlers("circles")} className="home-cinematic-pair__panel group relative block min-w-0 overflow-hidden">
          <img src={sixtiesVarietyShow} alt="" loading="lazy" className="home-cinematic-pair__img home-cinematic-pair__img--circles absolute inset-0 h-full w-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-black/40 via-ink-black/10 to-transparent" />
          <div className="home-cinematic-pair__circles relative z-10 flex h-full flex-col justify-center gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-start [text-shadow:0_2px_12px_hsl(var(--ink-black)/0.6)] md:gap-5 md:px-12 lg:gap-10 lg:px-24">
            <img src={circlesSingleCover} alt="Circles single cover" loading="lazy" className="h-40 w-40 shrink-0 rounded-sm object-cover shadow-2xl lg:h-56 lg:w-56" />
            <div className="min-w-0">
              <Reveal><p className="mb-3 whitespace-nowrap text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">03</span> · New single</p></Reveal>
              <Reveal delay={120}><h2 className="font-heading text-5xl text-background lg:text-7xl">Circles</h2></Reveal>
              <Reveal delay={240}><span className="mt-6 inline-block whitespace-nowrap text-sm uppercase tracking-[0.25em] text-background">Listen now →</span></Reveal>
            </div>
          </div>
        </Link>
        <Link to="/comics" {...pairHandlers("god-of-lies")} className="home-cinematic-pair__panel group relative block min-w-0 overflow-hidden">
          <img src={uniqueFaces} alt="" loading="lazy" style={facesBox} className="home-cinematic-pair__img home-cinematic-pair__img--faces absolute" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-ink-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-16 pt-6 [text-shadow:0_1px_3px_hsl(var(--ink-black)/0.95),0_2px_14px_hsl(var(--ink-black)/0.8)] md:px-10 md:pb-24">
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] font-medium text-background/95"><span className="font-mono">04</span> · Manga Webtoon</p></Reveal>
            <Reveal delay={120}><h2 className="font-heading text-4xl text-background lg:text-5xl">God of Lies</h2></Reveal>
            <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">Read more →</span></Reveal>
          </div>
        </Link>
      </section>

      <HomeCinematicSlideshow />

      <Footer variant="dark" />
    </div>
  );
};

export default HomeCinematic;
