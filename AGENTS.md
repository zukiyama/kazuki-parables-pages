# Project architecture

- The home page’s major visual bands remain in normal document flow without timed entrance transforms, so scrolling never reveals artificial gaps.
- The home page’s content section and every banner inside it carry the `bg-ink-black` backing, and images that sit just below the hero are preloaded and decoded on mount — no light container colour may ever show through a band while scrolling.
- The About intro uses clipped copies of its original transparent handwriting artwork for a brisk line-by-line reveal synchronized to the hero background decode; reduced motion shows it immediately.
- The Comics opening keeps phones on their original sequence with the God of Lies cover as its feature image; tablet and desktop reveal only a decoded priority-loaded double-height Seoul panorama, with portrait/landscape framing isolated by orientation.
- Keep the tablet/desktop panorama unmasked across both halves; the original lower cover gallery/modal and preserved temple/balloon artwork stay unchanged.
- Overlay controls that sit translucent on a panel's edge must never rely on a CSS `border` on that panel, because the line shows through them; the Young Adult slideshow draws its frame as separate edge segments with a gap where the arrow tabs sit, so keep the panel border-less and extend those segments if the tabs change size.
- The tablet/desktop Comics opening peel becomes available as soon as the underlying panorama decodes, uses opaque paper and a permanently transparent hotspot, and signals reveal progress to start the trees and title before completion; its clipped cue and wheel/swipe use the same turn without mapping live video to a mesh.
- The lower Comics panorama uses a fixed four-picture gallery above lower-centred story copy; its accessible enlargement dialog animates between the picture slot and the expanded image without reflow.
- The Comics peel overlay is visually hidden whenever the opening page is not shown, because accessibility hiding alone leaves the reflected flap visible after return scrolling.
- The title-screen characters, dog and trees share the opening reveal/title-section state so trees reverse their fold while the title, characters and dog fade on departure; and measured space beneath the title maintains bottom anchoring and proportional dog placement without overlap or phone changes.
- Rebind character sizing measurements whenever the pinned Comics pages return from Pendragon, because those pages unmount and their replacement elements otherwise lose the measured sizes.

- A tap on the tablet/desktop God of Lies title half advances through the existing section transition; never intercept taps in an image dialog.
