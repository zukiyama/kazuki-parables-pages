export const COMICS_TITLE_PAUSE_MS = 800;

export function shouldAutoAdvanceComicsTitle(
  section: number,
  alreadyVisited: boolean,
  popUpScene: boolean,
  scrollLocked: boolean,
  transitioning: boolean,
  phone = false,
): boolean {
  // Phones show a "Swipe for more" cue instead of turning on their own.
  return !phone && section === 1 && !alreadyVisited && popUpScene && scrollLocked && !transitioning;
}