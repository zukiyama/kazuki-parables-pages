import { describe, expect, test } from "bun:test";
import { RAMP_SECONDS, MIN_PLAYBACK_RATE, STOP_REMAINING_SECONDS, playbackRateForRemaining } from "./ease-out-playback";

describe("About video ease-out", () => {
  test("plays at normal speed until the final two seconds of footage begin", () => {
    expect(playbackRateForRemaining(5)).toBe(1);
    expect(playbackRateForRemaining(2)).toBe(1);
  });
  test("slows continuously, never below the browser minimum", () => {
    expect(playbackRateForRemaining(0.3)).toBeLessThan(1);
    expect(playbackRateForRemaining(0.1)).toBeLessThan(playbackRateForRemaining(0.3));
    expect(playbackRateForRemaining(0)).toBe(MIN_PLAYBACK_RATE);
  });
  test("stretches the final two source seconds into a smooth five-second landing", () => {
    let remaining = (RAMP_SECONDS / 3) - 1e-6;
    let elapsed = 0;
    const dt = 1 / 600;
    while (remaining > STOP_REMAINING_SECONDS) {
      remaining -= playbackRateForRemaining(remaining) * dt;
      elapsed += dt;
    }
    expect(elapsed).toBeGreaterThan(4.7);
    expect(elapsed).toBeLessThan(5.2);
  });
});
