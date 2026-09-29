# God of Lies motion cleanup

## What will change
- Remove every fade and blur transition from the God of Lies blurb.
- Treat the main paragraph, tagline, and format line as three stable rows.
- Slide those rows into place alternately from left, right, and left as the road screen arrives.
- Keep each row fully opaque throughout so the existing text halo never causes compositing flicker.
- Reverse the temple’s existing pop-up transform when leaving the title screen, folding it downward out of sight without fading.
- Keep the panorama movement, title entrance, text styling, shrine placement, and phone layout unchanged.

## Technical details
- Replace the parent blurb opacity transition with row-level transform transitions and staggered timing.
- Remove the obsolete word-reveal animation hooks from this blurb while preserving italics and wording.
- Change the temple’s lower-screen state to the same folded transform used before it opens, with opacity remaining fully visible during the fold.
- Add clipping at the scene boundary so the folded temple cannot flash after leaving the visible composition.
- Respect reduced-motion settings by showing the settled blurb immediately and hiding the temple on the lower screen without animation.
- Verify forward and reverse scrolling on tablet portrait, tablet landscape, and desktop; confirm phones remain unchanged.