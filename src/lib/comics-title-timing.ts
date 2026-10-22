export const COMICS_TITLE_PAUSE_MS = 1500;

export function shouldAutoAdvanceComicsTitle(
  section: number,
  alreadyVisited: boolean,
  popUpScene: boolean,
  scrollLocked: boolean,
  transitioning: boolean,
): boolean {
  return section === 1 && !alreadyVisited && popUpScene && scrollLocked && !transitioning;
}