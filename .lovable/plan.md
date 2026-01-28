
# Fix Young Adult Slideshow Vertical Alignment (Widescreen Only)

## Problem
On ultra-wide devices (laptop/HDTV), the "To Fly" slide displays lower than the other two books because its longer blurb stretches the grid. The previous fix added a scrollbar (`overflow-y-auto`) which is not desired.

## Solution Strategy
Instead of constraining the blurb with scrollbars, allow the slideshow container to grow slightly to accommodate longer content. This ensures all three slides are vertically centered identically without any internal scrolling.

## Changes to YoungAdultSlideshow.tsx

### 1. Container: Fixed height to minimum height (line 189)
**Current:**
```
h-[calc(80vh)] flex flex-col
```
**New:**
```
min-h-[80vh] flex flex-col
```
This allows the container to be at least 80vh but grow if content requires more space.

### 2. Slides wrapper: Add min-h-0 for proper flex sizing (line 277)
**Current:**
```
className="flex w-full h-full"
```
**New:**
```
className="flex w-full h-full min-h-0"
```
This prevents flex overflow issues.

### 3. Individual slide wrapper: Add min-h-0 (line 287)
**Current:**
```
className="flex-shrink-0 w-full h-full"
```
**New:**
```
className="flex-shrink-0 w-full h-full min-h-0"
```

### 4. Content padding: Add min-h-0 (line 289)
The contentPadding div should also have min-h-0 for widescreen.

### 5. Grid: Add min-h-0 (line 290-292)
Add `min-h-0` to the grid container for widescreen.

### 6. Blurb column: Remove scrollbar, give more horizontal space (line 308)
**Current:**
```
${isWidescreen ? "flex flex-col justify-center max-h-[60vh] overflow-y-auto" : ""}
```
**New:**
```
${isWidescreen ? "flex flex-col justify-center min-h-0" : ""}
```
Remove the `max-h-[60vh]` and `overflow-y-auto` completely. Add `min-h-0` instead.

### 7. Widen blurb column for ultra-wide screens
Adjust the grid to give the text column more space on widescreen by changing grid column ratios. This allows the longer blurb to wrap into fewer lines.

**Update grid classes for widescreen:**
```
lg:grid-cols-[1fr_1.2fr]
```
This gives the blurb column 20% more width than the cover column.

## What Will NOT Change
- Mobile layout (unchanged)
- iPad/tablet layout (unchanged)  
- Non-widescreen desktop layout (unchanged)
- Scroll-snap behavior (the section may be slightly taller for "To Fly" but snap still works)
- Book cover sizes (unchanged)
- Font sizes (unchanged)
- Any other pages

## Expected Result
- All three slides vertically centered identically
- No scrollbars anywhere in the slideshow
- Full blurb always visible
- Container grows slightly when "To Fly" is displayed (if needed)
- Other devices completely unaffected
