import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDailyCostData } from '../dist/ccusage.js';

test('parseDailyCostData: today cost from daily output', () => {
  const today = new Date().toISOString().slice(0, 10);
  const dailyJson = JSON.stringify([
    { date: today, cost: 0.42, inputTokens: 1000, outputTokens: 500 },
    { date: '2026-01-01', cost: 1.0, inputTokens: 2000, outputTokens: 1000 },
  ]);
  const summaryJson = JSON.stringify({ totalCost: 12.34 });
  const result = parseDailyCostData(dailyJson, summaryJson);
  assert.equal(result.todayCost, 0.42);
  assert.equal(result.monthCost, 12.34);
});

test('parseDailyCostData: today not in daily output → todayCost 0', () => {
  const dailyJson = JSON.stringify([
    { date: '2026-01-01', cost: 1.0, inputTokens: 2000, outputTokens: 1000 },
  ]);
  const summaryJson = JSON.stringify({ totalCost: 5.0 });
  const result = parseDailyCostData(dailyJson, summaryJson);
  assert.equal(result.todayCost, 0);
  assert.equal(result.monthCost, 5.0);
});

test('parseDailyCostData: malformed JSON → throws', () => {
  assert.throws(() => parseDailyCostData('not-json', '{}'), /JSON/);
});
