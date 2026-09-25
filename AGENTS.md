# Project architecture

- The home page’s major visual bands remain in normal document flow without timed entrance transforms, so scrolling never reveals artificial gaps.
- The home page’s content section and every banner inside it carry the `bg-ink-black` backing, and images that sit just below the hero are preloaded and decoded on mount — no light container colour may ever show through a band while scrolling.