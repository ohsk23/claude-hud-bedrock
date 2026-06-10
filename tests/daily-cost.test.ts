import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderDailyCostLine } from '../dist/render/lines/daily-cost.js';
import type { RenderContext } from '../dist/types.js';

function makeCtx(override: Partial<RenderContext> = {}): RenderContext {
  return {
    stdin: {},
    transcript: { tools: [], skills: [], mcpServers: [], agents: [], todos: [] },
    claudeMdCount: 0,
    rulesCount: 0,
    mcpCount: 0,
    hooksCount: 0,
    sessionDuration: '',
    gitStatus: null,
    usageData: null,
    memoryUsage: null,
    config: { display: { showDailyCost: true } } as any,
    extraLabel: null,
    dailyCost: null,
    ...override,
  } as RenderContext;
}

test('renderDailyCostLine: formats today and month cost', () => {
  const ctx = makeCtx({
    dailyCost: { todayCost: 0.42, monthCost: 12.34, fetchedAt: 0 },
  });
  const result = renderDailyCostLine(ctx);
  assert.ok(result?.includes('$0.42'));
  assert.ok(result?.includes('$12.34'));
});

test('renderDailyCostLine: returns null when dailyCost is null', () => {
  const ctx = makeCtx({ dailyCost: null });
  assert.equal(renderDailyCostLine(ctx), null);
});

test('renderDailyCostLine: returns null when showDailyCost is false', () => {
  const ctx = makeCtx({
    dailyCost: { todayCost: 0.42, monthCost: 12.34, fetchedAt: 0 },
    config: { display: { showDailyCost: false } } as any,
  });
  assert.equal(renderDailyCostLine(ctx), null);
});

test('renderDailyCostLine: rounds to 2 decimal places', () => {
  const ctx = makeCtx({
    dailyCost: { todayCost: 0.1234, monthCost: 5.6789, fetchedAt: 0 },
  });
  const result = renderDailyCostLine(ctx);
  assert.ok(result?.includes('$0.12'));
  assert.ok(result?.includes('$5.68'));
});
