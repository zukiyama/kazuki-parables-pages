

# Fix Grey Flash on Writing Page Banner Click Navigation

## Problem Summary
When clicking a book thumbnail in the Writing page banner, a grey flash briefly appears during the rapid scroll to the target section. This happens because multiple background images transition their opacity simultaneously during the fast scroll, and the underlying container has no fallback color set.

## Root Causes Identified

1. **No fallback background color**: The `.bg-layer-fixed` container doesn't have an explicit `background-color: black` set, so when all background images briefly have reduced opacity during transitions, the browser's default grey shows through.

2. **Scroll handler triggers rapid opacity changes**: During a fast `scrollTo`, the scroll event fires many times, each time updating `visibleSections` and recalculating `backgroundOpacities`. This causes multiple backgrounds to start/stop fading simultaneously rather than a clean A→B crossfade.

3. **Writing page uses single-layer opacity system vs Music page's two-layer crossfade**: The Music page explicitly manages `layerA` and `layerB` with proper sequencing, while Writing page just toggles opacity on individual images.

## Solution Strategy

A pragmatic, minimal-disruption fix that addresses the immediate symptom without rebuilding the entire background system:

### Phase 1: Add Fallback Background Color (Quick Fix)

Add `background-color: black` to the `.bg-layer-fixed` CSS class. This ensures that when all backgrounds are transitioning, the fallback is black (matching the site theme) rather than browser default grey.

**File:** `src/index.css`
```css
.bg-layer-fixed {
  /* existing styles... */
  background-color: #000; /* Fallback to black, not grey */
}
```

### Phase 2: Debounce Background Transitions During Banner Navigation

Add a flag to temporarily suppress the scroll-based background updates when a banner click triggers navigation. The target background should be set directly rather than letting the scroll handler "discover" it by firing repeatedly.

**File:** `src/pages/Writing.tsx`
- Add a ref `isBannerNavigatingRef` that is set `true` when a banner click happens
- The scroll handler's `setBackgroundOpacities()` logic should skip updates when this ref is true
- After scroll stabilizes (~500-700ms), clear the flag
- When banner click happens, immediately set the target section's background to opacity 1 and current background to 0, bypassing the scroll handler

**File:** `src/components/BookshelfMenu.tsx`  
- Pass a callback to Writing.tsx that includes the target section ID
- Writing.tsx uses this to immediately transition backgrounds

### Phase 3: Preload Target Background Before Fade (Optional Enhancement)

For an even smoother experience, decode the target background image before starting the opacity transition (similar to Music page's approach). This is optional since the Writing page already lazy-loads backgrounds via IntersectionObserver and they should already be loaded for any section the user has scrolled past.

## Technical Implementation Details

### Step 1: CSS Fallback Color
Add to `.bg-layer-fixed` in `src/index.css`:
```css
background-color: #000;
```

### Step 2: Banner Navigation Flag in Writing.tsx
```text
- Add: const isBannerNavigatingRef = useRef(false);
- In handleBookClick callback (passed to BookshelfMenu):
  1. Set isBannerNavigatingRef.current = true
  2. Immediately calculate target background key from bookId
  3. Set backgroundOpacities with only target = 1, all others = 0
  4. After 700ms, set isBannerNavigatingRef.current = false
- In the scroll handler (useEffect at ~line 537):
  - Add early return: if (isBannerNavigatingRef.current) return;
```

### Step 3: Update BookshelfMenu to Pass Target Section
The `onBookClick` callback already passes `bookId` and `slideToBook`. Writing.tsx can use this to determine which background to show immediately.

## Files to Modify

1. **`src/index.css`** - Add `background-color: #000` to `.bg-layer-fixed`
2. **`src/pages/Writing.tsx`** - Add banner navigation debounce logic

## Expected Outcome

- Banner thumbnail clicks will immediately crossfade from current background to target background
- No grey flash because: (a) fallback is now black, (b) backgrounds transition cleanly A→B instead of chaotic multi-way transitions
- Normal scrolling behavior remains unchanged
- Minimal code changes, low risk of side effects

## Alternative Considered (Not Recommended Now)

A full two-layer crossfade system like the Music page would be more robust but requires:
- Significant refactoring of how backgrounds are rendered
- Managing layerA/layerB state
- More complex coordination between scroll handler and banner clicks

The proposed solution achieves the same visual result with much less disruption to the existing, working code.

