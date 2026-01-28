
# Fix YoungAdultSlideshow Vertical Alignment on Extra-Wide Screens

## Problem Analysis

The YoungAdultSlideshow displays three books (Professor Barnabas, Land is a Dream of the Sky, and To Fly). On your laptop connected to HDTV (likely 1920x1080 or wider), the book covers and text are not vertically centered consistently:

1. **"To Fly"** is positioned significantly lower than the other two books
2. **Professor Barnabas** and **Land is a Dream of the Sky** are also slightly lower than ideal
3. All three should be vertically centered within the slideshow container

### Root Cause

The widescreen layout uses several competing height/centering mechanisms:

1. **Container**: `h-[calc(80vh)]` - fixed viewport-relative height
2. **Content wrapper**: `flex-1 flex items-center` - flexbox centering
3. **Grid**: `h-full items-center` - tries to fill parent and center children
4. **Book covers**: `h-[calc(65vh)]` - fixed height that may overflow
5. **Text column**: `flex flex-col justify-center` - self-centering

On very wide displays (higher than the Lovable preview pane width), when the viewport is extremely wide, the combination of `h-[calc(80vh)]` container with `h-[calc(65vh)]` images leaves only 15vh for text. If text content varies between books or if the overall layout calculations differ, the vertical centering breaks.

The key issue: The grid uses `h-full` on widescreen, but the slides container uses `flex w-full h-full` which may not properly constrain the grid height. Each slide is `flex-shrink-0 w-full h-full` but without explicit height, the content can push the layout.

### Why It Only Affects Larger Widescreen

The Lovable preview has a smaller viewport width, which means:
- The `max-w-5xl` (1024px) container constraint is more relevant
- The `65vh` image height results in smaller absolute pixels
- There's more relative space for the layout to work correctly

On a full 1920px+ HDTV, the container has more room and the vh-based calculations produce larger absolute values that may cause overflow.

## Solution

Replace the vh-based sizing with a properly constrained flexbox layout that guarantees vertical centering regardless of screen width:

### Changes to `src/components/YoungAdultSlideshow.tsx`

1. **Container classes** (line 188-190): Keep `h-[calc(80vh)]` but ensure the inner content is properly centered

2. **Content padding** (line 192-194): The current `flex-1 flex items-center` is correct but needs the child grid to cooperate

3. **Grid layout** (line 290-292): Change from `h-full items-center` to proper centering without forcing full height

4. **Image classes** (line 197-199): Change from fixed `h-[calc(65vh)]` to a max-height constraint that allows proper centering:
   - Use `max-h-[calc(65vh)]` instead of `h-[calc(65vh)]`
   - Or use a responsive approach that caps the height relative to the container

5. **Book info column** (line 308): The `flex flex-col justify-center` is fine

### Specific Code Changes

**Container classes (widescreen)** - Keep the same:
```tsx
"relative w-full max-w-5xl mx-auto ... h-[calc(80vh)] flex flex-col"
```

**Content padding (widescreen)** - Add `justify-center`:
```tsx
"relative px-20 pt-8 md:px-16 lg:px-12 pb-10 ... flex-1 flex items-center justify-center"
```

**Grid layout** - Remove `h-full` which causes the grid to stretch and potentially misalign:
```tsx
// Change from:
${isWidescreen ? "h-full" : ""}
// To:
${isWidescreen ? "" : ""}  // Remove h-full on widescreen
```

**Image classes (widescreen)** - Change from fixed height to max-height:
```tsx
// Change from:
"h-[calc(65vh)] w-auto mx-auto object-contain rounded-lg shadow-lg"
// To:
"max-h-[calc(60vh)] w-auto mx-auto object-contain rounded-lg shadow-lg"
```

This ensures:
- All three book covers use the same max-height constraint
- The flexbox centering (`items-center`) can work properly without the grid forcing `h-full`
- Content is vertically centered in the available space regardless of text length variations

## Files to Modify

- `src/components/YoungAdultSlideshow.tsx`

## Expected Outcome

All three Young Adult books will be:
- Vertically centered within the slideshow container
- Aligned consistently with each other (same vertical position)
- Properly sized on both the Lovable preview and the larger HDTV display

The fix is targeted to widescreen only and will not affect mobile, tablet, or the iPad desktop site.
