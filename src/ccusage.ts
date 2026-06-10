import { execSync } from 'node:child_process';
import type { DailyCostData } from './types.js';

const CACHE_TTL_MS = 30_000;
let cache: DailyCostData | null = null;

export function parseDailyCostData(dailyJson: string, summaryJson: string): Omit<DailyCostData, 'fetchedAt'> {
  const daily: Array<{ date: string; cost: number }> = JSON.parse(dailyJson);
  const summary: { totalCost: number } = JSON.parse(summaryJson);
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = daily.find((d) => d.date === today);
  return {
    todayCost: todayEntry?.cost ?? 0,
    monthCost: summary.totalCost ?? 0,
  };
}

function runCcusage(): DailyCostData | null {
  try {
    const dailyRaw = execSync('bunx ccusage daily --json', { timeout: 3000 }).toString();
    const summaryRaw = execSync('bunx ccusage --json', { timeout: 3000 }).toString();
    return { ...parseDailyCostData(dailyRaw, summaryRaw), fetchedAt: Date.now() };
  } catch {
    return null;
  }
}

export function getDailyCostData(): DailyCostData | null {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache;
  }
  const result = runCcusage();
  if (result) cache = result;
  return cache;
}
