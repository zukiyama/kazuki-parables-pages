import { expect, test } from "bun:test";
import { COMICS_LOWER_SCREENS, nextComicsScreen, nextGalleryPicture, paperArrowOverlap, shelfComics } from "./comics-slideshow";

test("enlarged gallery arrows browse only the three pictures and wrap both ways", () => {
  expect(nextGalleryPicture(0, 1)).toBe(1);
  expect(nextGalleryPicture(1, 1)).toBe(2);
  expect(nextGalleryPicture(2, 1)).toBe(0);
  expect(nextGalleryPicture(0, -1)).toBe(2);
});

test("right from God of Lies reaches the replacement screenplay then the shelf", () => {
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(1, 1)]).toBe("The Burden");
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(2, 1)]).toBe("Forthcoming comics");
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(3, 1)]).toBe("Coming 2027");
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(0, 1)]).toBe("God of Lies");
});
test("the white shelf excludes The Burden and retains the other five in order", () => {
  const titles = ["The Burden", "Mr. Miracle", "Soul-Tied", "Gods!", "Scripted", "Oranges are Made of Gold"];
  expect(shelfComics(titles.map(title => ({ title }))).map(comic => comic.title)).toEqual(titles.slice(1));
});
test("four screens loop in either direction", () => {
  expect(nextComicsScreen(3, 1)).toBe(0);
  expect(nextComicsScreen(0, -1)).toBe(3);
});

test("incoming white background reaches the right arrow before the left", () => {
  expect(paperArrowOverlap(900, 60, 930, 1930)).toEqual([50, 100]);
  expect(paperArrowOverlap(20, 60, 930, 1930)).toEqual([100, 100]);
});

test("departing white background uncovers each arrow at its own position", () => {
  expect(paperArrowOverlap(20, 60, -950, 50)).toEqual([0, 50]);
  expect(paperArrowOverlap(900, 60, -950, 50)).toEqual([0, 0]);
});

test("fully backed arrows are entirely black, including after carousel wrapping", () => {
  expect(paperArrowOverlap(20, 60, 0, 1000)).toEqual([0, 100]);
  expect(paperArrowOverlap(900, 60, 0, 1000)).toEqual([0, 100]);
});