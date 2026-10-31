import { useEffect, useState } from "react";

export type HomeLayout = "cinematic" | "original";
const KEY = "home-layout-preview";

export function useHomeLayout(): [HomeLayout, (l: HomeLayout) => void] {
  const [layout, setLayout] = useState<HomeLayout>(() => {
    try {
      return localStorage.getItem(KEY) === "original" ? "original" : "cinematic";
    } catch {
      return "cinematic";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, layout);
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
  }, [layout]);
  return [layout, setLayout];
}

const HomeLayoutToggle = ({ layout, onChange }: { layout: HomeLayout; onChange: (l: HomeLayout) => void }) => (
  <div className="fixed bottom-4 left-4 z-[60] flex overflow-hidden rounded-full border border-border/40 bg-ink-black/80 p-1 text-xs backdrop-blur-md">
    {(["cinematic", "original"] as HomeLayout[]).map((l) => (
      <button
        key={l}
        type="button"
        onClick={() => onChange(l)}
        className={`rounded-full px-3 py-1.5 uppercase tracking-[0.15em] transition-colors ${
          layout === l ? "bg-background text-foreground" : "text-background/70 hover:text-background"
        }`}
      >
        {l === "cinematic" ? "New" : "Original"}
      </button>
    ))}
  </div>
);

export default HomeLayoutToggle;
