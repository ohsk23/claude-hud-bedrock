import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDailyCostData } from '../dist/ccusage.js';

test('parseDailyCostData: sums only claude model costs for today', () => {
  const today = new Date().toISOString().slice(0, 10);
  const dailyJson = JSON.stringify({
    daily: [
      {
        period: today,
        modelBreakdowns: [
          { modelName: 'claude-sonnet-4-6', cost: 1.0 },
          { modelName: 'gpt-5', cost: 99.0 },
        ],
      },
    ],
  });
  const result = parseDailyCostData(dailyJson);
  assert.equal(result.todayCost, 1.0);
});

test('parseDailyCostData: monthCost sums claude models across all days', () => {
  const dailyJson = JSON.stringify({
    daily: [
      { period: '2026-06-01', modelBreakdowns: [{ modelName: 'claude-haiku-4-5', cost: 2.0 }, { modelName: 'gpt-5', cost: 50.0 }] },
      { period: '2026-06-02', modelBreakdowns: [{ modelName: 'claude-sonnet-4-6', cost: 3.0 }] },
    ],
  });
  const result = parseDailyCostData(dailyJson);
  assert.equal(result.monthCost, 5.0);
});

test('parseDailyCostData: today not in daily → todayCost 0', () => {
  const dailyJson = JSON.stringify({
    daily: [{ period: '2026-01-01', modelBreakdowns: [{ modelName: 'claude-sonnet-4-6', cost: 1.0 }] }],
  });
  const result = parseDailyCostData(dailyJson);
  assert.equal(result.todayCost, 0);
});

test('parseDailyCostData: malformed JSON → throws', () => {
  assert.throws(() => parseDailyCostData('not-json'), /JSON/);
});
