import { expect, test } from "bun:test";
import { COMICS_LOWER_SCREENS, nextComicsScreen, nextGalleryPicture, paperArrowOverlap } from "./comics-slideshow";

test("enlarged gallery arrows browse only the three pictures and wrap both ways", () => {
  expect(nextGalleryPicture(0, 1)).toBe(1);
  expect(nextGalleryPicture(1, 1)).toBe(2);
  expect(nextGalleryPicture(2, 1)).toBe(0);
  expect(nextGalleryPicture(0, -1)).toBe(2);
});

test("Pendragon is left of the story and the six comics are right", () => {
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(1, -1)]).toBe("Surname Pendragon");
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(1, 1)]).toBe("Forthcoming comics");
});
test("three screens loop in either direction", () => {
  expect(nextComicsScreen(2, 1)).toBe(0);
  expect(nextComicsScreen(0, -1)).toBe(2);
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