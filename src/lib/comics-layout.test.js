import { describe, expect, test } from "bun:test";
import { getComicsLayout } from "./comics-layout";

describe("Comics zoom-safe layout", () => {
  test("preserves initial phone, tablet and desktop detection", () => {
    expect(getComicsLayout(390, 844, 1)).toEqual({ tabletPortraitStrip: false, landscapeStripHidden: false, popUpScene: true, phoneStack: true });
    expect(getComicsLayout(781, 783, 1)).toEqual({ tabletPortraitStrip: true, landscapeStripHidden: false, popUpScene: true, phoneStack: false });
    expect(getComicsLayout(1280, 900, 1)).toEqual({ tabletPortraitStrip: false, landscapeStripHidden: true, popUpScene: true, phoneStack: false });
    expect(getComicsLayout(781, 783, 2)).toEqual(getComicsLayout(781, 783, 1));
  });

  test("pinch zoom never replaces the tablet panorama with the phone page", () => {
    const tablet = getComicsLayout(781, 783, 1);
    expect(getComicsLayout(390, 391, 2, tablet)).toBe(tablet);
    expect(getComicsLayout(260, 261, 3, tablet)).toBe(tablet);
  });

  test("only phones (either orientation) get the stacked page", () => {
    expect(getComicsLayout(390, 844, 1).phoneStack).toBe(true);
    expect(getComicsLayout(844, 390, 1).phoneStack).toBe(true);
    expect(getComicsLayout(744, 1133, 1).phoneStack).toBe(false);
    expect(getComicsLayout(1024, 768, 1).phoneStack).toBe(false);
  });

  test("genuine unzoomed resize and rotation still update the presentation", () => {
    const tablet = getComicsLayout(781, 1000, 1);
    expect(getComicsLayout(1000, 781, 1, tablet)).toEqual({ tabletPortraitStrip: false, landscapeStripHidden: true, popUpScene: true, phoneStack: false });
    expect(getComicsLayout(390, 844, 1, tablet).popUpScene).toBe(true);
    expect(getComicsLayout(781, 783, 1, tablet).popUpScene).toBe(true);
  });
});