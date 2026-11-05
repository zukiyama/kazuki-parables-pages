import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('./writing-phone-snap.ts', import.meta.url), 'utf8')
  .replace(/: number/g, '').replace(/export function/g, 'function');
const { isWritingPhone, writingPhoneTarget, shouldSettleWritingPhone } = new Function(`${source}; return { isWritingPhone, writingPhoneTarget, shouldSettleWritingPhone };`)();
test('phone experiment excludes tablets in both orientations', () => {
  assert.equal(isWritingPhone(390, 844), true);
  assert.equal(isWritingPhone(844, 390), true);
  assert.equal(isWritingPhone(781, 783), false);
  assert.equal(isWritingPhone(1024, 1366), false);
});
test('menu places entire entry below the header and shelf', () => {
  assert.equal(writingPhoneTarget(1000, 176), 824);
  assert.equal(writingPhoneTarget(100, 176), 0);
});
test('settling is gentle proximity, not forced page turns', () => {
  assert.equal(shouldSettleWritingPhone(50, 600, 668), true);
  assert.equal(shouldSettleWritingPhone(150, 600, 668), false);
  assert.equal(shouldSettleWritingPhone(1, 600, 668), false);
});
test('oversized content never snaps away while being read', () => {
  assert.equal(shouldSettleWritingPhone(40, 800, 668), false);
});