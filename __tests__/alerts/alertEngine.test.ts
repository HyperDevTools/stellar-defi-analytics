import { AlertEngine } from '@/lib/alerts/alertEngine';

describe('AlertEngine (#6)', () => {
  it('evaluates thresholds, enforces cooldowns, and logs alert history', async () => {
    const engine = new AlertEngine();
    await engine.addAlert({
      id: 'alert-1',
      name: 'XLM Above $0.15',
      type: 'price',
      target: 'XLM/USDC',
      comparison: 'above',
      threshold: 0.15,
      cooldownMs: 60_000,
      enabled: true,
      recurring: true,
    });

    const t0 = 1_700_000_000_000;
    expect(engine.evaluate('XLM/USDC', 'price', 0.14, t0)).toHaveLength(0);

    const fired1 = engine.evaluate('XLM/USDC', 'price', 0.16, t0);
    expect(fired1).toHaveLength(1);

    // Cooldown active 10s later -> does not re-fire
    expect(engine.evaluate('XLM/USDC', 'price', 0.18, t0 + 10_000)).toHaveLength(0);

    // After 61s cooldown -> fires again
    expect(engine.evaluate('XLM/USDC', 'price', 0.18, t0 + 61_000)).toHaveLength(1);
    expect(engine.getHistory()).toHaveLength(2);
  });
});
