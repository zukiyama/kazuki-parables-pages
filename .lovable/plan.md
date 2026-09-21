# Comics opening video

## What will change
- Replace only the first Comics & Scripts screen with the uploaded eight-second video.
- Remove the existing opening title, subtitle, line, background image, and “Scroll to explore” prompt.
- Present the video edge-to-edge within the existing opening screen, centered on a black background so its wide frame remains uncropped on narrower screens.
- Autoplay silently and inline with no controls or looping; when playback finishes, leave the final frame visible.
- Keep the existing swipe/scroll progression into all later Comics sections unchanged.

## Technical details
- Store the uploaded MP4 through the project asset flow and load it as the first-screen priority visual.
- Use `preload="auto"`, `muted`, and `playsInline` for reliable mobile autoplay.
- Remove the opening image import after it is no longer used, while leaving every later asset and transition untouched.
- Verify the first screen and progression at desktop and mobile-sized viewports, then confirm the project build remains clean.
