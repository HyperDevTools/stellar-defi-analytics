import {
  calculateRiskAdjustedScore,
  YieldAggregator,
} from '@/services/protocols/aggregator';

describe('YieldAggregator (#4)', () => {
  it('fetches opportunities across protocols and filters/sorts by risk-adjusted return', async () => {
    const agg = new YieldAggregator();
    const all = await agg.fetchAllOpportunities();
    expect(all.length).toBeGreaterThanOrEqual(3);
    expect(all[0].apy).toBeGreaterThanOrEqual(all[1].apy);

    const lowIl = await agg.getTopOpportunities({ maxIlRisk: 'low', sortBy: 'riskAdjusted' });
    expect(lowIl.every((o) => o.risk.impermanentLoss === 'low')).toBe(true);
    expect(calculateRiskAdjustedScore(lowIl[0])).toBeGreaterThan(0);
  });
});
