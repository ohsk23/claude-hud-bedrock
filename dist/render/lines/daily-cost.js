function fmt(amount) {
    return `$${amount.toFixed(2)}`;
}
export function renderDailyCostLine(ctx) {
    if (!ctx.config?.display?.showDailyCost)
        return null;
    if (!ctx.dailyCost)
        return null;
    const { todayCost, monthCost } = ctx.dailyCost;
    return `${fmt(todayCost)} / ${fmt(monthCost)}`;
}
//# sourceMappingURL=daily-cost.js.map