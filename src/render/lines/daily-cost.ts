import type { RenderContext } from '../../types.js';

function fmt(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function renderDailyCostLine(ctx: RenderContext): string | null {
  if (!ctx.config?.display?.showDailyCost) return null;
  if (!ctx.dailyCost) return null;
  const { todayCost, monthCost } = ctx.dailyCost;
  return `${fmt(todayCost)} / ${fmt(monthCost)}`;
}
