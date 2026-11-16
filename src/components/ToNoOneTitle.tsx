import { useId } from "react";
import titleArt from "@/assets/to-no-one-title.webp";

/* Pen routes traced over the 1536×512 lettering, in writing order. */
const STROKES = [
  { d: "M30 222 C150 160 330 95 492 68", w: 54, len: 393 },
  { d: "M290 72 C245 200 195 320 150 472", w: 64, len: 339 },
  { d: "M330 238 C285 225 248 270 238 320 C230 370 275 385 310 360 C350 330 360 260 325 236", w: 56, len: 368 },
  { d: "M420 392 C460 300 490 200 520 118 C540 200 555 290 572 352 C600 270 640 170 702 58", w: 56, len: 683 },
  { d: "M690 218 C640 215 610 270 612 315 C615 355 665 350 685 300 C700 260 705 230 688 215", w: 54, len: 318 },
  { d: "M955 112 C880 85 812 150 795 225 C780 300 812 362 865 352 C930 340 978 260 978 185 C980 125 940 98 880 108", w: 68, len: 684 },
  { d: "M968 330 C985 285 1000 245 1012 195 C1030 200 1045 190 1060 205 C1070 240 1062 290 1066 325", w: 62, len: 258 },
  { d: "M1092 282 C1150 270 1205 245 1212 205 C1210 180 1165 185 1130 215 C1095 250 1095 315 1150 330 C1230 340 1320 290 1400 275 C1430 270 1455 278 1470 290", w: 58, len: 631 },
  { d: "M228 462 C400 410 600 385 850 384 C1000 388 1150 365 1285 318", w: 46, len: 861 },
];
const PX_PER_MS = 2.1;
const GAP = 70;
let cursor = 150;
const TIMED = STROKES.map((s) => {
  const dur = Math.max(140, s.len / PX_PER_MS);
  const t = { ...s, delay: cursor, dur };
  cursor += dur + GAP;
  return t;
});
/** When the pen lifts for the last time (ms after start). */
export const TO_NO_ONE_WRITTEN_MS = cursor;

/** "To No One" lettering revealed stroke by stroke, blotches flicked in at the end. */
export default function ToNoOneTitle({ start }: { start: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 1536 512" className={`to-no-one-title block h-auto w-full ${start ? "is-writing" : ""}`} role="img" aria-label="To No One">
      <defs>
        <mask id={`${id}-pen`} maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="512">
          {TIMED.map((s, i) => (
            <path key={i} className="to-no-one-title__pen" d={s.d} fill="none" stroke="white" strokeWidth={s.w}
              strokeLinecap="round" strokeLinejoin="round" pathLength={1}
              style={{ animationDelay: `${s.delay}ms`, animationDuration: `${s.dur}ms` }} />
          ))}
        </mask>
        <clipPath id={`${id}-ink`}><rect x="0" y="0" width="1275" height="512" /><rect x="1275" y="0" width="261" height="300" /></clipPath>
        <clipPath id={`${id}-blots`}><rect x="1275" y="300" width="261" height="212" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-ink)`}>
        <image href={titleArt} width="1536" height="512" mask={`url(#${id}-pen)`} />
        {/* Fills any speck of chalk the pen routes missed once writing ends. */}
        <image href={titleArt} width="1536" height="512" className="to-no-one-title__settle" style={{ animationDelay: `${cursor - 200}ms` }} />
      </g>
      <image href={titleArt} width="1536" height="512" clipPath={`url(#${id}-blots)`} className="to-no-one-title__blots" style={{ animationDelay: `${cursor}ms` }} />
    </svg>
  );
}
