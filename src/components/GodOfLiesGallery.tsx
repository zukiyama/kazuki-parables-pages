import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import plantShop from "@/assets/god-of-lies-carousel-plant-shop.asset.json";
import cottonCandy from "@/assets/god-of-lies-carousel-cotton-candy.asset.json";
import pear from "@/assets/god-of-lies-carousel-pear.asset.json";
import milk from "@/assets/god-of-lies-carousel-milk.asset.json";

const scenes = [
  { src: cottonCandy.url, alt: "Chang-Min and Seok-seol shopping with cotton candy" },
  { src: pear.url, alt: "Seok-seol reclining on a sliced pear" },
  { src: milk.url, alt: "Chang-Min holding milk beside Seok-seol in the kitchen" },
  { src: plantShop.url, alt: "Two men among flowers and plants" },
];

export function GodOfLiesGallery({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [imagesReady, setImagesReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    // Decode while the opening/title is visible, not during the moving reveal.
    void Promise.all(scenes.map(async ({ src }) => {
      const image = new Image();
      image.src = src;
      try { await image.decode(); } catch { /* A failed image must not hide the story. */ }
    })).then(() => { if (!cancelled) setImagesReady(true); });
    return () => { cancelled = true; };
  }, []);
  const imageRef = useRef<HTMLImageElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sourceTransform = () => {
    const source = sourceRef.current?.getBoundingClientRect();
    const target = imageRef.current?.getBoundingClientRect();
    if (!source || !target || !target.width || !target.height) return "none";
    return `translate(${source.left + source.width / 2 - target.left - target.width / 2}px, ${source.top + source.height / 2 - target.top - target.height / 2}px) scale(${source.width / target.width}, ${source.height / target.height})`;
  };
  const mountImage = useCallback((image: HTMLImageElement | null) => {
    imageRef.current = image;
    if (!image || reducedMotion()) return;
    animationRef.current = image.animate(
      [{ transform: sourceTransform() }, { transform: "none" }],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, []);
  const close = async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    animationRef.current?.cancel();
    if (!reducedMotion()) {
      const animation = imageRef.current?.animate(
        [{ transform: "none" }, { transform: sourceTransform() }],
        { duration: 340, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
      );
      try { await animation?.finished; } catch { /* Interrupted by unmount. */ }
    }
    setSelected(null);
    closingRef.current = false;
  };
  const scene = selected === null ? undefined : scenes[selected];
  return (
    <div className={`god-of-lies-gallery ${imagesReady ? 'is-ready' : ''}`}>
      <div className="god-of-lies-gallery__row" aria-label="God of Lies illustrations">
        {scenes.map((scene, index) => (
          <Button key={scene.src} variant="link" className="god-of-lies-gallery__picture" aria-label={`Enlarge illustration ${index + 1}`} onClick={(event) => {
            sourceRef.current = event.currentTarget.querySelector("img");
            setSelected(index);
          }}>
            <img src={scene.src} alt={scene.alt} width={1536} height={1024} loading="eager" decoding="sync" draggable={false} />
          </Button>
        ))}
      </div>
      <div className="comics-hill-blurb">{children}</div>
      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) void close(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="god-of-lies-gallery__overlay" />
          <Dialog.Content className="god-of-lies-gallery__enlarged" aria-describedby={undefined} onEscapeKeyDown={(event) => { event.preventDefault(); void close(); }} onPointerDownOutside={(event) => { event.preventDefault(); void close(); }} onCloseAutoFocus={(event) => { event.preventDefault(); sourceRef.current?.closest<HTMLElement>("button")?.focus(); }}>
            <Dialog.Title className="sr-only">{scene?.alt}</Dialog.Title>
            {scene && <Button variant="link" className="god-of-lies-gallery__dismiss" aria-label="Close illustration" onClick={() => void close()}><img ref={mountImage} src={scene.src} alt={scene.alt} width={1536} height={1024} /></Button>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
