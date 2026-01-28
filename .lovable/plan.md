

# Mobile Music Page Synchronization and Performance Fix

## Problem Analysis

After examining the code, I've identified **three issues** causing the sluggish behavior and desynchronization on mobile:

### Issue 1: Album Cover Has No Explicit Dimensions on Mobile

The main album cover image (lines 829-837) lacks `width` and `height` attributes:

```tsx
<img 
  src={selectedAlbum.cover} 
  alt={selectedAlbum.title}
  className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6..."
  // NO width/height attributes - browser must wait to compute layout
/>
```

On mobile, the browser must download and decode the image before it knows the dimensions, causing **layout shift** and **delayed rendering**. The background may finish its crossfade while the cover is still being laid out.

### Issue 2: `await img.decode()` Blocks the Main Thread on Slow Devices

The `handleAlbumSelect` function (lines 551-677) uses `await Promise.all([ensureImageLoaded(...)])` which waits for **full decode** before updating state:

```tsx
await Promise.all([
  ensureImageLoaded(album.background),
  album.cover ? ensureImageLoaded(album.cover) : Promise.resolve()
]);
// Only AFTER this does setSelectedAlbum happen
```

On desktop, decoding is fast. On mobile with slower CPUs/GPUs, `img.decode()` can take **200-500ms**, during which:
- The button press feels unresponsive (user thinks nothing happened)
- Everything waits for the slowest asset

### Issue 3: No Visual Feedback During Loading

When a user taps an album on mobile, there's no immediate visual acknowledgment that the selection is being processed. The delay between tap and response makes the site feel sluggish.

---

## Proposed Solution

### 1. Add Explicit Dimensions to Album Cover

Add `width` and `height` attributes to the album cover image so the browser reserves space immediately, preventing layout shift and allowing parallel rendering.

### 2. Optimistic UI Update with Graceful Crossfade

Instead of waiting for both images to fully decode before updating the UI:

1. **Immediately** update `selectedAlbum` when the user taps (optimistic update)
2. **Start** the background crossfade as soon as the background is in cache (don't wait for full decode if already cached)
3. Use a **shorter timeout fallback** (300ms) so mobile devices don't wait forever for slow decodes
4. Add the cover image to a **preload queue** on first page load so it's likely cached by the time users tap

### 3. Add Loading State Visual Feedback (Optional Enhancement)

Consider adding a subtle loading indicator or immediate highlight on the tapped album thumbnail to confirm the tap registered.

---

## Technical Changes

### File: `src/pages/Music.tsx`

**Change 1: Add dimensions to album cover image (around line 829)**

Add `width="800"` and `height="800"` to match the WebP dimensions, plus a loading state:

```tsx
<img 
  src={selectedAlbum.cover} 
  alt={selectedAlbum.title}
  width="800"
  height="800"
  loading="eager"
  className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6..."
/>
```

**Change 2: Refactor `handleAlbumSelect` for optimistic updates (around line 551)**

The current implementation:
```tsx
const handleAlbumSelect = async (albumId: number) => {
  // ... 
  await Promise.all([...]);  // Blocks UI for 200-500ms on mobile
  setSelectedAlbum(album);   // Only updates AFTER await completes
};
```

New implementation:
```tsx
const handleAlbumSelect = async (albumId: number) => {
  // 1. IMMEDIATELY update the selected album (optimistic UI)
  setSelectedAlbum(album);
  
  // 2. Check if images are already cached - if so, start transition immediately
  const bgCached = imageCache.current.has(album.background);
  const coverCached = !album.cover || imageCache.current.has(album.cover);
  
  if (bgCached && coverCached) {
    // Both cached - start crossfade immediately
    startCrossfade(album.background);
  } else {
    // Not cached - load with short timeout fallback for mobile
    const loadPromise = Promise.all([
      ensureImageLoaded(album.background),
      album.cover ? ensureImageLoaded(album.cover) : Promise.resolve()
    ]);
    
    // Race against a timeout - don't wait forever on slow mobile
    await Promise.race([
      loadPromise,
      new Promise(resolve => setTimeout(resolve, 300))
    ]);
    
    startCrossfade(album.background);
  }
};
```

**Change 3: Extract crossfade logic into helper function**

Move the layer-switching logic (currently inside `handleAlbumSelect`) into a separate `startCrossfade(backgroundSrc)` function to allow calling it from multiple code paths.

**Change 4: Preload all album covers on initial page load**

The current `requestIdleCallback` queue already includes covers, but we can prioritize them higher by loading covers before backgrounds for albums other than the initial one.

---

## Expected Outcome

| Before | After |
|--------|-------|
| Tap album -> 200-500ms delay -> both change at once | Tap album -> cover changes immediately -> background crossfades |
| No feedback during loading | Immediate visual response to tap |
| Layout shift when cover loads | Stable layout with reserved space |
| Feels sluggish on mobile | Feels responsive on mobile |

The trade-off is that the cover might update a split-second before the background finishes its crossfade, but this is **preferable** to the current behavior where nothing happens for half a second. Users perceive the site as faster when they get immediate feedback.

