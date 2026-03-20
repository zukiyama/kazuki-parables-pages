

## Investigation Results

### Root Cause: Two Compounding Problems

**Problem 1: Wrong CSS fallback chain order**

The `.h-screen-stable` and `.min-h-screen-stable` utilities use this cascade:
```css
height: 100vh;      /* large viewport on some browsers */
height: 100dvh;     /* dynamic — correct on Chrome/Edge iPad */
height: 100svh;     /* OVERRIDES dvh — this is SMALLER, causes the gap */
height: var(--app-height, 100svh);  /* set from innerHeight — also small */
```

On Safari iPad, `100svh` ≈ `100dvh` ≈ `100vh` because Safari handles them similarly. But on Chrome/Edge iPad, `100svh` is genuinely shorter than the actual visible viewport (it's the "small viewport" = viewport with all browser UI visible). This makes the page content shorter than the screen, revealing the white background behind it.

**Problem 2: White html/body background**

The `--background` CSS variable is `0 0% 100%` (white). When the page content is too short, the white `html`/`body` background shows through as the white bar.

**Problem 3: `--app-height` uses `window.innerHeight`**

The `useViewportHeight` hook sets `--app-height` from `window.innerHeight`, which on Chrome/Edge iPad may report the small viewport height, reinforcing the gap.

**Why the landing hero is too short on Chrome:** The hero uses `h-[calc(var(--hero-h,100dvh)-56px)]` where `--hero-h` comes from `visualViewport.height` or `innerHeight`. On Chrome iPad this is the smaller value, making the hero not fill the screen.

### Plan

**1. Fix the CSS fallback chain in `src/index.css`**

Reorder the height utilities so `100dvh` comes LAST (after `100svh`), because `dvh` is the most accurate on Chrome/Edge iPad. Remove `100svh` from the chain since it's the problematic unit:

```css
.h-screen-stable {
  height: 100vh;
  height: 100dvh;
  height: var(--app-height, 100dvh);
}
.min-h-screen-stable {
  min-height: 100vh;
  min-height: 100dvh;
  min-height: var(--app-height, 100dvh);
}
```

Also update `.bg-layer-fixed` overscan to use `100dvh` as the preferred unit.

**2. Make html/body background dark instead of white**

Change the `html` and `body` `background-color` from `hsl(var(--background))` (white) to `#000` (black). This way any viewport gap is invisible (black on black) rather than a white bar. Individual pages already set their own background colors over their entire content area.

**3. Fix `--hero-h` to prefer `100dvh` on Chrome/Edge**

Update `useHeroHeight.ts` to use `100dvh` via CSS as the fallback in the hero calc, and use `window.visualViewport.height` (which is more accurate on all iPad browsers) as the JS-set value. Already does this — just ensure the CSS fallback in Index.tsx also uses `100dvh` instead of relying solely on the JS variable.

**4. Update `--app-height` default in `:root`**

Change the CSS default from `100svh` to `100dvh`:
```css
:root { --app-height: 100dvh; }
```

### Files to Change

- **`src/index.css`**: Fix fallback chain order (remove `100svh` from stable height utilities, use `100dvh` as preferred), change html/body background to `#000`, update `--app-height` default
- **`index.html`**: Ensure inline `body`/`#root` styles use dark background fallback consistently

### Why This Won't Break Safari

Safari on iPad treats `100dvh` ≈ `100svh` ≈ `100vh` nearly identically, so reordering these has no visible effect. The `--app-height` JS variable still takes priority when set. The dark body background is invisible behind page content on all browsers.

