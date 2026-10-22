import { describe, expect, test } from "bun:test";
import { COMICS_TITLE_PAUSE_MS, shouldAutoAdvanceComicsTitle } from "./comics-title-timing";

describe("Comics first title arrival", () => {
  test("triggers slightly sooner than the original one and a half seconds", () => {
    expect(COMICS_TITLE_PAUSE_MS).toBe(1400);
  });
  test("advances only the first settled title arrival", () => {
    expect(shouldAutoAdvanceComicsTitle(1, false, true, true, false)).toBe(true);
    expect(shouldAutoAdvanceComicsTitle(1, true, true, true, false)).toBe(false);
  });
  test("never schedules while turning or on other pages", () => {
    expect(shouldAutoAdvanceComicsTitle(1, false, true, true, true)).toBe(false);
    for (const section of [0, 2, 3]) {
      expect(shouldAutoAdvanceComicsTitle(section, false, true, true, false)).toBe(false);
    }
  });
  test("preserves phones and ordinary scrolling", () => {
    expect(shouldAutoAdvanceComicsTitle(1, false, false, true, false)).toBe(false);
    expect(shouldAutoAdvanceComicsTitle(1, false, true, false, false)).toBe(false);
  });
});