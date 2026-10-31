import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useHeroHeight } from "@/hooks/useHeroHeight";
import japaneseBackground from "@/assets/japanese-painting-background.webp";
import parableBoysStreet from "@/assets/parable-boys-street.webp";
import sixtiesVarietyShow from "@/assets/sixties-variety-show.webp";
import circlesSingleCover from "@/assets/circles-single-cover.webp";
import manyFaces from "@/assets/god-of-lies-many-faces-banner.png.asset.json";
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

const Chapter = ({
  index, kicker, title, children, to, cta, image, position = "center", className = "",
}: {
  index: string; kicker: string; title: ReactNode; children?: ReactNode; to: string; cta: string; image: string; position?: string; className?: string;
}) => (
  <Link to={to} className={`group relative block w-full overflow-hidden bg-ink-black ${className}`}>
    <img
      src={image}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.04]"
      style={{ objectPosition: position }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/40 to-ink-black/10" />
    <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 md:px-16 md:pb-20">
      <Reveal>
        <div className="mb-4 flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-background/70">
          <span className="font-mono">{index}</span>
          <span className="h-px w-10 bg-background/50" />
          <span>{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-heading text-5xl leading-[0.95] text-background md:text-8xl">{title}</h2>
      </Reveal>
      {children && (
        <Reveal delay={240}>
          <div className="mt-5 max-w-xl font-body text-base text-background/80 md:text-lg">{children}</div>
        </Reveal>
      )}
      <Reveal delay={360}>
        <span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-background">
          {cta}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
        </span>
      </Reveal>
    </div>
  </Link>
);

const HomeCinematic = () => {
  useScrollToTop();
  useHeroHeight();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => img.decode().catch(() => {}).finally(() => setReady(true));
    img.onerror = () => setReady(true);
    img.src = japaneseBackground;
    [parableBoysStreet, manyFaces.url].forEach((src) => {
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
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm uppercase tracking-[0.25em] text-background/80">
            <Link to="/writing" className="hover:text-background">Fiction</Link>
            <Link to="/comics" className="hover:text-background">Comics & Scripts</Link>
            <Link to="/music" className="hover:text-background">Music</Link>
          </div>
        </div>
      </section>

      <Chapter className="home-cinematic-kaiju" index="01" kicker="The Parable Trilogy · Book One" title="KAIJU" to="/writing#kaiju" cta="Enter the story" image={parableBoysStreet} position="52% bottom">
        A metaphysical fantasy. Summer 1979, Osaka — something is coming.
      </Chapter>

      <section className="home-cinematic-pair grid w-full bg-ink-black md:grid-cols-[2fr_1fr]">
        <Link to="/music" className="group relative block min-w-0 overflow-hidden">
          <img src={sixtiesVarietyShow} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale opacity-50 transition-transform duration-[2000ms] group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-black via-ink-black/70 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-6 py-8 sm:flex-row sm:items-center md:gap-5 md:px-6 lg:gap-10 lg:px-10">
            <img src={circlesSingleCover} alt="Circles single cover" loading="lazy" className="h-40 w-40 shrink-0 rounded-sm object-cover shadow-2xl transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105 lg:h-56 lg:w-56" />
            <div className="min-w-0">
              <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">03</span> · New single</p></Reveal>
              <Reveal delay={120}><h2 className="font-heading text-5xl text-background lg:text-7xl">Circles</h2></Reveal>
              <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">Listen now →</span></Reveal>
            </div>
          </div>
        </Link>
        <Link to="/comics" className="group relative block min-w-0 overflow-hidden">
          <img src={manyFaces.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.04]" style={{ objectPosition: "40% center" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">02</span> · Manga Webtoon</p></Reveal>
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
