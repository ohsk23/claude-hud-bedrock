import { execSync } from 'node:child_process';
import type { DailyCostData } from './types.js';

const CACHE_TTL_MS = 30_000;
let cache: DailyCostData | null = null;

type DayEntry = {
  period: string;
  modelBreakdowns: Array<{ modelName: string; cost: number }>;
};

function claudeCost(entry: DayEntry): number {
  return (entry.modelBreakdowns ?? [])
    .filter((m) => m.modelName.toLowerCase().includes('claude'))
    .reduce((sum, m) => sum + m.cost, 0);
}

export function parseDailyCostData(dailyJson: string): Omit<DailyCostData, 'fetchedAt'> {
  const data: { daily: DayEntry[] } = JSON.parse(dailyJson);
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = data.daily.find((d) => d.period === today);
  return {
    todayCost: todayEntry ? claudeCost(todayEntry) : 0,
    monthCost: data.daily.reduce((sum, d) => sum + claudeCost(d), 0),
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
