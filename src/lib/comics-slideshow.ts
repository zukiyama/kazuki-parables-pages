export const COMICS_LOWER_SCREENS = ["Forthcoming comics", "God of Lies", "The Burden"] as const;

export function shelfComics<T extends { title: string }>(comics: T[]): T[] {
  return comics.filter(comic => comic.title !== "The Burden");
}

export function nextComicsScreen(current: number, direction: -1 | 1): number {
  return (current + direction + COMICS_LOWER_SCREENS.length) % COMICS_LOWER_SCREENS.length;
}

export function nextGalleryPicture(current: number, direction: -1 | 1): number {
  return (current + direction + 3) % 3;
}

// Percentage interval of an arrow currently backed by the moving paper slide.
export function paperArrowOverlap(arrowLeft: number, arrowWidth: number, paperLeft: number, paperRight: number): [number, number] {
  if (arrowWidth <= 0) return [0, 0];
  const clamp = (position: number) => Math.max(0, Math.min(100, (position - arrowLeft) / arrowWidth * 100));
  return [clamp(paperLeft), clamp(paperRight)];
}