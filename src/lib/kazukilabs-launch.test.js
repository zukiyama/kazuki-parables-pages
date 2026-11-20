import { describe, expect, test } from "bun:test";
import { getCabinetZoom, isArcadeQuitMessage, shouldRequestLandscape } from "./kazukilabs-launch";

describe("KazukiLabs fullscreen cabinet restoration", () => {
  test("returning to the same viewport reproduces the original cabinet zoom", () => {
    const layout = { left: 0, top: -200, screenLeft: 300, screenTop: 180, screenWidth: 400, screenHeight: 240 };
    const before = getCabinetZoom(layout, { width: 1000, height: 800 });
    expect(before).toBe("translate(-625px, -75px) scale(2.25)");
    // A different fullscreen viewport must not compound the previously applied zoom.
    expect(getCabinetZoom(layout, { width: 1400, height: 900 })).not.toBe(before);
    expect(getCabinetZoom(layout, { width: 1000, height: 800 })).toBe(before);
  });
});

describe("KazukiLabs phone orientation", () => {
  test("a playable landscape platformer requests landscape on a phone", () => {
    expect(shouldRequestLandscape({ url: "labs/lift-me-up.html", orientation: "landscape" }, true)).toBe(true);
  });

  test("the default game and desktop play never request landscape", () => {
    expect(shouldRequestLandscape({ url: "labs/kazuki-and-kizuki-embed.html", orientation: "portrait" }, true)).toBe(false);
    expect(shouldRequestLandscape({ url: "labs/lift-me-up.html", orientation: "landscape" }, false)).toBe(false);
  });

  test("an unavailable coming-soon slot cannot trigger rotation", () => {
    expect(shouldRequestLandscape({ url: null, orientation: "landscape" }, true)).toBe(false);
  });
});

describe("KazukiLabs in-game quit", () => {
  const origin = "https://example.com";
  const gameWindow = {};
  const event = { origin, source: gameWindow, data: { source: "kazuki-and-kizuki", type: "quit" } };

  test("the active game's Quit signal closes the cabinet", () => {
    expect(isArcadeQuitMessage(event, origin, gameWindow)).toBe(true);
  });

  test("Comet Cup's Quit signal closes the cabinet", () => {
    expect(isArcadeQuitMessage({ ...event, data: { source: "comet-cup", type: "quit" } }, origin, gameWindow)).toBe(true);
  });

  test("messages from another origin or window cannot close the game", () => {
    expect(isArcadeQuitMessage({ ...event, origin: "https://other.example" }, origin, gameWindow)).toBe(false);
    expect(isArcadeQuitMessage({ ...event, source: {} }, origin, gameWindow)).toBe(false);
    expect(isArcadeQuitMessage(event, origin, null)).toBe(false);
  });

  test("other messages and malformed data do not close the game", () => {
    for (const data of [null, "quit", {}, { source: "another-game", type: "quit" }, { source: "kazuki-and-kizuki", type: "ready" }]) {
      expect(isArcadeQuitMessage({ ...event, data }, origin, gameWindow)).toBe(false);
    }
  });
});
