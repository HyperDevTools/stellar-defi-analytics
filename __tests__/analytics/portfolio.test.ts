import {
  calculatePortfolioPerformance,
  calculateTimeWeightedReturn,
  computePortfolioFromTrades,
} from '@/lib/analytics/portfolio';

describe('Portfolio Performance & Historical P&L (#3)', () => {
  it('computes realized/unrealized P&L, ROI, and HODL benchmark outperformance', () => {
    const perf = computePortfolioFromTrades(
      [
        { asset: 'XLM', side: 'buy', quantity: 1000, price: 0.1, feeUSD: 0, timestamp: 1000 },
        { asset: 'XLM', side: 'sell', quantity: 500, price: 0.15, feeUSD: 0, timestamp: 2000 },
      ],
      { XLM: 0.2 },
      0.1,
      0.12,
    );

    expect(perf.realizedPnL).toBe(25);
    expect(perf.unrealizedPnL).toBe(50);
    expect(perf.totalPnL).toBe(75);
    expect(perf.benchmark.hodlRoi).toBe(20);
  });

  it('calculates Time-Weighted Return and async wallet summary', async () => {
    expect(calculateTimeWeightedReturn([0.1, 0.1])).toBe(21);
    const res = await calculatePortfolioPerformance('GABC123', new Date('2026-01-01T00:00:00Z'));
    expect(res.positions.length).toBeGreaterThanOrEqual(2);
  });
});
