
# Two-Layer Crossfade System Implemented on Writing Page

## Problem Solved
When clicking a book thumbnail in the Writing page banner, a grey flash briefly appeared during the rapid scroll to the target section. This happened because multiple background images were transitioning their opacity simultaneously during the fast scroll.

## Solution Implemented

### 1. CSS Fallback Color
Added `background-color: #000` to `.bg-layer-fixed` in `src/index.css` to ensure black fallback instead of browser default grey.

### 2. Two-Layer Crossfade System
Replaced the 10+ individual background image layers with a two-layer A/B crossfade system (matching Music page pattern):

- **Layer A**: Current background (starts visible)
- **Layer B**: Next background (starts hidden)

When transitioning:
1. Put next image on hidden layer
2. Use double `requestAnimationFrame` to ensure paint
3. Crossfade by swapping opacities

### 3. State Changes
- Removed: `backgroundOpacities` object with 10+ keys
- Added: `layerA`, `layerB` state objects with `{ image, opacity, isBlack }`
- Added: `transitionBackground()` function for clean crossfades
- Added: `isBannerNavigatingRef` to suppress scroll handler during banner navigation
- Added: `currentBackgroundRef` to track current section and prevent duplicate transitions

### 4. Banner Click Handling
Updated `handleBookClick` to:
1. Set `isBannerNavigatingRef.current = true`
2. Immediately call `transitionBackground()` with target section
3. Clear flag after 700ms

### 5. Image Preloading
Converted the IntersectionObserver from lazy-loading individual layers to preloading/decoding images before they're needed.

## Files Modified
1. `src/index.css` - Added black fallback to `.bg-layer-fixed`
2. `src/pages/Writing.tsx` - Full two-layer crossfade refactor

## Expected Behavior
- Banner thumbnail clicks now trigger clean A→B crossfade
- No grey flash because: (a) black fallback, (b) only two layers ever visible
- Normal scrolling behavior unchanged with smooth crossfades
- Matches Music page behavior perfectly
