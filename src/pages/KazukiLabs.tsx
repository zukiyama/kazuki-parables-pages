import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import arcade from "@/assets/kazukilabs-arcade.webp";

const gameUrl = `${import.meta.env.BASE_URL}labs/ar-pet-5.html`;

/** Title with a moon circling "LABS", a river line and a small mountain. */
const LabsLogo = () => (
  <svg viewBox="0 0 640 150" role="img" aria-label="KAZUKI LABS" className="mx-auto h-auto w-full max-w-xl">
    <text x="20" y="98" fontFamily="'Playfair Display', serif" fontSize="76" letterSpacing="6" fill="currentColor">KAZUKI</text>
    <text x="378" y="98" fontFamily="'Playfair Display', serif" fontSize="76" fontStyle="italic" letterSpacing="4" fill="currentColor">LABS</text>
    <circle cx="482" cy="72" r="62" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
    <path d="M430 70 l22 -26 l14 16 l10 -10 l22 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.55" />
    <path d="M14 124 C 120 108, 200 138, 320 122 S 520 106, 626 124" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const KazukiLabs = () => {
  const bezelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [fit, setFit] = useState<{ width: number; height: number; scale: number; offset: number; bg: string } | null>(null);

  /** The game is a tall phone screen; shrink it so the whole screen shows inside the bezel. */
  const measure = useCallback(() => {
    const bezel = bezelRef.current;
    const frame = frameRef.current;
    if (!bezel || !frame) return;
    const width = bezel.clientWidth;
    const bezelHeight = bezel.clientHeight;
    if (!width || !bezelHeight) return;
    const doc = frame.contentDocument;
    const main = doc?.querySelector("main");
    const content = main ? Math.ceil(main.getBoundingClientRect().height) : bezelHeight;
    const height = Math.max(content, bezelHeight);
    const scale = Math.min(1, bezelHeight / content);
    // Match the screen's own background so the empty sides read as one panel, not a gap.
    const bg = doc?.body ? getComputedStyle(doc.body).backgroundColor : "";
    setFit({ width, height, scale, offset: Math.max(0, (width - width * scale) / 2), bg });
  }, []);

  useEffect(() => {
    const bezel = bezelRef.current;
    if (!bezel) return;
    const observer = new ResizeObserver(measure);
    observer.observe(bezel);
    return () => observer.disconnect();
  }, [measure]);

  /** The game's checklist and log change height as it loads, so keep re-measuring. */
  const handleFrameLoad = useCallback(() => {
    const frame = frameRef.current;
    measure();
    const doc = frame?.contentDocument;
    if (!doc?.body) return;
    const observer = new ResizeObserver(measure);
    observer.observe(doc.body);
    observer.observe(doc.documentElement);
    window.setTimeout(() => observer.disconnect(), 20000);
  }, [measure]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto px-4 pb-12 pt-28 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="sr-only">KAZUKI LABS</h1>
          <LabsLogo />
          <p className="mx-auto mt-4 max-w-2xl font-heading text-lg italic text-muted-foreground sm:text-xl">
            Take control of KAZUKI and KIZUKI in their stunning new adventure…
          </p>
        </header>

        <div className="relative mx-auto w-full max-w-3xl">
          <img src={arcade} alt="A bright Japanese arcade cabinet" width={1536} height={1536} className="block h-auto w-full rounded-md" />
          <div
            ref={bezelRef}
            className="absolute overflow-hidden rounded-[4px] shadow-[inset_0_0_24px_hsl(var(--ink-black))]"
            style={{ left: "27.86%", top: "23.18%", width: "44.34%", height: "29.17%", background: fit?.bg || "hsl(var(--ink-black))" }}
          >
            <iframe
              ref={frameRef}
              src={gameUrl}
              title="AR Pet 5"
              allow="camera; xr-spatial-tracking; fullscreen"
              allowFullScreen
              onLoad={handleFrameLoad}
              style={
                fit
                  ? {
                      width: fit.width,
                      height: fit.height,
                      transform: `translateX(${fit.offset}px) scale(${fit.scale})`,
                      transformOrigin: "0 0",
                    }
                  : undefined
              }
              className="block h-full w-full border-0"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/15 via-transparent to-transparent" />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <Button asChild variant="outline">
            <a href={gameUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" /> Open full screen
            </a>
          </Button>
          <p className="font-heading text-lg">Play the full game soon on Steam.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KazukiLabs;
