import { PriceStreamManager } from '@/lib/realtime/priceStream';

describe('PriceStreamManager (#2)', () => {
  it('connects, multiplexes subscriptions, and cleans up on unsubscribe', async () => {
    const mgr = new PriceStreamManager();
    await mgr.connect('wss://horizon.stellar.org');
    expect(mgr.isConnected()).toBe(true);

    const received: number[] = [];
    const unsub = mgr.subscribe('xlm/usdc', (u) => received.push(u.price));
    expect(mgr.getActiveStreamCount()).toBe(1);

    mgr.handleMessage({ pair: 'XLM/USDC', price: 0.125, change24h: 4.2, volume24h: 120000 });
    expect(received).toEqual([0.125]);

    unsub();
    expect(mgr.getActiveStreamCount()).toBe(0);
    mgr.disconnect();
    expect(mgr.isConnected()).toBe(false);
  });

  it('computes exponential reconnect backoff', () => {
    const mgr = new PriceStreamManager();
    expect(mgr.getReconnectBackoffMs(1000)).toBe(1000);
    expect(mgr.getReconnectBackoffMs(1000)).toBe(2000);
    expect(mgr.getReconnectBackoffMs(1000)).toBe(4000);
  });
});
