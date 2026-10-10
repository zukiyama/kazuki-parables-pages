import { useCallback, useEffect, useRef, type CSSProperties, type MutableRefObject, type RefObject } from "react";
import { Button } from "@/components/ui/button";

type Pt = { x: number; y: number };

interface PagePeelProps {
  /** The page element that gets clipped as the corner peels away. */
  targetRef: RefObject<HTMLElement>;
  /** Positions the overlay over the same box as the target page. */
  boxStyle: CSSProperties;
  /** Show the resting dog-ear corner. */
  ready: boolean;
  /** Whether the page is currently the visible one. */
  pageShown: boolean;
  onTurned: () => void;
  onRevealChange: (revealed: boolean) => void;
  /** Exposes a programmatic turn (wheel / swipe). Returns true when handled. */
  turnRef: MutableRefObject<(() => boolean) | null>;
  draggingRef: MutableRefObject<boolean>;
}

const REST = 54;
const HOVER = 92;
const TURN_THRESHOLD = 0.35;

const clipHalf = (poly: Pt[], side: (p: Pt) => number, keepPositive: boolean): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const sa = keepPositive ? side(a) : -side(a);
    const sb = keepPositive ? side(b) : -side(b);
    if (sa >= 0) out.push(a);
    if ((sa >= 0) !== (sb >= 0)) {
      const t = sa / (sa - sb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const PagePeel = ({ targetRef, boxStyle, ready, pageShown, onTurned, onRevealChange, turnRef, draggingRef }: PagePeelProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<Pt | null>(null);
  const rafRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const turnedRef = useRef(false);
  const movedRef = useRef(false);
  const startRef = useRef<Pt>({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const onTurnedRef = useRef(onTurned);
  onTurnedRef.current = onTurned;
  const revealRef = useRef(false);
  const onRevealRef = useRef(onRevealChange);
  onRevealRef.current = onRevealChange;

  const size = () => {
    const el = targetRef.current;
    if (!el) return { w: 0, h: 0, left: 0, top: 0 };
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height, left: r.left, top: r.top };
  };

  const restPoint = useCallback((): Pt => {
    const { w, h } = size();
    const d = readyRef.current ? (hoverRef.current ? HOVER : REST) : 0;
    return { x: w - d, y: h - d };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const render = useCallback((p: Pt) => {
    pRef.current = p;
    const page = targetRef.current;
    const flap = flapRef.current;
    if (!page || !flap) return;
    const { w, h } = size();
    const c = { x: w, y: h };
    const revealed = w > 0 && (w - p.x) / w > 0.16;
    if (revealed !== revealRef.current) {
      revealRef.current = revealed;
      onRevealRef.current(revealed);
    }
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const len = Math.hypot(dx, dy);
    if (len < 1 || w === 0) {
      page.style.clipPath = "";
      flap.style.display = "none";
      return;
    }
    const n = { x: dx / len, y: dy / len };
    const m = { x: (p.x + c.x) / 2, y: (p.y + c.y) / 2 };
    const side = (q: Pt) => (q.x - m.x) * n.x + (q.y - m.y) * n.y;
    const rect = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
    const kept = clipHalf(rect, side, true);
    const folded = clipHalf(rect, side, false);
    page.style.clipPath = kept.length >= 3
      ? `polygon(${kept.map((q) => `${q.x}px ${q.y}px`).join(",")})`
      : "polygon(0 0, 0 0, 0 0)";

    if (folded.length < 3) {
      flap.style.display = "none";
      return;
    }
    // Flap box is 3w x 3h offset by (-w, -h) so it can travel beyond the page.
    const flapPoly = folded.map((q) => {
      const s = side(q);
      return { x: q.x - 2 * s * n.x + w, y: q.y - 2 * s * n.y + h };
    });
    const W = 3 * w;
    const H = 3 * h;
    const center = { x: 1.5 * w, y: 1.5 * h };
    const angle = (Math.atan2(n.x, -n.y) * 180) / Math.PI;
    const rad = (angle * Math.PI) / 180;
    const L = Math.abs(W * Math.sin(rad)) + Math.abs(H * Math.cos(rad));
    const at = (q: Pt) => (((q.x + w - center.x) * n.x + (q.y + h - center.y) * n.y) / L + 0.5) * 100;
    const t0 = at(m);
    const t1 = at(p);
    const span = Math.max(0.01, t1 - t0);
    flap.style.display = "block";
    flap.style.clipPath = `polygon(${flapPoly.map((q) => `${q.x}px ${q.y}px`).join(",")})`;
    flap.style.background = `linear-gradient(${angle}deg,
      hsl(var(--paper-fold-shade)) ${t0}%,
      hsl(var(--canvas-base)) ${t0 + span * 0.12}%,
      hsl(var(--paper-fold-light)) ${t0 + span * 0.38}%,
      hsl(var(--canvas-base)) ${t0 + span * 0.7}%,
      hsl(var(--parchment, var(--canvas-base))) ${t1}%)`;
  }, [targetRef]);

  const animateTo = useCallback((target: Pt, duration: number, done?: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = pRef.current ?? restPoint();
    const start = performance.now();
    animatingRef.current = true;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOut(t);
      render({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e });
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        animatingRef.current = false;
        done?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [render, restPoint]);

  const turn = useCallback(() => {
    if (turnedRef.current || !readyRef.current) return;
    turnedRef.current = true;
    const { w, h } = size();
    const from = pRef.current;
    const dist = from ? (from.x + 1.1 * w) / (2.1 * w) : 1;
    animateTo({ x: -1.1 * w, y: h }, 420 + 520 * Math.max(0.25, Math.min(1, dist)), () => onTurnedRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateTo]);

  // Programmatic turns (wheel / swipe from elsewhere on the page).
  useEffect(() => {
    turnRef.current = () => {
      if (!pageShown) return false;
      if (!readyRef.current) return true;
      if (!turnedRef.current) turn();
      return true;
    };
    return () => { turnRef.current = null; };
  }, [turn, turnRef, pageShown]);

  // Reset to the resting corner whenever the page is shown again.
  useEffect(() => {
    if (!pageShown) return;
    turnedRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    animatingRef.current = false;
    if (ready && pRef.current && pRef.current.x > 0) {
      animateTo(restPoint(), 520);
    } else {
      render(restPoint());
    }
  }, [pageShown, ready, animateTo, render, restPoint]);

  // Keep geometry correct on resize.
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!animatingRef.current && !draggingRef.current && !turnedRef.current) render(restPoint());
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [targetRef, render, restPoint, draggingRef]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (targetRef.current) targetRef.current.style.clipPath = "";
  }, [targetRef]);

  const local = (e: React.PointerEvent) => {
    const { left, top } = size();
    return { x: e.clientX - left, y: e.clientY - top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (turnedRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    animatingRef.current = false;
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    if (Math.hypot(e.clientX - startRef.current.x, e.clientY - startRef.current.y) > 6) movedRef.current = true;
    if (!movedRef.current) return;
    const { w, h } = size();
    const q = local(e);
    render({ x: Math.min(q.x, w - 1), y: Math.min(q.y, h - 1) });
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (!movedRef.current) {
      turn();
      return;
    }
    const { w } = size();
    const p = pRef.current;
    const progress = p ? (w - p.x) / w : 0;
    if (progress > TURN_THRESHOLD) turn();
    else animateTo(restPoint(), 380);
  };

  const setHover = (on: boolean) => {
    hoverRef.current = on;
    if (!draggingRef.current && !turnedRef.current && readyRef.current) animateTo(restPoint(), 260);
  };

  return (
    <div ref={overlayRef} className="comics-page-peel" style={boxStyle} hidden={!pageShown} aria-hidden={!pageShown}>
      <div className="comics-page-peel__shadow">
        <div ref={flapRef} className="comics-page-peel__flap" />
      </div>
      {pageShown && ready && (
        <Button
          type="button"
          variant="ghost"
          className="comics-page-peel__hotspot bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Turn the page to God of Lies"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              turn();
            }
          }}
        />
      )}
    </div>
  );
};
