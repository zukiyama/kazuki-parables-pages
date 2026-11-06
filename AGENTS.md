# Project architecture
- Read music rules in src/components/music/AGENTS.md before edits there.
- Read Comics and Writing page rules in src/pages/AGENTS.md before edits there.

- The home page’s major visual bands remain in normal document flow without timed entrance transforms, so scrolling never reveals artificial gaps.
- Home is Cinematic only; outgoing slideshow artwork and title retain running animations inside the same dissolve layer, so skips never snap or remove text early.
- The home page’s content section and every banner inside it carry the `bg-ink-black` backing, and images that sit just below the hero are preloaded and decoded on mount — no light container colour may ever show through a band while scrolling.
- The About opening uses live biography beside a once-playing muted, smoothly slowing video and reduced-motion poster; keep its subject clear and phone copy below artwork. Fit each name line to the biography width after font loading and container resizing.
- Overlay controls that sit translucent on a panel's edge must never rely on a CSS `border` on that panel, because the line shows through them; the Young Adult slideshow draws its frame as separate edge segments with a gap where the arrow tabs sit, so keep the panel border-less and extend those segments if the tabs change size.


- All site media (images, video, audio, fonts) must be real files committed in the repo (src/assets or public); never use lovable-assets/.asset.json pointers or remote CDN storage, so the GitHub repo is fully self-contained.
- Widescreen desktop reserves scrollbar space (scrollbar-gutter: stable) so dialog scroll-locks never shift the page.
