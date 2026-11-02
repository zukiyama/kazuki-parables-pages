import { useId } from "react";
import { musicLettering } from "./music-lettering";
import "./music-lettering.css";

/** Reveal the original chalk outlines along the pen's route, never across a rectangular wipe. */
export function MusicHandwrittenTitle() {
  const id = useId().replace(/:/g, "");

  return (
    <h1 className="music-handwritten-title" aria-label="music">
      <svg viewBox="0 0 1859 1500" aria-hidden="true" focusable="false">
        <defs>
          {musicLettering.map((letter) => (
            <mask
              key={letter.name}
              id={`${id}-${letter.name}`}
              maskUnits="userSpaceOnUse"
              x="-30"
              y="-100"
              width="650"
              height="800"
              style={{ maskType: "alpha" }}
            >
              <path
                className="music-handwritten-title__pen"
                d={letter.stroke}
                fill="none"
                stroke="currentColor"
                strokeWidth={letter.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                style={{
                  animationDelay: `${letter.delay + 200}ms`,
                  animationDuration: `${letter.duration}ms`,
                }}
              />
            </mask>
          ))}
        </defs>
        {musicLettering.map((letter) => (
          <g key={letter.name} transform={`translate(${letter.x} 898) scale(1 -1)`}>
            <path d={letter.outline} fill="currentColor" mask={`url(#${id}-${letter.name})`} />
          </g>
        ))}
      </svg>
    </h1>
  );
}