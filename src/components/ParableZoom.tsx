import { useEffect, useState } from "react";
const delays = [1, 4, 2, 6, 3, 5, 7];

export function ParableZoom({ active, onCovered }: { active: boolean; onCovered: () => void }) {
  const [revealing, setRevealing] = useState(false);
  useEffect(() => {
    if (active) setRevealing(false);
  }, [active]);
  if (!active && !revealing) return null;
  return (
    <div className={`parable-zoom ${revealing ? "is-revealing" : ""}`} aria-label="Parable">
      {!revealing && <div className="parable-zoom__word" aria-hidden="true" onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        setRevealing(true);
        onCovered();
      }}>
        {Array.from("PARABLE", (letter, index) => (
          <span key={index} className={`animate-letter-fall-${delays[index]}`}>
            {letter}
          </span>
        ))}
      </div>}
      <div className="parable-zoom__white" onAnimationEnd={() => {
        if (revealing) setRevealing(false);
      }} />
    </div>
  );
}