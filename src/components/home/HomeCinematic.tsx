import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useHeroHeight } from "@/hooks/useHeroHeight";
import japaneseBackground from "@/assets/japanese-painting-background.webp";
import parableBoysStreet from "@/assets/parable-boys-street.webp";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.webp";
import sixtiesVarietyShow from "@/assets/sixties-variety-show.webp";
import circlesSingleCover from "@/assets/circles-single-cover.webp";
import manyFaces from "@/assets/god-of-lies-many-faces-banner.png.asset.json";
import burden from "@/assets/the-burden-screenplay.png.asset.json";

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
  index, kicker, title, children, to, cta, image, position = "center",
}: {
  index: string; kicker: string; title: ReactNode; children?: ReactNode; to: string; cta: string; image: string; position?: string;
}) => (
  <Link to={to} className="group relative block h-[85svh] min-h-[520px] w-full overflow-hidden bg-ink-black">
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
    <div className="relative min-h-screen-stable flex flex-col overflow-hidden bg-ink-black">
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
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-background/80">Writer · Musician · Storyteller</p>
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

      <Chapter index="01" kicker="The Parable Trilogy · Book One" title="KAIJU" to="/writing#kaiju" cta="Enter the story" image={parableBoysStreet} position="52% bottom">
        A metaphysical fantasy. Summer 1979, Osaka — something is coming.
      </Chapter>

      <section className="grid w-full bg-ink-black md:grid-cols-2">
        <Link to="/comics" className="group relative block h-[70svh] min-h-[420px] overflow-hidden">
          <img src={manyFaces.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.04]" style={{ objectPosition: "40% center" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">02</span> · Manga Webtoon</p></Reveal>
            <Reveal delay={120}><h2 className="font-heading text-5xl text-background md:text-6xl">God of Lies</h2></Reveal>
            <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">Read more →</span></Reveal>
          </div>
        </Link>
        <Link to="/comics" className="group relative block h-[70svh] min-h-[420px] overflow-hidden">
          <img src={burden.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.04]" style={{ objectPosition: "35% center" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">03</span> · Full-length screenplay</p></Reveal>
            <Reveal delay={120}><h2 className="font-heading text-5xl text-background md:text-6xl">The Burden</h2></Reveal>
            <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">In development →</span></Reveal>
          </div>
        </Link>
      </section>

      <Link to="/music" className="group relative block w-full overflow-hidden bg-ink-black">
        <img src={sixtiesVarietyShow} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale opacity-50 transition-transform duration-[2000ms] group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-black via-ink-black/70 to-transparent" />
        <div className="relative z-10 flex flex-col gap-10 px-6 py-20 md:flex-row md:items-center md:px-16 md:py-28">
          <img src={circlesSingleCover} alt="Circles single cover" loading="lazy" className="h-56 w-56 rounded-sm object-cover shadow-2xl transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105 md:h-72 md:w-72" />
          <div>
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.35em] text-background/70"><span className="font-mono">04</span> · New single</p></Reveal>
            <Reveal delay={120}><h2 className="font-heading text-6xl text-background md:text-8xl">Circles</h2></Reveal>
            <Reveal delay={240}><span className="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-background">Listen now →</span></Reveal>
          </div>
        </div>
      </Link>

      <section className="relative w-full overflow-hidden bg-ink-black">
        <img src={kyotoTvShop} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative z-10 px-6 py-28 text-center md:py-40">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl font-heading text-3xl italic leading-snug text-background md:text-5xl">
              ‘Feelings are the thoughts of the heart.’
            </blockquote>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeCinematic;
