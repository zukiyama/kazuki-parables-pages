import { useEffect, useState } from "react";

const font = "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
const delays = [1, 4, 2, 6, 3, 5, 7];

export function ParableZoom() {
  const [widths, setWidths] = useState([110, 110, 120, 110, 115, 95, 105]);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = `bold 180px ${font}`;
    setWidths(Array.from("PARABLE", (letter) => context.measureText(letter).width));
  }, []);
  const total = widths.reduce((sum, width) => sum + width, 0) + 6 * 16;
  const holeX = widths[0] + 16 + widths[1] / 2;
  return (
    <div className="parable-zoom" aria-label="Parable">
      <svg className="parable-zoom__word" viewBox={`0 0 ${total} 220`} aria-hidden="true"
        style={{ transformOrigin: `${holeX / total * 100}% 50%`, "--parable-travel-x": `${(0.5 - holeX / total) * 100}%` } as React.CSSProperties}>
        {Array.from("PARABLE", (letter, index) => (
          <text key={index} x={widths.slice(0, index).reduce((sum, width) => sum + width, 0) + index * 16}
            y="180" className={`animate-letter-fall-${delays[index]}`}>
            {letter}
          </text>
        ))}
      </svg>
    </div>
  );
}