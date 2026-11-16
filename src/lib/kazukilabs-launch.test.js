import { describe, expect, test } from "bun:test";
import { isArcadeQuitMessage, shouldRequestLandscape } from "./kazukilabs-launch";

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
