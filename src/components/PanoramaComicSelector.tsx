import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Story = { cover: string; title: string; description: ReactNode; teaser: string; format: string };

export function PanoramaComicSelector({ comics, original, open }: { comics: Story[]; original: Story; open: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [story, setStory] = useState(original);
  const [visible, setVisible] = useState(true);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const measure = () => {
      const origin = root.getBoundingClientRect();
      const destination = stage.getBoundingClientRect();
      slotsRef.current.forEach((slot, index) => {
        const image = slot?.querySelector("img");
        const parent = slot?.offsetParent;
        if (!slot || !image || !(parent instanceof HTMLElement)) return;
        // Offset coordinates ignore entrance transforms, keeping the destination stable.
        const sourceX = slot.offsetLeft + parent.offsetLeft;
        const sourceY = slot.offsetTop + parent.offsetTop;
        const width = Math.min(destination.width, destination.height * 2 / 3);
        const height = width * 3 / 2;
        const enlarged = selected === index;
        const x = destination.left - origin.left + (destination.width - width) / 2;
        const y = destination.top - origin.top + (destination.height - height) / 2;
        image.style.setProperty("--cover-x", `${enlarged ? x - sourceX : 0}px`);
        image.style.setProperty("--cover-y", `${enlarged ? y - sourceY : 0}px`);
        image.style.setProperty("--cover-scale", `${enlarged ? width / slot.offsetWidth : 1}`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [selected, story]);

  const choose = (index: number | null) => {
    if (selected === index) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelected(index);
    const next = index === null ? original : comics[index];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStory(next);
      setVisible(true);
      return;
    }
    setVisible(false);
    timerRef.current = setTimeout(() => { setStory(next); setVisible(true); }, 90);
  };

  return (
    <div ref={rootRef} className={`comics-story-selector ${open ? "is-open" : ""} ${selected === null ? "is-original" : "has-selection"}`}>
      <div ref={stageRef} className="comics-cover-stage" aria-hidden="true" />
      <div className="comics-hill-blurb">
        <div className={`comics-story-copy ${visible ? "is-visible" : ""}`} aria-live="polite">
          <h3 className="comics-story-title">{story.title === "Gods!" ? "GODS!" : story.title}</h3>
          <div className="comics-story-rule" />
          <p className="comics-story-description">{story.description}</p>
          <p className="comics-story-teaser">{story.teaser}</p>
          <p className="comics-story-format">{story.format}</p>
        </div>
        {selected !== null && <Button variant="link" className="comics-story-reset" onClick={() => choose(null)}>Back to God of Lies</Button>}
      </div>
      <div className="comics-story-row" aria-label="Choose a comic">
        {comics.map((comic, index) => (
          <Button key={comic.title} ref={(element) => { slotsRef.current[index] = element; }} variant="ghost"
            className={`comics-story-cover ${selected === index ? "is-selected" : ""}`}
            onClick={() => choose(index)} aria-label={`Read about ${comic.title}`} aria-pressed={selected === index}>
            <img src={comic.cover} alt={`${comic.title} comic cover`} width={1024} height={1536} loading="eager" decoding="async" />
          </Button>
        ))}
      </div>
    </div>
  );
}