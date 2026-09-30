# God of Lies interactive cover experiment

## What will change
- Remove the temple from the rendered God of Lies panorama while keeping its image file untouched for easy restoration.
- Raise the God of Lies title and rule slightly on tablet and desktop.
- Add a hand-drawn “Keep going” prompt beneath the title: chalk-like lettering above a red comic-panel arrow with an offset ink shadow.
- Keep the existing trees, panorama movement, and phone sequence unchanged.
- Add the six existing comic covers to the lower street screen as two vertical groups of three, one on each side of the central text.
- Size and space the covers relative to the central text so the composition remains balanced in both tablet portrait and landscape layouts.
- Keep the existing six-cover section farther down the page as well.

## Interaction
- God of Lies remains selected when the street screen first appears.
- Selecting one of the six side covers will quickly replace the central title, description, tagline, and format line with that comic’s existing information.
- The outgoing text will fade out, then the selected comic’s text will fade in using the existing no-panel white text and dark halo treatment.
- Covers will show a clear selected state and work with touch, mouse, and keyboard.
- Covers in this new panorama arrangement will not open the existing enlargement modal; the original lower grid keeps its current modal behavior.

## Technical details
- Reuse the current comic data and cover assets; no image or old interaction code will be deleted.
- Keep this experiment behind the existing tablet/desktop panorama condition, so phone markup and behavior remain untouched.
- Use stable reserved dimensions for the two cover columns and the centre copy to prevent shifting when descriptions change.
- Use a short two-phase text swap rather than overlapping fades, avoiding the halo flicker previously seen during the panorama transition.
- Create the comic arrow as local artwork and preserve reduced-motion behavior by showing text changes immediately when motion is disabled.
- Verify the title screen, road screen, all six selections, original lower grid, reverse scrolling, and phone isolation in portrait and landscape.
