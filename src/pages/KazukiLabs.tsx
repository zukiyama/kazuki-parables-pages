import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getCabinetZoom, isArcadeQuitMessage, shouldRequestLandscape } from "@/lib/kazukilabs-launch";
import arcade from "@/assets/kazukilabs-arcade-wide.webp";
import labsLogo from "@/assets/kazukilabs-logo-coral.webp";

type Game = {
  title: string;
  tagline: string;
  url: string | null;
  art: "pet" | "lift";
  orientation: "portrait" | "landscape";
};

const games: Game[] = [
  {
    title: "KAZUKI & KIZUKI",
    tagline: "",
    url: `${import.meta.env.BASE_URL}labs/kazuki-and-kizuki-embed-4.html`,
    art: "pet",
    orientation: "portrait",
  },
  {
    title: "LIFT ME UP",
    tagline: "SIDE-SCROLLING ADVENTURE",
    url: null,
    art: "lift",
    orientation: "landscape",
  },
];

/** Crisp, glowing arcade title cards. The pet pair echoes the site's hat-and-cat emblem. */
const TitleScreen = ({ game, index }: { game: Game; index: number }) => (
  <svg
    viewBox="0 0 336 200"
    className="h-full w-full"
    aria-hidden="true"
    style={{ fontFamily: "'Courier New', monospace" }}
  >
    <defs>
      <filter id="arcade-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.25" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect width="336" height="200" fill="#05060d" />
    <g filter="url(#arcade-glow)" fill="none" strokeWidth="1.25">
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`vertical-${i}`} x1={168} y1={123} x2={-80 + i * 62} y2={200} stroke="#ff4fa3" opacity="0.55" />
      ))}
      {[126, 135, 148, 168, 194].map((y) => (
        <line key={`horizontal-${y}`} x1={0} y1={y} x2={336} y2={y} stroke="#ff4fa3" opacity="0.55" />
      ))}
    </g>

    {game.art === "pet" ? (
      <g filter="url(#arcade-glow)" shapeRendering="crispEdges">
        <circle cx="282" cy="74" r="20" fill="none" stroke="#ffe066" strokeWidth="2" />
        {/* Kazuki: a pixel traveller in a hat and backpack, facing Kizuki. */}
        <g fill="#5ff4ff">
          <rect x="91" y="64" width="23" height="5" />
          <rect x="87" y="69" width="30" height="16" />
          <rect x="82" y="85" width="43" height="5" />
          <rect x="94" y="90" width="23" height="19" />
          <rect x="117" y="95" width="7" height="6" />
          <rect x="111" y="94" width="4" height="4" fill="#05060d" />
          <rect x="85" y="109" width="34" height="31" />
          <rect x="76" y="113" width="10" height="27" />
          <rect x="70" y="116" width="8" height="20" opacity="0.75" />
          <rect x="118" y="112" width="7" height="28" />
          <rect x="118" y="137" width="11" height="7" />
          <rect x="87" y="139" width="11" height="27" />
          <rect x="107" y="139" width="11" height="27" />
          <rect x="80" y="164" width="18" height="6" />
          <rect x="107" y="164" width="19" height="6" />
        </g>
        {/* Kizuki: a small cat turned left towards Kazuki. */}
        <g fill="#ff9e5f">
          <rect x="210" y="120" width="37" height="24" />
          <rect x="199" y="111" width="24" height="27" />
          <polygon points="199,111 199,99 209,111" />
          <polygon points="212,111 222,99 222,116" />
          <rect x="195" y="120" width="6" height="6" />
          <rect x="202" y="117" width="4" height="4" fill="#05060d" />
          <rect x="212" y="144" width="8" height="22" />
          <rect x="237" y="144" width="8" height="22" />
          <rect x="246" y="111" width="7" height="28" />
          <rect x="251" y="103" width="14" height="9" />
          <rect x="259" y="94" width="7" height="12" />
        </g>
      </g>
    ) : (
      <g filter="url(#arcade-glow)" fill="none" stroke="#ffe066" strokeWidth="2" shapeRendering="crispEdges">
        <path d="M108 153 H228 M124 153 V160 H212 V153" />
        <rect x="156" y="124" width="24" height="29" />
        <rect x="161" y="111" width="14" height="13" />
        <path d="M168 97 V68 M156 80 L168 68 L180 80" stroke="#5ff4ff" />
        <path d="M131 111 V89 M121 99 L131 89 L141 99" stroke="#ff4fa3" />
        <path d="M205 111 V89 M195 99 L205 89 L215 99" stroke="#ff4fa3" />
        <path d="M88 142 H113 M223 130 H250" stroke="#5ff4ff" />
      </g>
    )}

    <g filter="url(#arcade-glow)" textAnchor="middle">
      <text
        x="168"
        y="37"
        fontSize={game.art === "pet" ? "23" : "29"}
        fontWeight="bold"
        fill="none"
        stroke="#5ff4ff"
        strokeWidth="1.1"
        letterSpacing={game.art === "pet" ? "1" : "3"}
      >
        {game.title}
      </text>
      {game.tagline && <text x="168" y="57" fontSize="10" fill="#ffe066" letterSpacing="1.4">{game.tagline}</text>}
      <text x="168" y="190" fontSize="12" fill="#ffffff" letterSpacing="2" className="animate-pulse">
        {game.url ? "PRESS START" : "COMING SOON"}
      </text>
      <text x="15" y="16" fontSize="9" fill="#ff4fa3" textAnchor="start">GAME {index + 1}/{games.length}</text>
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
      /* Sound is optional. */
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
      style={{ background: color, boxShadow: "0 0.28em 0 rgba(0,0,0,0.35), inset 0 -0.2em 0 rgba(0,0,0,0.15)" }}
    >
      {children}
    </button>
    <span className="text-[0.55em] font-bold tracking-widest text-ink-black/70">{label.toUpperCase()}</span>
  </div>
);

const KazukiLabs = () => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showRotateHint, setShowRotateHint] = useState(false);
  const fullscreenForGame = useRef(false);
  const [cabinetMode, setCabinetMode] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const gameFrameRef = useRef<HTMLIFrameElement>(null);
  const fullscreenScrollRef = useRef<{ x: number; y: number } | null>(null);

  // Zoom the cabinet so its screen nearly fills the window, leaving the machine visible at the edges.
  const computeZoom = useCallback(() => {
    const cab = cabinetRef.current, scr = screenRef.current;
    if (!cab || !scr) return null;
    // The section stays in document flow; the cabinet and screen rects are transformed
    // (and the iframe itself enters the fullscreen top layer), so never measure those.
    const stage = cab.parentElement;
    if (!stage) return null;
    const origin = stage.getBoundingClientRect();
    return getCabinetZoom({
      left: origin.left + cab.offsetLeft,
      top: origin.top + cab.offsetTop,
      screenLeft: scr.offsetLeft,
      screenTop: scr.offsetTop,
      screenWidth: scr.offsetWidth,
      screenHeight: scr.offsetHeight,
    }, { width: window.innerWidth, height: window.innerHeight });
  }, []);
  const click = useClick();
  const game = games[index];

  const step = (direction: number) => {
    click();
    setIndex((current) => (current + direction + games.length) % games.length);
  };

  const closeGame = useCallback(() => {
    setPlaying(false);
    setZoom(null);
    setShowRotateHint(false);
    if (fullscreenForGame.current) {
      fullscreenForGame.current = false;
      screen.orientation?.unlock();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
  }, []);

  const start = async () => {
    click();
    if (!game.url) return;
    const inCabinet = window.innerWidth >= 768;
    setCabinetMode(inCabinet);
    if (inCabinet) setZoom(computeZoom());
    setPlaying(true);
    setShowRotateHint(false);

    const isPhone = window.innerWidth < 768 && navigator.maxTouchPoints > 0;
    if (!shouldRequestLandscape(game, isPhone)) return;

    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (value: "landscape") => Promise<void> };
      if (!document.documentElement.requestFullscreen || !orientation.lock) throw new Error("Orientation lock unavailable");
      await document.documentElement.requestFullscreen();
      fullscreenForGame.current = true;
      await orientation.lock("landscape");
    } catch {
      // iPhone Safari and some Android versions require a manual turn instead.
      setShowRotateHint(true);
    }
  };

  useEffect(() => {
    if (!playing) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let restoreFrame = 0;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement && !fullscreenScrollRef.current) closeGame();
    };
    const onMessage = (event: MessageEvent) => {
      if (isArcadeQuitMessage(event, window.location.origin, gameFrameRef.current?.contentWindow)) closeGame();
    };
    const onFullscreen = () => {
      if (cabinetMode) {
        if (document.fullscreenElement) {
          fullscreenScrollRef.current ??= { x: window.scrollX, y: window.scrollY };
        } else {
          // Wait for the browser to restore the iframe from its fullscreen top layer.
          cancelAnimationFrame(restoreFrame);
          restoreFrame = requestAnimationFrame(() => {
            const position = fullscreenScrollRef.current;
            if (position) window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
            fullscreenScrollRef.current = null;
            setZoom(computeZoom());
          });
        }
      }
      if (!document.fullscreenElement && fullscreenForGame.current) {
        fullscreenForGame.current = false;
        screen.orientation?.unlock();
        setShowRotateHint(true);
      }
    };
    const onResize = () => {
      if (cabinetMode && !document.fullscreenElement && !fullscreenScrollRef.current) setZoom(computeZoom());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      cancelAnimationFrame(restoreFrame);
      fullscreenScrollRef.current = null;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [playing, closeGame, cabinetMode, computeZoom]);

  useEffect(() => () => {
    if (fullscreenForGame.current) {
      screen.orientation?.unlock();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground animate-[fade-in-delayed_350ms_ease-out_both] motion-reduce:animate-none">
      <Navigation />
      <main className="pt-28 sm:pt-24">
        <header className="mx-auto mb-6 px-4 text-center">
          <h1 className="sr-only">KazukiLabs</h1>
          <img
            src={labsLogo}
            alt="KazukiLabs — lavender arcade lettering with a coral moon, white mountain and coral river"
            width={1920}
            height={640}
            className="mx-auto h-auto w-[min(92vw,40rem)]"
            fetchPriority="high"
          />
          <p className="mx-auto mt-2 max-w-2xl font-heading text-base italic text-muted-foreground sm:text-xl">
            Try playing as KAZUKI and KIZUKI in their stunning new adventure…
          </p>
        </header>

        <section aria-label="KazukiLabs arcade" className={`relative w-full ${zoom ? "z-[60]" : "overflow-hidden"}`}>
          {/* Phones crop away the shop, keeping the cabinet, screen and controls centred. */}
          <div
            ref={cabinetRef}
            className="relative left-1/2 origin-top-left transition-transform duration-700 ease-in-out motion-reduce:transition-none w-[165vw] -translate-x-1/2 sm:left-auto sm:w-full sm:translate-x-0"
            style={{ fontSize: "clamp(12px, 1.6vw, 22px)", ...(zoom ? { transform: zoom } : {}) }}
          >
            <img
              src={arcade}
              alt="A bright Japanese arcade cabinet surrounded by capsule and claw machines"
              width={1672}
              height={941}
              className="block h-auto w-full select-none"
              fetchPriority="high"
              draggable={false}
            />
            <div
              ref={screenRef}
              className="absolute overflow-hidden rounded-[4px] bg-ink-black shadow-[inset_0_0_24px_hsl(var(--ink-black))]"
              style={{ left: "30.55%", top: "31.45%", width: "38.45%", height: "40.85%" }}
              aria-live="polite"
            >
              {playing && cabinetMode && game.url ? (
                <iframe ref={gameFrameRef} src={game.url} title={game.title} allow="camera; xr-spatial-tracking; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0 bg-ink-black" />
              ) : (
                <TitleScreen key={index} game={game} index={index} />
              )}
              <span className="sr-only">{`Game ${index + 1}: ${game.title}`}</span>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-500 data-[off=true]:opacity-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_1px,transparent_1px_3px)]" data-off={playing && cabinetMode} />
            </div>

            <div className="absolute flex -translate-x-1/2 items-start justify-center gap-[0.85em]" style={{ left: "50%", top: "84%" }}>
              <ArcadeButton label="Prev" onPress={() => step(-1)} color="#7cc4f0"><ChevronLeft className="h-[1.4em] w-[1.4em] text-ink-black" /></ArcadeButton>
              <ArcadeButton label="Start" onPress={start} color="#ffd23f"><span className="text-[0.6em] font-black text-ink-black">GO</span></ArcadeButton>
              <ArcadeButton label="Next" onPress={() => step(1)} color="#7cc4f0"><ChevronRight className="h-[1.4em] w-[1.4em] text-ink-black" /></ArcadeButton>
            </div>
          </div>
        </section>

        <p className="px-4 py-9 text-center font-heading text-lg">Play the full game soon on Steam.</p>
      </main>
      <Footer />

      {playing && !cabinetMode && game.url && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-ink-black">
          {showRotateHint && (
            <p className="flex items-center justify-center gap-2 p-2 text-center text-xs text-background sm:text-sm" role="status">
              <RotateCw className="h-4 w-4 shrink-0" /> Turn your phone sideways to play
            </p>
          )}
          <iframe ref={gameFrameRef} src={game.url} title={game.title} allow="camera; xr-spatial-tracking; fullscreen" allowFullScreen className="min-h-0 w-full flex-1 border-0 bg-background" />
        </div>
      )}
    </div>
  );
};

export default KazukiLabs;
