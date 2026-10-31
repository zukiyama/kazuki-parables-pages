# Roadmap

- [x] Update only Cinematic: restore decoded three-picture slideshow with falling Parable title, shorten/crop KAIJU, shorten the two-thirds God of Lies band with Music beside it, and remove Storyteller. Browser checked manual navigation, wrapping, auto-advance, title animation and all three layout choices; hosted faces artwork remains unavailable in the sandbox.

- [x] Isolate oversized Burden artwork and inactive-slide hit regions without changing framing. Touch-enabled Chromium checked picture opening, viewer arrows, dismissal and page arrows through 1024×1366 → 1366×1024 → 1024×1366; original Burden framing visually checked, 14 tests pass, build OK. Physical iPad Safari remains unverified; persistent failure did not reproduce in simulation.

- [x] Balance The Burden's landscape letterboxing as browser space changes, and fill portrait framing with its right-hand artwork. Browser checked live resize/rotation at 1366×768, 1366×950, 1366×1024, 1024×1366 and 781×1000 with original artwork; equal 34.77px landscape borders and flush portrait boundaries. Short-landscape framing, other screens and phone sequence unchanged; 10 tests pass.

- [x] Remove the Burden caption year, lift its artwork a tiny bit more, and restore Coming 2027's previous uncropped equal-letterbox framing. Checked artwork and caption in browser with original uploads; equal 98px top/bottom gaps at 781×783, 7 tests pass, build OK.

- [x] Slightly lift The Burden artwork, fill the Coming 2027 frame with a leftward composition adjustment, and slightly lower the shelf heading. Visually checked at 781×783 and 1366×768 using original uploads; Coming frame aligns with header/footer, 7 carousel tests pass, build OK. Existing short-landscape Burden cropping remains.

- [x] Make The Burden edge-to-edge with header clearance; centre Coming 2027 equally between header and footer. Verified widths and equal gaps at 781×783, 1280×1800 and 1366×768; carousel loop and reader checks pass, 17 tests pass, build OK.

- [x] Add the sketch shelf background and final Coming 2027 image screen; fit The Burden clear of header/footer. Verified four-screen looping, five covers and reader at 1280×1800, 781×783 and 1366×768; 17 tests pass, build OK. Uploaded artwork visually checked by fulfilling hosted URLs with original uploads locally.

- [x] Swap shelf and screenplay positions; show the full-width uploaded Burden artwork with subtle status line and five evenly spaced shelf covers beneath a raised heading. Verified rightward looping, cover reader and shelf return restriction at 1280px and 781px; 17 tests pass. Artwork checked using the original upload to fulfil its hosted URL locally.

- [x] Allow enlarged God of Lies illustrations to close on viewport taps outside the picture without closing on arrow taps; verified browsing, picture/outside dismissal and restored page navigation.
- [x] Remove the About opening introductory sentence and enlarge both name lines to the biography column width; verified widths at 1280px, 781px and 390px.

- [x] Replace the About opening photograph with the uploaded silent video; preserve framing and biography, ramp playback down over the final two seconds to rest, and offer a still for reduced motion. Playback verified with locally fulfilled media; hosted delivery checked separately.

- [x] Replace the About opening background with the uploaded writer photograph; rearrange readable biography and portrait without covering its central figure. Checked four screen sizes and the music link using the original upload in browser tests; local CDN delivery returns HTML, so hosted image delivery remains unverified.

- [x] Investigate reported vertical arrow fade: browser could not reproduce opacity fading, including all ancestors. Added pre-paint travel reset and explicit full opacity while the lower page is inactive; verified fixed content-relative offset and full opacity across 30 vertical frames, with unchanged horizontal fades.
- [x] Allow reader dismissal outside the actual cover and synchronize cover, copy and backdrop reversal; verified text, outer-screen and cover taps, identical animation start times and 320ms duration, and return to shelf. Nine existing tests pass; build OK.

- [x] Restore arrows attached to the lower page throughout vertical movement, without an entrance fade; verified constant arrow-to-picture offset and opacity 1 across 30 frames at 1037×783, horizontal fades, shelf reader, story return and Writing exit. Remote gallery images remain unavailable in this preview.

- [x] Smooth lower slideshow motion and synchronize each arrow with the background directly beneath it; verified both directions and looping (gallery image loading unavailable in this preview).

- [x] Quicken the title auto-advance, centre the slideshow arrows vertically, and add touch-swipe-up plus cursor-at-top return on tablet/desktop.
- [x] Add the header emblem one-spin Easter egg matching the Music switcher; verify return navigation and unchanged phones.

- [x] Replace tablet/desktop lower vertical sections with a looping three-screen slideshow: Pendragon, God of Lies, six comics.
- [x] Add persistent triangular arrows and the footer; modernize shelf enlargement and slightly quicken the title timer.
- [x] Verify looping in both directions, picture dialogs, title return, and preserved phones.

- [x] Remove the local story halo; gently darken/brighten the panorama during travel and retain tight text shadows.
- [x] Auto-advance after one and a half seconds only on the first title arrival per Comics visit; verify returns and fresh visits.

- [x] Lower the panorama story and picture row; strengthen local text contrast.
- [x] Eliminate entrance flicker and slow title/cutout fades.
- [x] Remove picture highlights and close X; verify image/outside dismissal and return scrolling.

- [x] Replace the God of Lies carousel illustrations in the requested attachment order.
- [x] Verify smaller side pictures grow to their existing size centrally without cropping or moving the text.

- [x] Fade in the story during the pan, bring in side pictures and thumbnails together, and slightly shrink uncropped pictures with centre-dependent lighting.
- [x] Verify entrance timing, landscape proportions, centre lighting and reverse scrolling.
- [x] Preserve character sizes after returning from Pendragon and nudge the dog up/right.
- [x] Verify repeated return trips and both orientations.

- [x] Add the proportional bottom-anchored folding dog.
- [x] Add the frameless blurb/image carousel with partial neighbours and fading thumbnail selections.
- [x] Verify both orientations, carousel access, folding and unchanged phones.

- [x] Replace and substantially enlarge the title-screen characters without changing their fold.
- [x] Remove the panorama selector and restore only the lower-centred God of Lies blurb.
- [x] Verify spacing, folding, the lower blurb and unchanged separate gallery/phones.

- [x] Add the uploaded bottom-centred character cutout with a reversible pop-up fold and subtle title shading.
- [x] Verify title spacing, forward/reverse folding, and unchanged phones.

- [x] Restrict the dog ear to the opening page, including return scrolling.
- [x] Animate covers between a fixed six-cover bottom row and the enlarged left position, with subtle dashed empty slots.
- [x] Add a small “Back to God of Lies” text link and verify selections, return scrolling, and phone isolation.

- [x] Prevent image-loading and pressed-corner blue flashes.
- [x] Start the trees and title during the page turn.
- [x] Arrange fixed covers in two columns of three on the left, with story copy on the right.
- [x] Verify loading, page turning and every story in both orientations; preserve phones.

- [x] Show the opening corner immediately and give its reverse opaque paper shading.
- [x] Add the black handwritten “Cool stuff here” cue and arrow.
- [x] Fade a seamless full-panorama mask during both directions of travel.
- [x] Fix the six-cover row above the lower text, independent of story length.
- [x] Verify page turning, mask timing, cover stability and phone isolation.

- [x] Remove the rendered temple while preserving its asset.
- [x] Raise the God of Lies title and add the “Keep going” comic arrow prompt.
- [x] Place six interactive covers around the lower panorama blurb on tablet and desktop.
- [x] Swap the central blurb with quick fade-out/fade-in transitions and selected states.
- [x] Preserve the existing phone sequence and lower cover gallery/modal.
- [x] Verify portrait, landscape, phone, reverse scrolling, and all selections.
- [x] Enlarge the six panorama covers and tighten their spacing.
- [x] Add the uploaded God of Lies cover below the central blurb as its reset selector.
- [x] Sequence the side-cover entrances from top to bottom as the lower panorama arrives.
- [x] Replace the red selected frame with a natural neutral treatment.
- [x] Verify both orientations, reverse scrolling, selection/reset, and phone isolation.
- [x] Move the central God of Lies cover above the lower blurb and match the side-cover size.
- [x] Lower every active blurb within the road scene.
- [x] Restore off-screen staggered side entrances, fold in the central cover, and fade in a dark road mask.
- [x] Verify both orientations, reverse scrolling, story selection/reset, and phone isolation.
- [x] Match the Young Adult slideshow arrow tabs to the panel tone and keep them translucent.
- [x] Draw the slideshow frame in segments so no edge line shows through the tabs.
- [x] Verify the tabs over the writing page background.
- [x] Replace the Comics opening dissolve with a draggable/tappable page-corner turn.
- [x] Remove the opening prompt and the "Keep going" arrow.
- [x] Feather and delay the lower road mask.
- [x] Remove the central God of Lies cover; lay out six covers in one row below a raised blurb with equal spacing.
- [x] Replace the selection frame with a soft warm glow.

- [x] Replace the lower carousel with four evenly spaced enlarging pictures and a lower blurb; remove the panorama mask.
- [x] Enable touch-to-advance and fading title cutouts; verify enlargement, dismissal and return transitions.

- [x] Bring the lower slideshow arrows back the instant a slide is in place instead of waiting for the late settle; verify reappearance timing.

- [x] Remove the white frame from the God of Lies blurb pictures (thumbnails and enlarged view) so they look as they did before the zoom fix; keep the zoom fix itself intact.
