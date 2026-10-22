export const COMICS_LOWER_SCREENS = ["Surname Pendragon", "God of Lies", "Forthcoming comics"] as const;

export function nextComicsScreen(current: number, direction: -1 | 1): number {
  return (current + direction + COMICS_LOWER_SCREENS.length) % COMICS_LOWER_SCREENS.length;
}