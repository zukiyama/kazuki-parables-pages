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
import comingArtwork from "@/assets/comics-coming-2027.webp.asset.json";

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
  // Returning to the title always starts this page again from the top.
  useEffect(() => { if (!open && stackRef.current) stackRef.current.scrollTop = 0; }, [open]);

  return (
    <div ref={stackRef} className="comics-phone-stack" data-open={open}>
      <section className="comics-phone-stack__story" aria-label="God of Lies">
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

      <section className="comics-phone-stack__burden" aria-label="The Burden">
        <div className="comics-phone-burden">
          <img src={screenplayArtwork.url} alt="The Burden. A phone call from a sister he hasn't spoken to in years. A mother he swore never to see again. As her memories fade, Hiroshi's own resurface in a new light." width={1670} height={941} />
          <p className="comics-phone-burden__status">Full-length screenplay <span aria-hidden="true">•</span> In development</p>
        </div>
      </section>

      <section className="comics-phone-stack__shelf" aria-label="Stories waiting to be told">
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

      <section className="comics-phone-stack__coming" aria-label="Coming 2027">
        <div className="comics-phone-coming">
          <img src={comingArtwork.url} alt="Chang-Min seated among guitars in a sunlit studio with glowing butterflies" width={1874} height={839} />
          <h2>Coming 2027</h2>
        </div>
      </section>

      <Footer />

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
