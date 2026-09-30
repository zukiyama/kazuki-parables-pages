# Recompose the lower Comics panorama

## What will change

- Move the central God of Lies cover above the blurb and size it to match the six side covers.
- Lower the entire active blurb area into the lower portion of the road scene, keeping every selected comic’s text in the same position.
- Keep the God of Lies cover permanently centred at the top; it remains the control for returning to the original blurb.
- Make the six side covers enter from beyond the left and right viewport edges as the panorama scrolls down, staggered quickly from top row to bottom row.
- Give the central God of Lies cover the earlier pop-up-book fold motion instead of a side entrance.
- Fade a semi-transparent dark mask over the lower road scene during the transition so covers and text remain legible without an opaque text panel.
- Leave the phone sequence, preserved artwork, and original lower gallery/modal unchanged.

## Technical details

- Reorder the centre column so the reset cover precedes the changing story copy.
- Drive the dark mask and cover entrances from the existing lower-scene transition state, with reversible styles when scrolling upward.
- Use perspective and bottom-edge transform origin for the central cover’s fold-up motion.
- Retain reduced-motion behavior by showing the completed composition immediately.
- Verify tablet portrait and desktop/landscape entry, reverse scrolling, all story selections, reset behavior, and phone isolation.
