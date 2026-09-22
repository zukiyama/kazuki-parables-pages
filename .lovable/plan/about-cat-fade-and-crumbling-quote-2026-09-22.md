# About cat fade and crumbling quote

## Changes
- Keep the existing scroll trigger and the cat’s exact final position.
- Replace the cat’s slide-up movement with a fade-in tied to the same delayed trigger as the city.
- Split the “Gardens appear…” quote into individually animated characters without changing its typography or line layout.
- Start the crumble shortly before the cat fade finishes; letters will fall beyond the artwork in varied downward paths and rotations, then stay gone.
- Include the signature in the departing text group so the whole foreground quotation clears naturally.
- Preserve the phone layout, where the cat and this desktop/tablet quote are not shown.

## Technical details
- Use deterministic per-character animation variables so the effect feels random but renders consistently.
- Keep the existing 3.5-second cat fade; begin the crumble near its end.
- Add a reduced-motion fallback that removes the quote cleanly without tumbling letters.
- Verify the About page at tablet and desktop sizes and confirm the project remains healthy.
