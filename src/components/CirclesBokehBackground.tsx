import { memo, useLayoutEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type CirclesBokehBackgroundProps = {
  className?: string;
  targetRef: RefObject<HTMLElement>;
};

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const CirclesBokehBackground = memo(({ className, targetRef }: CirclesBokehBackgroundProps) => {
  const portalEl = document.getElementById("bokeh-portal");
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      const next: Rect = {
        top: r.top + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
        height: r.height,
      };

      setRect((prev) => {
        if (
          prev &&
          Math.abs(prev.top - next.top) < 0.5 &&
          Math.abs(prev.left - next.left) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
        ) {
          return prev;
        }
        return next;
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [targetRef]);

  if (!portalEl || !rect) return null;

  // Circles single cover inspired palette: warm peach, coral, soft cream, muted terracotta
  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        contain: "strict",
      }}
      className={cn("z-0 overflow-hidden pointer-events-none transform-gpu", className)}
    >
      {/* Large circles positioned at edges - away from center content */}
      {/* Left edge circles */}
      <div className="absolute -left-24 top-[10%] w-56 h-56 rounded-full bg-[hsl(15,70%,75%,0.35)] bokeh-blur animate-drift-1"></div>
      <div className="absolute -left-16 bottom-[5%] w-44 h-44 rounded-full bg-[hsl(25,65%,70%,0.30)] bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[2%] top-[60%] w-36 h-36 rounded-full bg-[hsl(10,75%,78%,0.32)] bokeh-blur animate-drift-7"></div>
      
      {/* Right edge circles */}
      <div className="absolute -right-20 top-[20%] w-52 h-52 rounded-full bg-[hsl(20,68%,72%,0.33)] bokeh-blur animate-drift-2"></div>
      <div className="absolute -right-28 bottom-[15%] w-60 h-60 rounded-full bg-[hsl(30,60%,68%,0.28)] bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[3%] top-[5%] w-40 h-40 rounded-full bg-[hsl(18,72%,74%,0.30)] bokeh-blur animate-drift-8"></div>
      
      {/* Top edge circles */}
      <div className="absolute left-[15%] -top-16 w-48 h-48 rounded-full bg-[hsl(22,66%,73%,0.32)] bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[25%] -top-12 w-40 h-40 rounded-full bg-[hsl(12,70%,76%,0.28)] bokeh-blur animate-drift-6"></div>
      
      {/* Bottom edge circles */}
      <div className="absolute left-[20%] -bottom-20 w-52 h-52 rounded-full bg-[hsl(28,62%,70%,0.30)] bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[18%] -bottom-16 w-44 h-44 rounded-full bg-[hsl(16,74%,75%,0.32)] bokeh-blur animate-drift-4"></div>
      
      {/* Medium circles - corners and edges, avoiding center */}
      <div className="absolute left-[8%] top-[25%] w-28 h-28 rounded-full bg-[hsl(14,68%,77%,0.35)] bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[6%] bottom-[40%] w-32 h-32 rounded-full bg-[hsl(24,64%,71%,0.33)] bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[5%] bottom-[30%] w-24 h-24 rounded-full bg-[hsl(20,70%,74%,0.30)] bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[8%] top-[55%] w-26 h-26 rounded-full bg-[hsl(18,66%,76%,0.32)] bokeh-blur animate-drift-3"></div>
      
      {/* Small accent circles at far edges */}
      <div className="absolute left-[3%] top-[40%] w-18 h-18 rounded-full bg-[hsl(26,60%,72%,0.38)] bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[4%] top-[35%] w-20 h-20 rounded-full bg-[hsl(12,72%,78%,0.35)] bokeh-blur animate-drift-7"></div>
      <div className="absolute left-[10%] bottom-[8%] w-16 h-16 rounded-full bg-[hsl(22,68%,73%,0.36)] bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[12%] bottom-[5%] w-18 h-18 rounded-full bg-[hsl(16,70%,75%,0.34)] bokeh-blur animate-drift-4"></div>
      
      {/* Far corner circles for depth */}
      <div className="absolute -left-10 top-[45%] w-32 h-32 rounded-full bg-[hsl(30,55%,70%,0.25)] bokeh-blur animate-drift-2"></div>
      <div className="absolute -right-14 top-[65%] w-36 h-36 rounded-full bg-[hsl(8,75%,80%,0.28)] bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[25%] -top-10 w-28 h-28 rounded-full bg-[hsl(20,65%,72%,0.30)] bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[30%] -bottom-8 w-24 h-24 rounded-full bg-[hsl(14,70%,76%,0.32)] bokeh-blur animate-drift-3"></div>
    </div>,
    portalEl
  );
});

CirclesBokehBackground.displayName = "CirclesBokehBackground";

export default CirclesBokehBackground;
