import { describe, expect, test } from "bun:test";
import { RAMP_SECONDS, MIN_PLAYBACK_RATE, playbackRateForRemaining } from "./ease-out-playback";

describe("About video ease-out", () => {
  test("plays at normal speed until the final two seconds of real time begin", () => {
    expect(playbackRateForRemaining(5)).toBe(1);
    expect(playbackRateForRemaining(0.67)).toBe(1);
  });
  test("slows continuously, never below the browser minimum", () => {
    expect(playbackRateForRemaining(0.3)).toBeLessThan(1);
    expect(playbackRateForRemaining(0.1)).toBeLessThan(playbackRateForRemaining(0.3));
    expect(playbackRateForRemaining(0)).toBe(MIN_PLAYBACK_RATE);
  });
  test("the slowdown lasts two seconds of real time", () => {
    let remaining = (RAMP_SECONDS / 3) - 1e-6;
    let elapsed = 0;
    const dt = 1 / 600;
    while (remaining > 0.02) {
      remaining -= playbackRateForRemaining(remaining) * dt;
      elapsed += dt;
    }
    expect(elapsed).toBeGreaterThan(1.7);
    expect(elapsed).toBeLessThan(2.3);
  });
});
