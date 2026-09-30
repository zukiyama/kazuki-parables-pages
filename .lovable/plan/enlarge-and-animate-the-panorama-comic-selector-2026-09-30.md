# Enlarge and animate the panorama comic selector

## What will change
- Make all six side covers substantially larger and reduce the vertical and horizontal gaps, while keeping the central text readable in landscape and portrait tablet layouts.
- Add the uploaded **God of Lies** cover beneath the central text as a seventh selector that restores the original blurb.
- Animate the six side covers individually as the lower panorama arrives: top pair first, then middle pair, then bottom pair, each sliding inward from its own side in a quick sequence.
- Replace the red selected border with a quieter, tactile selected state using full colour, a slight lift/scale, and a soft neutral paper-toned edge/shadow.
- Preserve phone layouts, the original lower gallery/modal, and all currently unused artwork.

## Technical details
- Store the uploaded cover through the project asset flow and use it only for the new central reset control.
- Reuse the existing lower-screen open state so the entrance sequence reverses cleanly when scrolling back up and respects reduced-motion settings.
- Keep the central text swap behaviour and accessible pressed/focus states intact.
- Verify landscape desktop, portrait tablet, reverse scrolling, cover selection/reset, and phone isolation.
