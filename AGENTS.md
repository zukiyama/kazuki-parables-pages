# Project architecture

- The home page’s major visual bands remain in normal document flow without timed entrance transforms, so scrolling never reveals artificial gaps.
- The home page’s content section and every banner inside it carry the `bg-ink-black` backing, and images that sit just below the hero are preloaded and decoded on mount — no light container colour may ever show through a band while scrolling.
- The About intro uses clipped copies of its original transparent handwriting artwork for a brisk line-by-line reveal synchronized to the hero background decode; reduced motion shows it immediately.
- The Comics opening keeps phones on their original sequence with the God of Lies cover as its feature image; tablet and desktop assemble trees around the title over one preloaded double-height Seoul panorama that pans from sky to hill road, with portrait/landscape framing isolated by orientation and a sky-blue fallback.
- The tablet/desktop panorama uses a single full-height mask synchronized with the reversible pan, keeping the background continuous across its two halves; the original lower cover gallery/modal and preserved temple/balloon artwork stay unchanged.
- Overlay controls that sit translucent on a panel's edge must never rely on a CSS `border` on that panel, because the line shows through them; the Young Adult slideshow draws its frame as separate edge segments with a gap where the arrow tabs sit, so keep the panel border-less and extend those segments if the tabs change size.
- The tablet/desktop Comics opening advances by an immediately available page-corner peel with fully opaque fold colors; its cue belongs to the clipped opening page so it turns away with the film, and wheel/swipe trigger the same turn without mapping live video to a mesh.
- The lower Comics panorama puts a nonshrinking six-cover row before the story copy with a fixed responsive gap; story length only grows downward so selections never reposition the covers.
