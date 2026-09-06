import test from 'node:test';
import assert from 'node:assert';

test('GET /api/v1/health returns correct status and uptime', async () => {
  const res = await fetch('http://localhost:3000/api/v1/health');
  const data = await res.json();
  
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(typeof data.uptime, 'number');
});

test('GET /api/v1/ce/2026-09-05 returns accurate Space Era conversion', async () => {
  const res = await fetch('http://localhost:3000/api/v1/ce/2026-09-05');
  const data = await res.json();
  
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.phase1, 'Year 80 SE, Day 167 (Phase 1)');
  assert.strictEqual(data.phase2, 'Year 80 SE, Day 175 (Phase 2)');
});

test('GET /api/v1/ce/2026-02-30 returns 422 for out-of-bounds date', async () => {
  const res = await fetch('http://localhost:3000/api/v1/ce/2026-02-30');
  const data = await res.json();
  
  assert.strictEqual(res.status, 422);
  assert.ok(data.error.includes('Day out of bounds'));
});

test('GET /api/v1/ce/2026-9-5 returns 400 for invalid format', async () => {
  const res = await fetch('http://localhost:3000/api/v1/ce/2026-9-5');
  const data = await res.json();
  
  assert.strictEqual(res.status, 400);
  assert.ok(data.error.includes('Invalid date format'));
});
