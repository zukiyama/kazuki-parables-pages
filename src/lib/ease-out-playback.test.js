import { describe, expect, test } from "bun:test";
import { RAMP_SECONDS, MIN_PLAYBACK_RATE, STOP_REMAINING_SECONDS, playbackRateForRemaining } from "./ease-out-playback";

describe("About video ease-out", () => {
  test("plays at normal speed until the final two seconds of real time begin", () => {
    expect(playbackRateForRemaining(5)).toBe(1);
    expect(playbackRateForRemaining(RAMP_SECONDS / 3)).toBe(1);
  });
  test("slows continuously, never below the browser minimum", () => {
    expect(playbackRateForRemaining(0.3)).toBeLessThan(1);
    expect(playbackRateForRemaining(0.1)).toBeLessThan(playbackRateForRemaining(0.3));
    expect(playbackRateForRemaining(0)).toBe(MIN_PLAYBACK_RATE);
  });
  test("the slowdown lasts about two seconds of real time", () => {
    let remaining = (RAMP_SECONDS / 3) - 1e-6;
    let elapsed = 0;
    const dt = 1 / 600;
    while (remaining > STOP_REMAINING_SECONDS) {
      remaining -= playbackRateForRemaining(remaining) * dt;
      elapsed += dt;
    }
    expect(elapsed).toBeGreaterThan(1.85);
    expect(elapsed).toBeLessThan(2.15);
  });
});
