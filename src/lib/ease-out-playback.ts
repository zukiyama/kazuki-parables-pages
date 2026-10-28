// Playback rate for a clip that plays normally, then smoothly decelerates over
// its final two seconds of real time so it comes to rest on the last frame.
//
// Rate falls as r(s) = (1 - s/T)^2 over real time s.
// point is c = (T/3)(1 - s/T)^3, so r = (3c/T)^(2/3): a function of the
// remaining content time only, which keeps the ramp self-correcting.

export const RAMP_SECONDS = 2.6; // model length; with the rate floor the visible slowdown lasts ~2s of real time
export const MIN_PLAYBACK_RATE = 0.0625; // lowest rate browsers accept reliably
export const STOP_REMAINING_SECONDS = 0.01;

export function playbackRateForRemaining(remainingContentSeconds: number): number {
  if (remainingContentSeconds <= 0) return MIN_PLAYBACK_RATE;
  const rate = Math.pow((3 * remainingContentSeconds) / RAMP_SECONDS, 2 / 3);
  return Math.max(MIN_PLAYBACK_RATE, Math.min(1, rate));
}
