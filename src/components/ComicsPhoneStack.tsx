import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { shelfComics } from "@/lib/comics-slideshow";
import florist from "@/assets/god-of-lies-carousel-florist.webp.asset.json";
import cottonCandy from "@/assets/god-of-lies-carousel-cotton-candy.asset.json";
import serenePortrait from "@/assets/god-of-lies-carousel-serene-portrait.webp.asset.json";
import screenplayArtwork from "@/assets/the-burden-screenplay.webp.asset.json";
import shelfBackground from "@/assets/comics-sketch-background.webp.asset.json";

type Comic = { cover: string; title: string; description: ReactNode; teaser: string; format: string };

const scenes = [
  { src: cottonCandy.url, alt: "Chang-Min and Seok-seol shopping with cotton candy" },
  { src: serenePortrait.url, alt: "Smiling young man in a patterned robe with tassel earrings, eyes closed" },
  { src: florist.url, alt: "Two people among potted plants on a flying terrace beneath a ringed planet" },
];

/** Phones only: the lower Comics chapters as one natively scrolling page. */
export function ComicsPhoneStack({ children, comics, open }: { children: ReactNode; comics: Comic[]; open: boolean }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [viewport, api] = useEmblaCarousel({ loop: true, align: "center" });
  const [current, setCurrent] = useState(0);
  const [enlarged, setEnlarged] = useState<number | null>(null);
  const [selected, setSelected] = useState<Comic | null>(null);

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-header="true"]');
    if (!header) return;
    const measure = () => stackRef.current?.style.setProperty("--chapter-header-height", `${Math.max(0, header.getBoundingClientRect().bottom)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync(); api.on("select", sync);
    return () => { api.off("select", sync); };
  }, [api]);
  // Story, Burden and shelf each fill the screen; a swipe turns to the next
  // one with an eased slide. Past the shelf the page scrolls freely to the footer.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const pages = () => Array.from(stack.querySelectorAll<HTMLElement>("[data-phone-page]"));
    const shelfTop = () => pages()[2]?.offsetTop ?? 0;
    let animating = false; let startY = 0; let startTop = 0; let turned = false; let lastWheel = 0;
    const pageIndex = () => { const tops = pages().map(p => p.offsetTop); let best = 0; tops.forEach((t, i) => { if (Math.abs(t - stack.scrollTop) < Math.abs(tops[best] - stack.scrollTop)) best = i; }); return best; };
    const goTo = (index: number) => {
      const target = pages()[index]; if (!target) return;
      const from = stack.scrollTop; const to = target.offsetTop; const begin = performance.now(); const duration = 720;
      animating = true; stack.style.overflowY = "hidden";
      const step = (now: number) => {
        const t = Math.min(1, (now - begin) / duration); const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        stack.scrollTop = from + (to - from) * e;
        if (t < 1) requestAnimationFrame(step); else { animating = false; stack.style.overflowY = ""; }
      };
      requestAnimationFrame(step);
    };
    const paged = (top: number) => top < shelfTop() - 2;
    const turn = (dir: 1 | -1) => {
      const index = pageIndex();
      if (dir === 1 && index < 2) goTo(index + 1);
      else if (dir === -1 && index > 0) goTo(index - 1);
    };
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; startTop = stack.scrollTop; turned = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const delta = startY - e.touches[0].clientY;
      const atShelf = Math.abs(startTop - shelfTop()) <= 2;
      const inPaged = paged(startTop) || (atShelf && delta < 0);
      if (!inPaged && !animating) return;
      if (e.cancelable) e.preventDefault();
      if (animating || turned || Math.abs(delta) < 50) return;
      turned = true;
      if (delta > 0) turn(1); else if (pageIndex() > 0) turn(-1);
    };
    const onWheel = (e: WheelEvent) => {
      const now = performance.now(); const fresh = now - lastWheel > 150; lastWheel = now;
      const atShelf = Math.abs(stack.scrollTop - shelfTop()) <= 2;
      if (!animating && !paged(stack.scrollTop) && !(atShelf && e.deltaY < 0)) return;
      if (pageIndex() === 0 && e.deltaY < 0 && !animating) return; // the title page handles this
      e.preventDefault();
      if (animating || !fresh || Math.abs(e.deltaY) < 8) return;
      turn(e.deltaY > 0 ? 1 : -1);
    };
    // Free scrolling never drifts back above the shelf.
    const onScroll = () => { if (!animating && stack.scrollTop < shelfTop() - 2 && startTop > shelfTop() + 2) stack.scrollTop = shelfTop(); };
    stack.addEventListener("touchstart", onTouchStart, { passive: true });
    stack.addEventListener("touchmove", onTouchMove, { passive: false });
    stack.addEventListener("wheel", onWheel, { passive: false });
    stack.addEventListener("scroll", onScroll, { passive: true });
    return () => { stack.removeEventListener("touchstart", onTouchStart); stack.removeEventListener("touchmove", onTouchMove); stack.removeEventListener("wheel", onWheel); stack.removeEventListener("scroll", onScroll); };
  }, []);
  // Returning to the title always starts this page again from the top.
  useEffect(() => { if (!open && stackRef.current) stackRef.current.scrollTop = 0; }, [open]);

  return (
    <div ref={stackRef} className="comics-phone-stack" data-open={open}>
      <section className="comics-phone-stack__story" data-phone-page aria-label="God of Lies">
        <div ref={viewport} className="comics-phone-carousel" aria-label="God of Lies illustrations" aria-roledescription="carousel">
          <div className="comics-phone-carousel__track">
            {scenes.map((scene, index) => (
              <button key={scene.src} type="button" className="comics-phone-carousel__slide" data-active={index === current}
                aria-label={index === current ? `Enlarge illustration ${index + 1}` : `Show illustration ${index + 1}`}
                onClick={() => { if (!api) return; if (index === current) setEnlarged(index); else api.scrollTo(index); }}>
                <img src={scene.src} alt={scene.alt} width={1536} height={1024} draggable={false} />
              </button>
            ))}
          </div>
        </div>
        <div className="comics-phone-stack__blurb comics-hill-blurb">{children}</div>
      </section>

      <section className="comics-phone-stack__burden" data-phone-page aria-label="The Burden">
        <img className="comics-phone-burden__art" src={screenplayArtwork.url} alt="A man in a suit beside an old woman in a wheelchair under a street lamp" width={1670} height={941} />
        <div className="comics-phone-burden__copy">
          <h2><span>The</span>Burden</h2>
          <p>A phone call from a sister he hasn't spoken to in years.<br />A mother he swore never to see again.</p>
          <div className="comics-phone-burden__rule" aria-hidden="true" />
          <p>As her memories fade, Hiroshi's own resurface in a new light.</p>
          <p className="comics-phone-burden__status">Full-length screenplay <span aria-hidden="true">•</span> In development</p>
        </div>
      </section>

      <section className="comics-phone-stack__shelf" data-phone-page aria-label="Stories waiting to be told">
        <img className="comics-phone-stack__shelf-bg" src={shelfBackground.url} alt="" aria-hidden="true" />
        <h2>Stories waiting to be told…</h2>
        <div className="comics-phone-stack__covers">
          {shelfComics(comics).map(comic => (
            <Button key={comic.title} variant="link" className="comics-phone-stack__cover" aria-label={`Explore ${comic.title}`} onClick={() => setSelected(comic)}>
              <img src={comic.cover} alt={`${comic.title} comic cover`} width={640} height={960} draggable={false} />
            </Button>
          ))}
        </div>
      </section>

      <Footer variant="dark" />

      <Dialog.Root open={enlarged !== null} onOpenChange={value => { if (!value) setEnlarged(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="god-of-lies-gallery__overlay comics-phone-fade" />
          <Dialog.Content className="comics-phone-viewer" aria-describedby={undefined} onClick={() => setEnlarged(null)}>
            <Dialog.Title className="sr-only">{enlarged !== null ? scenes[enlarged].alt : ""}</Dialog.Title>
            {enlarged !== null && <img src={scenes[enlarged].src} alt={scenes[enlarged].alt} width={1536} height={1024} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={selected !== null} onOpenChange={value => { if (!value) setSelected(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="comics-reader__overlay" />
          <Dialog.Content className="comics-reader comics-phone-reader" aria-describedby="comic-phone-reader-description" onClick={() => setSelected(null)}>
            {selected && <img className="comics-phone-reader__cover" src={selected.cover} alt={`${selected.title} comic cover`} width={640} height={960} />}
            <div className="comics-reader__copy"><p className="comics-reader__format">{selected?.format}</p><Dialog.Title>{selected?.title}</Dialog.Title><div id="comic-phone-reader-description">{selected?.description}</div><p className="comics-reader__teaser">{selected?.teaser}</p></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
