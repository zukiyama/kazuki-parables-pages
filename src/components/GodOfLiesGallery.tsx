import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import florist from "@/assets/god-of-lies-carousel-florist.webp.asset.json";
import cottonCandy from "@/assets/god-of-lies-carousel-cotton-candy.asset.json";
import pear from "@/assets/god-of-lies-carousel-pear.asset.json";
import { nextGalleryPicture } from "@/lib/comics-slideshow";

const scenes = [
  { src: cottonCandy.url, alt: "Chang-Min and Seok-seol shopping with cotton candy" },
  { src: pear.url, alt: "Seok-seol reclining on a sliced pear" },
  { src: florist.url, alt: "Two people among potted plants on a flying terrace beneath a ringed planet" },
];

// The pictures centre between the fixed header's bottom border and the blurb,
// so the header's on-screen height is reserved as an invisible spacer row.
export function GodOfLiesGallery({ children, onViewerChange, renderViewerControls }: {
  children: ReactNode;
  onViewerChange?: (open: boolean) => void;
  renderViewerControls?: (navigate: (direction: -1 | 1) => void) => ReactNode;
}) {
  const [headerSpace, setHeaderSpace] = useState(0);
  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-header="true"]');
    if (!header) return;
    const update = () => setHeaderSpace(header.getBoundingClientRect().bottom);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener('resize', update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, []);
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
  const thumbnailsRef = useRef<(HTMLImageElement | null)[]>([]);
  const directionRef = useRef<-1 | 1 | null>(null);
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
    const direction = directionRef.current;
    directionRef.current = null;
    animationRef.current = image.animate(
      direction === null
        ? [{ transform: sourceTransform() }, { transform: "none" }]
        : [{ transform: `translateX(${direction * 8}%)`, opacity: 0 }, { transform: "none", opacity: 1 }],
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
    onViewerChange?.(false);
    closingRef.current = false;
  };
  const navigatePicture = (direction: -1 | 1) => {
    if (selected === null || closingRef.current) return;
    const next = nextGalleryPicture(selected, direction);
    animationRef.current?.cancel();
    directionRef.current = direction;
    sourceRef.current = thumbnailsRef.current[next];
    setSelected(next);
  };
  const scene = selected === null ? undefined : scenes[selected];
  return (
    <div
      className={`god-of-lies-gallery ${imagesReady ? 'is-ready' : ''}`}
      style={{ '--god-of-lies-header-space': `${Math.round(headerSpace)}px` } as CSSProperties}
    >
      <div className="god-of-lies-gallery__row" aria-label="God of Lies illustrations">
        {scenes.map((scene, index) => (
          <button key={scene.src} type="button" className="god-of-lies-gallery__picture" aria-label={`Enlarge illustration ${index + 1}`} onClick={(event) => {
            sourceRef.current = event.currentTarget.querySelector("img");
            directionRef.current = null;
            onViewerChange?.(true);
            setSelected(index);
          }}>
            <img ref={image => { thumbnailsRef.current[index] = image; }} src={scene.src} alt={scene.alt} width={1536} height={1024} loading="eager" decoding="sync" draggable={false} />
          </button>
        ))}
      </div>
      <div className="comics-hill-blurb">{children}</div>
      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) void close(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="god-of-lies-gallery__overlay" />
          <Dialog.Content className="god-of-lies-gallery__viewer" aria-describedby={undefined} onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('.god-of-lies-gallery__controls')) return;
            void close();
          }} onEscapeKeyDown={(event) => { event.preventDefault(); void close(); }} onPointerDownOutside={(event) => { event.preventDefault(); void close(); }} onCloseAutoFocus={(event) => { event.preventDefault(); }}>
            <Dialog.Title className="sr-only">{scene?.alt}</Dialog.Title>
            <div className="god-of-lies-gallery__enlarged">
              {scene && <button type="button" className="god-of-lies-gallery__dismiss" aria-label="Close illustration" onClick={() => void close()}><img key={scene.src} ref={mountImage} src={scene.src} alt={scene.alt} width={1536} height={1024} /></button>}
            </div>
            {renderViewerControls?.(navigatePicture)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
