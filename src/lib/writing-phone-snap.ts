export function isWritingPhone(width: number, height: number) {
  return Math.min(width, height) < 600;
}

export function writingPhoneTarget(sectionTop: number, topOffset: number) {
  return Math.max(0, sectionTop - topOffset);
}

// Proximity only: long entries remain freely scrollable rather than trapping readers.
export function shouldSettleWritingPhone(distance: number, contentHeight: number, availableHeight: number) {
  return contentHeight <= availableHeight + 2 && Math.abs(distance) > 2 && Math.abs(distance) <= Math.min(90, availableHeight * 0.12);
}