

## Diagnosis: White Bar on iPad Chromium Browsers

### Root Cause

The background layer and content/footer layer use **different height references**:

- **Background layer** (`.bg-layer-fixed` in CSS): Uses `position: fixed` with height `calc(var(--app-height, 100svh) + 240px)` — a JS-calculated value that stays frozen during scroll
- **Content/footer layer** (page root wrappers): Uses `min-h-screen-stable` which resolves to `var(--app-height, 100svh)` — same JS value

The problem: **`--app-height` is set once on load and only updates on orientation change** (per `useViewportHeight`). On iPad Chromium browsers (Chrome, Edge, Opera), when the browser bar collapses/expands, the actual visible viewport changes but `--app-height` stays stale. The content layer naturally flows to fill the document, but the fixed background layer remains at the stale height — causing them to fall out of sync.

Additionally, the root containers (`html`, `body`, `#root`) use `100dvh` which **does** change with browser bar state, creating a third competing reference.

### The Fix

**Pages affected**: Writing, Music (use `bg-layer-fixed`), Index, About, Comics (use inline backgrounds — less affected but root containers still matter).

1. **`.bg-layer-fixed` — switch to `dvh`-based height**
   - Change from `calc(var(--app-height) + 240px)` to `calc(100dvh + 240px)` with `100vh` fallback
   - This makes the background track the same dynamic viewport as the content layer
   - The 240px overscan already handles the browser bar height delta, so the background won't clip

2. **`.min-h-screen-stable` / `.h-screen-stable` — align to `dvh`**
   - Change these utilities to use `100dvh` (with `100vh` fallback) instead of `--app-height`
   - This ensures the content/footer layer uses the same reference as both the root containers and the background

3. **Keep `--app-height` for hero height** (`useHeroHeight` / `--hero-h`) where freeze-on-scroll is intentional — that's a different concern (preventing hero resize during scroll).

### Files to Change

- **`src/index.css`**: Update `.bg-layer-fixed`, `.h-screen-stable`, `.min-h-screen-stable` to use `100dvh` with `100vh` fallback, removing dependency on `--app-height` for layout sizing
- **`src/hooks/useViewportHeight.ts`**: Keep for `--app-height` as a secondary reference but it no longer drives layout-critical sizing

