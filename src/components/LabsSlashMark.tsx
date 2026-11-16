/**
 * Two parallel diagonal strokes that sit behind the "KazukiLabs" nav label,
 * like a light watermark slash mark. Drawn in the link's own text colour so it
 * follows the header theme, and it never intercepts pointer events.
 */
const LabsSlashMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-x-0 -top-1.5 h-[calc(100%+0.75rem)] w-full overflow-visible"
  >
    <g
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      fill="none"
      className="opacity-[0.28] transition-opacity duration-300 group-hover:opacity-[0.55]"
    >
      <line x1="28" y1="-8" x2="50" y2="94" vectorEffect="non-scaling-stroke" />
      <line x1="48" y1="6" x2="70" y2="108" vectorEffect="non-scaling-stroke" />
    </g>
  </svg>
);

export default LabsSlashMark;
