import test from 'node:test';
import assert from 'node:assert';
import { SpaceEraDate } from '../src/core.js';

test('V-2 Epoch Launch boundary maps to Year 1 SE Day 1', () => {
  const date = new SpaceEraDate(1947, 2, 20);
  assert.strictEqual(date.toPhase1(), 'Year 1 SE, Day 1 (Phase 1)');
  assert.strictEqual(date.toPhase2(), 'Year 1 SE, Day 1 (Phase 2)');
});

test('ISO string parser functions correctly', () => {
  const date = SpaceEraDate.fromIso('1947-02-20');
  assert.strictEqual(date.ceYear, 1947);
  assert.strictEqual(date.ceMonth, 2);
  assert.strictEqual(date.ceDay, 20);
});

test('Dual string output formats correctly', () => {
  const date = new SpaceEraDate(1947, 2, 20);
  assert.strictEqual(date.toDualString(), '0001 SE / 1947-02-20 CE');
});

test('Pax leap year rule calculation', () => {
  const leapDate = new SpaceEraDate(1952, 2, 20);
  assert.strictEqual(leapDate._isPaxLeapYear(6), true);
  assert.strictEqual(leapDate._isPaxLeapYear(5), false);
});
