import test from 'node:test';
import assert from 'node:assert/strict';
import { data, quantities, layout, isEligible, scaleDomain, outerPositions } from '../dist/model.js';
test('all quantities distinguish known zero, unknown, and inapplicable', () => {
  assert.equal(data.length, 30);assert.equal(new Set(data.map(p => p.id)).size, 30);
  for (const p of data) for (const q of Object.keys(quantities)) {
    const v = p.values[q];assert.ok(['known', 'unknown', 'na'].includes(v.status));
    if (v.status === 'known') assert.ok(Number.isFinite(v.value));else assert.equal(v.value, undefined);
  }
  assert.ok(isEligible(data.find(p => p.id === 'p13'), 'price', 'weight'));
  assert.ok(!isEligible(data.find(p => p.id === 'p14'), 'price', 'weight'));
  assert.ok(!isEligible(data.find(p => p.id === 'p05'), 'price', 'weight'));
});
test('all 36 axis pairs preserve every point, fit values, and keep outer slots stable', () => {
  for (const [w, h] of [[1280, 760], [744, 650], [390, 640], [390, 400], [320, 240], [320, 200], [844, 280]]) {
    const slots = outerPositions(w, h);
    for (const x of Object.keys(quantities)) for (const y of Object.keys(quantities)) {
      const result = layout(w, h, x, y);assert.equal(result.positions.length, 30);
      for (const p of result.positions) {
        assert.ok(p.x > 5 && p.x < w - 5 && p.y > 5 && p.y < h - 5, `${w}x${h} ${x}/${y} ${p.id} is visible`);
        const datum = data.find(d => d.id === p.id);
        if (!p.central) { assert.equal(p.x, slots.get(p.id).x);assert.equal(p.y, slots.get(p.id).y); }
        else for (const [key, domain] of [[x, result.xDomain], [y, result.yDomain]]) {
          assert.ok(datum.values[key].value >= domain.min && datum.values[key].value <= domain.max);
        }
      }
      for (let a = 0; a < 30; a++) for (let b = a + 1; b < 30; b++) {
        const p = result.positions[a], q = result.positions[b];
        assert.ok(Math.hypot(p.x - q.x, p.y - q.y) >= 9.2, `${w}x${h} ${x}/${y} overlap ${p.id}/${q.id}`);
      }
    }
  }
});
test('automatic domains include zero, single values, extreme values and negatives', () => {
  for (const values of [[0], [8], [.000001, .000003], [0, 1e12], [-500, 600], [-2]]) {
    const d = scaleDomain(values);assert.ok(d.max > d.min);
    for (const v of values) assert.ok(d.min <= v && d.max >= v);
  }
  assert.equal(scaleDomain([]), null);
});
