import { execSync } from 'node:child_process';
import type { DailyCostData } from './types.js';

const CACHE_TTL_MS = 30_000;
let cache: DailyCostData | null = null;

export function parseDailyCostData(dailyJson: string): Omit<DailyCostData, 'fetchedAt'> {
  const data: { daily: Array<{ period: string; totalCost: number }>; totals: { totalCost: number } } = JSON.parse(dailyJson);
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = data.daily.find((d) => d.period === today);
  return {
    todayCost: todayEntry?.totalCost ?? 0,
    monthCost: data.totals?.totalCost ?? 0,
  };
}

function runCcusage(): DailyCostData | null {
  try {
    const dailyRaw = execSync('bunx ccusage daily --json', { timeout: 3000 }).toString();
    return { ...parseDailyCostData(dailyRaw), fetchedAt: Date.now() };
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
