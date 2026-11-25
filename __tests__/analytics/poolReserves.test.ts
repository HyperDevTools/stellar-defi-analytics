/** @jest-environment node */

import { expect } from '@jest/globals';
import { GET as getTVLResponse } from '@/app/api/tvl/route';
import { getPoolReserveSnapshot } from '@/lib/poolReserves';
import { getAssetPrice, getNetworkPassphrase, getTVL } from '@/lib/stellar';

jest.mock('@stellar/stellar-sdk', () => ({
  Networks: {
    PUBLIC: 'Public Global Stellar Network ; September 2015',
    TESTNET: 'Test SDF Network ; September 2015',
  },
  Horizon: { Server: jest.fn() },
}));

const record = {
  id: 'a'.repeat(64),
  fee_bp: 30,
  total_shares: '1.1234567',
  reserves: [
    { asset: 'native', amount: '900719925474099.1234567' },
    { asset: 'USD:issuer', amount: '42.1000000' },
  ],
};

function horizon(records: unknown, passphrase = getNetworkPassphrase()): typeof fetch {
  return async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/liquidity_pools')) {
      expect(url.searchParams.get('limit')).toBe('10');
      return Response.json({ _embedded: { records } });
    }
    return Response.json({ network_passphrase: passphrase });
  };
}

describe('Horizon pool reserves', () => {
  it('preserves decimal amounts, network, source, and observation time', async () => {
    const snapshot = await getPoolReserveSnapshot(horizon([record]));
    expect(snapshot.status).toBe('available');
    if (snapshot.status !== 'available') throw new Error(snapshot.reason);

    expect(snapshot.source).toBe('Stellar Horizon');
    expect(snapshot.network).toMatch(/^(mainnet|testnet)$/);
    expect(new Date(snapshot.observedAt).toISOString()).toBe(snapshot.observedAt);
    expect(snapshot.pools).toEqual([record]);
  });

  it('reports an empty pool page separately from missing data', async () => {
    const snapshot = await getPoolReserveSnapshot(horizon([]));
    expect(snapshot).toMatchObject({ status: 'available', pools: [] });
  });

  it('rejects mismatched networks and malformed records', async () => {
    await expect(getPoolReserveSnapshot(horizon([record], 'another network'))).resolves.toMatchObject({
      status: 'unavailable',
      reason: expect.stringContaining('different Stellar network'),
    });
    await expect(getPoolReserveSnapshot(horizon([{ ...record, reserves: [] }]))).resolves.toMatchObject({
      status: 'unavailable',
      reason: expect.stringContaining('invalid pool page'),
    });
  });

  it('reports outages without substituting reserve amounts', async () => {
    const request: typeof fetch = async () => new Response(null, { status: 503 });
    await expect(getPoolReserveSnapshot(request)).resolves.toMatchObject({ status: 'unavailable' });
  });
});

describe('unavailable valuation', () => {
  it('reports unavailable USD TVL through the HTTP route', async () => {
    const response = await getTVLResponse();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      tvl: null,
      status: 'unavailable',
      reason: 'No USD valuation provider is configured.',
    });
  });

  it('returns no fabricated prices or USD totals', async () => {
    await expect(getTVL()).resolves.toMatchObject({ status: 'unavailable', value: null });
    await expect(getAssetPrice('USD', 'issuer')).resolves.toMatchObject({
      status: 'unavailable',
      value: null,
    });
  });
});
