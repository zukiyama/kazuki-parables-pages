# Comics pop-up shrine transition

## What will change
- Keep every phone layout and interaction exactly as it is.
- On tablet portrait, tablet landscape, desktop, and widescreen, show a restrained bottom prompt only after the opening film finishes: “Scroll down for good stuff” with a downward arrow.
- Make the prompt clickable/tappable while retaining the existing wheel, trackpad, and swipe transition.
- Leave the current dissolve into the God of Lies title page and its content intact.
- During that first transition, assemble a pop-up-book forest scene from separate transparent layers: distant forest depth, left tree, right tree, and shrine.
- Animate each layer independently with folding, sliding, and slight rotation; trees remain partly offscreen, lean subtly inward, and preserve a broad central opening.
- Settle the layers into a complete shrine composition behind the existing God of Lies content.

## Visual direction
- Dark folklore manga / illustrated pop-up book, with inked edges, paper texture, deep forest greens, weathered wood, muted vermilion, and warm shrine light.
- The transition remains atmospheric rather than flashy, with staggered movement and natural easing.
- The supplied image is reference only; newly generated transparent artwork will be used.

## Technical details
- Use four independently generated transparent PNG assets, imported from the project.
- Expose the existing first-section advance action to the new prompt without changing scroll thresholds or later section behavior.
- Track video completion explicitly; the fallback final-frame image also permits the prompt.
- Scope the layered scene to widths above the existing phone breakpoint and use responsive portrait/landscape sizing.
- Respect reduced-motion preferences by showing the completed composition without folding transforms.
- Verify first-load playback, prompt timing, click/tap, wheel/swipe, and the finished layout across tablet portrait, tablet landscape, desktop, and an unchanged phone viewport.
