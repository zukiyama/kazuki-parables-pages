import { expect, test } from "bun:test";
import { COMICS_LOWER_SCREENS, nextComicsScreen } from "./comics-slideshow";

test("Pendragon is left of the story and the six comics are right", () => {
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(1, -1)]).toBe("Surname Pendragon");
  expect(COMICS_LOWER_SCREENS[nextComicsScreen(1, 1)]).toBe("Forthcoming comics");
});
test("three screens loop in either direction", () => {
  expect(nextComicsScreen(2, 1)).toBe(0);
  expect(nextComicsScreen(0, -1)).toBe(2);
});