

# Root Cause Analysis: White Bar on iPad Chrome/Edge

## The Culprit: `useViewportHeight` + `--app-height` CSS Variable

The white bar is caused by the interaction between the JavaScript-set `--app-height` variable and how iPad Chrome/Edge handle their toolbar/UI chrome differently from Safari.

### How it works

1. **`useViewportHeight`** (runs in `AppContent`, affects every page) sets `--app-height` to `window.innerHeight` on load
2. **Every page** uses `min-h-screen-stable`, which resolves to `var(--app-height, 100svh)` — so the JS value overrides the CSS fallback
3. **On mobile/tablet**, the hook deliberately freezes `--app-height` (only updates on orientation change) to prevent scroll jank

### Why Chrome/Edge show the bar but Safari doesn't

On iPadOS, all browsers use WebKit, but they have different toolbar configurations:
- **Safari**: Bottom toolbar is part of the browser UI and `innerHeight` accurately reflects the usable viewport
- **Chrome**: Has a different toolbar layout (address bar + potentially bottom toolbar). After initial load, Chrome may auto-hide toolbars, exposing more viewport than the frozen `--app-height` accounts for
- **Edge**: Similar but slightly different toolbar height, hence the smaller bar

When Chrome's toolbar retracts during/after load, the actual visible area grows (say from 950px to 1000px), but `--app-height` stays frozen at the initial 950px. The page content is sized to 950px, leaving a 50px white gap at the bottom — the `html` background (`hsl(var(--background))` = white) shows through.

### Why the landing page animation correlates

- **State A (scroll effect works, bar present)**: JS initialized successfully → `--app-height` was set → frozen at initial (shorter) height → white bar
- **State B (scroll effect fails, bar absent)**: JS initialization was delayed/failed → `--app-height` not yet set → CSS fallback `100svh` is used → browser's native viewport unit is correct → no bar

This confirms the root cause: the JS override is the problem, not the CSS fallback.

### Why it's site-wide

`useViewportHeight` runs once in `AppContent` (the shared wrapper around all routes in `App.tsx`), and every page's root container uses `min-h-screen-stable` which consumes this variable.

## Proposed Fix

The fix targets the `--app-height` calculation to account for Chrome/Edge iPad toolbar differences, while preserving the existing scroll-stability behavior:

1. **In `useViewportHeight.ts`**: Use `document.documentElement.clientHeight` or `window.visualViewport?.height` instead of `window.innerHeight`. `visualViewport.height` is more accurate on Chrome/Edge as it reflects the actual layout viewport excluding browser UI. Add a fallback chain: `visualViewport.height → documentElement.clientHeight → innerHeight`.

2. **In `index.css`**: Change the `html` background from white (`hsl(var(--background))`) to black, so that even if a tiny gap remains during transitions, it's invisible against dark page edges rather than showing a bright white bar. This is a defensive fallback.

3. **In `useViewportHeight.ts`**: After the initial set, add a single delayed re-measurement (e.g., 500ms) to catch Chrome/Edge toolbar settling, using the same width-stability guard to avoid scroll-triggered updates.

### Files to change
- `src/hooks/useViewportHeight.ts` — use `visualViewport.height`, add delayed re-measure
- `src/index.css` — change `html` background fallback color

### What stays the same
- The mobile freeze-on-scroll behavior (no scroll jank)
- The orientation change handler
- The desktop resize handler
- All page-level `min-h-screen-stable` usage
- The `.bg-layer-fixed` overscan system

