import {
  calculateCompoundedApy,
  calculateImpermanentLoss,
  calculatePoolAnalytics,
  calculatePriceImpact,
} from '@/lib/analytics/pools';

describe('Pool Analytics (#1)', () => {
  it('calculates impermanent loss accurately for 2x price change (~ -5.719%)', () => {
    expect(calculateImpermanentLoss(1)).toBeCloseTo(0, 4);
    expect(calculateImpermanentLoss(2)).toBeCloseTo(-5.7191, 3);
  });

  it('calculates compounded APY and price impact', () => {
    const apy = calculateCompoundedApy(500, 500_000);
    expect(apy).toBeGreaterThan(36.5);
    expect(calculatePriceImpact(5_000, 500_000)).toBeCloseTo(1.9608, 3);
  });

  it('returns complete PoolAnalytics structure in < 200ms', async () => {
    const start = Date.now();
    const res = await calculatePoolAnalytics('XLM-USDC-001', '7d');
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(200);
    expect(res.apy.current).toBeGreaterThan(0);
    expect(res.impermanentLoss.historical).toHaveLength(7);
    expect(res.fees.breakdown).toHaveLength(3);
  });
});
