import { describe, expect, test } from "bun:test";
import { shouldRequestLandscape } from "./kazukilabs-launch";

describe("KazukiLabs phone orientation", () => {
  test("a playable landscape platformer requests landscape on a phone", () => {
    expect(shouldRequestLandscape({ url: "labs/lift-me-up.html", orientation: "landscape" }, true)).toBe(true);
  });

  test("AR Pet and desktop play never request landscape", () => {
    expect(shouldRequestLandscape({ url: "labs/holo-pet-7.html", orientation: "portrait" }, true)).toBe(false);
    expect(shouldRequestLandscape({ url: "labs/lift-me-up.html", orientation: "landscape" }, false)).toBe(false);
  });

  test("an unavailable coming-soon slot cannot trigger rotation", () => {
    expect(shouldRequestLandscape({ url: null, orientation: "landscape" }, true)).toBe(false);
  });
});
