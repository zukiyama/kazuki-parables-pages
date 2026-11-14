import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import arcade from "@/assets/kazukilabs-arcade-crop.webp";

type Game = { title: string; tagline: string; url: string | null; art: "pet" | "soon" };

const games: Game[] = [
  { title: "AR PET", tagline: "KAZUKI & KIZUKI", url: `${import.meta.env.BASE_URL}labs/ar-pet-6.html`, art: "pet" },
  { title: "COMING SOON", tagline: "NEW GAME LOADING", url: null, art: "soon" },
];

/** Title with a moon circling "LABS", a river line and a small mountain. */
const LabsLogo = () => (
  <svg viewBox="0 0 640 150" role="img" aria-label="KAZUKI LABS" className="mx-auto h-auto w-full max-w-md">
    <text x="20" y="98" fontFamily="'Playfair Display', serif" fontSize="76" letterSpacing="6" fill="currentColor">KAZUKI</text>
    <text x="378" y="98" fontFamily="'Playfair Display', serif" fontSize="76" fontStyle="italic" letterSpacing="4" fill="currentColor">LABS</text>
    <circle cx="482" cy="72" r="62" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
    <path d="M430 70 l22 -26 l14 16 l10 -10 l22 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.55" />
    <path d="M14 124 C 120 108, 200 138, 320 122 S 520 106, 626 124" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Old vector-arcade style title screen, drawn in glowing lines. */
const TitleScreen = ({ game, index }: { game: Game; index: number }) => (
  <svg viewBox="0 0 320 210" className="h-full w-full" aria-hidden="true" style={{ fontFamily: "'Courier New', monospace" }}>
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect width="320" height="210" fill="#05060d" />
    <g filter="url(#glow)" fill="none" strokeWidth="1.4">
      {/* perspective grid floor */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={160} y1={120} x2={-80 + i * 60} y2={210} stroke="#ff4fa3" opacity="0.55" />
      ))}
      {[124, 132, 145, 165, 195].map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={320} y2={y} stroke="#ff4fa3" opacity="0.55" />
      ))}
      {game.art === "pet" ? (
        <g stroke="#5ff4ff">
          {/* moon */}
          <circle cx="250" cy="52" r="22" stroke="#ffe066" />
          {/* two little pets */}
          <path d="M98 118 q0 -26 22 -26 q22 0 22 26 z" />
          <path d="M104 96 l-4 -12 l10 7 M136 96 l4 -12 l-10 7" />
          <circle cx="113" cy="106" r="2" /><circle cx="127" cy="106" r="2" />
          <path d="M178 118 q0 -22 19 -22 q19 0 19 22 z" stroke="#ff9e5f" />
          <path d="M184 100 l-3 -10 l8 6 M210 100 l3 -10 l-8 6" stroke="#ff9e5f" />
          <circle cx="192" cy="108" r="2" stroke="#ff9e5f" /><circle cx="203" cy="108" r="2" stroke="#ff9e5f" />
        </g>
      ) : (
        <g stroke="#ffe066">
          <rect x="130" y="70" width="60" height="40" />
          <path d="M146 90 h28 M160 76 v28" />
        </g>
      )}
    </g>
    <g filter="url(#glow)" textAnchor="middle">
      <text x="160" y="40" fontSize="30" fontWeight="bold" fill="none" stroke="#5ff4ff" strokeWidth="1.2" letterSpacing="3">{game.title}</text>
      <text x="160" y="58" fontSize="11" fill="#ffe066" letterSpacing="2">{game.tagline}</text>
      <text x="160" y="200" fontSize="12" fill="#ffffff" letterSpacing="2" className="animate-pulse">
        {game.url ? "PRESS START" : "STAY TUNED"}
      </text>
      <text x="16" y="16" fontSize="9" fill="#ff4fa3" textAnchor="start">GAME {index + 1}/{games.length}</text>
    </g>
  </svg>
);

/** Short synthesized arcade-button click (no audio file needed). */
const useClick = () => {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback(() => {
    try {
      ctx.current ??= new AudioContext();
      const c = ctx.current;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(1800, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.04);
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + 0.07);
    } catch {
      /* sound is optional */
    }
  }, []);
};

const ArcadeButton = ({ label, onPress, color, children }: { label: string; onPress: () => void; color: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-[0.3em]">
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className="flex aspect-square w-[2.6em] items-center justify-center rounded-full border-2 border-foreground/20 transition-[transform,box-shadow] duration-75 active:translate-y-[0.25em] active:shadow-none"
      style={{ background: color, boxShadow: `0 0.28em 0 rgba(0,0,0,0.35), inset 0 -0.2em 0 rgba(0,0,0,0.15)` }}
    >
      {children}
    </button>
    <span className="text-[0.55em] font-bold tracking-widest text-ink-black/70">{label.toUpperCase()}</span>
  </div>
);

const KazukiLabs = () => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const click = useClick();
  const game = games[index];

  const step = (d: number) => {
    click();
    setIndex((i) => (i + d + games.length) % games.length);
  };
  const start = () => {
    click();
    if (game.url) setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="mx-auto px-2 pb-12 pt-24 sm:px-6">
        <header className="mb-4 text-center">
          <h1 className="sr-only">KAZUKI LABS</h1>
          <LabsLogo />
          <p className="mx-auto mt-2 max-w-2xl font-heading text-base italic text-muted-foreground sm:text-xl">
            Take control of KAZUKI and KIZUKI in their stunning new adventure…
          </p>
        </header>

        {/* Cabinet scales with the screen height on desktop and the full width on phones. */}
        <div className="relative mx-auto w-full max-w-[min(100%,calc((100svh-5rem)*0.9))]" style={{ fontSize: "clamp(9px, 1.6vw, 20px)" }}>
          <img src={arcade} alt="A bright Japanese arcade cabinet" width={1076} height={1040} className="block h-auto w-full rounded-md" />
          <div
            className="absolute overflow-hidden rounded-[4px] shadow-[inset_0_0_24px_hsl(var(--ink-black))]"
            style={{ left: "18.4%", top: "24.5%", width: "64.1%", height: "43.3%", background: "#05060d" }}
            aria-live="polite"
          >
            <TitleScreen key={index} game={game} index={index} />
            <span className="sr-only">{`Game ${index + 1}: ${game.title}`}</span>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_1px,transparent_1px_3px)]" />
          </div>

          {/* Playable control panel between the red and blue buttons. */}
          <div className="absolute flex items-start justify-center gap-[0.6em]" style={{ left: "43%", width: "20%", top: "79.5%" }}>
            <ArcadeButton label="Prev" onPress={() => step(-1)} color="#7cc4f0"><ChevronLeft className="h-[1.4em] w-[1.4em] text-ink-black" /></ArcadeButton>
            <ArcadeButton label="Start" onPress={start} color="#ffd23f"><span className="text-[0.6em] font-black text-ink-black">GO</span></ArcadeButton>
            <ArcadeButton label="Next" onPress={() => step(1)} color="#7cc4f0"><ChevronRight className="h-[1.4em] w-[1.4em] text-ink-black" /></ArcadeButton>
          </div>
        </div>

        <p className="mt-6 text-center font-heading text-lg">Play the full game soon on Steam.</p>
      </main>
      <Footer />

      {playing && game.url && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-ink-black">
          <div className="flex items-center justify-between gap-2 p-2">
            <a href={game.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-background underline">
              <ExternalLink className="h-4 w-4" /> Open in new tab
            </a>
            <button type="button" onClick={() => setPlaying(false)} aria-label="Close game" className="rounded-full p-2 text-background hover:bg-background/10">
              <X />
            </button>
          </div>
          <iframe src={game.url} title={game.title} allow="camera; xr-spatial-tracking; fullscreen" allowFullScreen className="w-full flex-1 border-0 bg-background" />
        </div>
      )}
    </div>
  );
};

export default KazukiLabs;
