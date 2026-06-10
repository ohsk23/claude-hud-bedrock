import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDailyCostData } from '../dist/ccusage.js';

test('parseDailyCostData: today cost from daily output', () => {
  const today = new Date().toISOString().slice(0, 10);
  const dailyJson = JSON.stringify({
    daily: [
      { period: today, totalCost: 0.42 },
      { period: '2026-01-01', totalCost: 1.0 },
    ],
    totals: { totalCost: 12.34 },
  });
  const result = parseDailyCostData(dailyJson);
  assert.equal(result.todayCost, 0.42);
  assert.equal(result.monthCost, 12.34);
});

test('parseDailyCostData: today not in daily output → todayCost 0', () => {
  const dailyJson = JSON.stringify({
    daily: [{ period: '2026-01-01', totalCost: 1.0 }],
    totals: { totalCost: 5.0 },
  });
  const result = parseDailyCostData(dailyJson);
  assert.equal(result.todayCost, 0);
  assert.equal(result.monthCost, 5.0);
});

test('parseDailyCostData: malformed JSON → throws', () => {
  assert.throws(() => parseDailyCostData('not-json'), /JSON/);
});
