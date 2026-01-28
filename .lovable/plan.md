
# Optimize Writing Page LCP and Image Loading

## Analysis

After comparing the Music and Writing pages, I found **three key differences** in their loading strategies that explain why Music loads marginally faster:

### 1. Missing HTML Preload for Writing Page
In `index.html`, the Writing page's LCP background (`school-background-montage.webp`) is only mentioned in a **comment** but not actually preloaded:
```html
<!-- Preload Writing page LCP background (school montage) - deferred via modulepreload strategy -->
<!-- Note: schoolBackground is the LCP candidate for /writing route -->
```

Meanwhile, the Music page has an actual preload link:
```html
<link rel="preload" href="/src/assets/flower-ep-background-new.webp" as="image" type="image/webp">
```

### 2. No Explicit Image Decoding
The Writing page uses `IntersectionObserver` for lazy loading but doesn't explicitly decode the initial background. The Music page uses:
```javascript
const img = new Image();
img.onload = async () => {
  await img.decode(); // Forces browser to fully prepare image
  imageCache.current.set(src, img);
};
```

### 3. No Hidden LCP Element
The Music page injects a hidden `<img>` element with `fetchpriority="high"` to signal to the browser that this is the LCP candidate. The Writing page doesn't do this.

## Proposed Changes

### 1. Add actual preload in index.html
Add a real preload link for the Writing page's school background (currently just a comment).

### 2. Add priority loading to Writing.tsx
Add the same pattern used by Music page:
- Create an `imageCache` ref to prevent garbage collection
- Use a `loadAndCacheImage` function with `img.decode()`
- Load `schoolBackground` immediately with high priority
- Use `requestIdleCallback` for remaining backgrounds (or keep existing IntersectionObserver)
- Add a hidden `<img>` element with `fetchpriority="high"` for the initial background

### Technical Changes

**index.html (line 29-30)**
```
Current:
<!-- Preload Writing page LCP background (school montage) - deferred via modulepreload strategy -->
<!-- Note: schoolBackground is the LCP candidate for /writing route -->

New:
<!-- Preload Writing page LCP background (school montage) -->
<link rel="preload" href="/src/assets/school-background-montage.webp" as="image" type="image/webp">
```

**src/pages/Writing.tsx**
- Add `imageCache` ref similar to Music page
- Add `backgroundsLoaded` state to delay showing the page until LCP is ready
- Create `loadAndCacheImage()` function that uses `img.decode()`
- Priority-load `schoolBackground` first, then defer remaining backgrounds
- Add hidden `<img>` element for `schoolBackground` with `fetchpriority="high"`, `loading="eager"`, `decoding="sync"`

## Expected Outcome

- Writing page initial background loads as fast as Music page
- Consistent image caching prevents re-downloading on route revisits
- LCP metric improves due to explicit priority hints
- No visual or behavioral changes to the page
