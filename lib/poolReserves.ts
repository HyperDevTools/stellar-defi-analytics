import {
  getNetworkPassphrase,
  HORIZON_URL,
  STELLAR_NETWORK,
} from '@/lib/stellar';

const POOL_LIMIT = 10;
const AMOUNT = /^\d+(\.\d{1,7})?$/;

interface Reserve {
  asset: string;
  amount: string;
}

interface PoolRecord {
  id: string;
  fee_bp: number;
  total_shares: string;
  reserves: Reserve[];
}

export type PoolReserveSnapshot =
  | {
      status: 'available';
      source: 'Stellar Horizon';
      network: 'mainnet' | 'testnet';
      observedAt: string;
      pools: PoolRecord[];
    }
  | { status: 'unavailable'; reason: string };

function isPool(record: unknown): record is PoolRecord {
  if (typeof record !== 'object' || record === null) return false;
  const pool = record as Partial<PoolRecord>;
  return (
    typeof pool.id === 'string' &&
    /^[a-f0-9]{64}$/i.test(pool.id) &&
    typeof pool.fee_bp === 'number' &&
    Number.isInteger(pool.fee_bp) &&
    pool.fee_bp >= 0 &&
    pool.fee_bp <= 10_000 &&
    typeof pool.total_shares === 'string' &&
    AMOUNT.test(pool.total_shares) &&
    Array.isArray(pool.reserves) &&
    pool.reserves.length === 2 &&
    pool.reserves.every(
      (reserve) =>
        reserve &&
        typeof reserve.asset === 'string' &&
        reserve.asset.length > 0 &&
        typeof reserve.amount === 'string' &&
        AMOUNT.test(reserve.amount),
    )
  );
}

export async function getPoolReserveSnapshot(
  request: typeof fetch = fetch,
): Promise<PoolReserveSnapshot> {
  try {
    const timeout = AbortSignal.timeout(8_000);
    const base = HORIZON_URL.endsWith('/') ? HORIZON_URL : `${HORIZON_URL}/`;
    const options = { signal: timeout, cache: 'no-store' } as const;
    const endpoint = new URL(`liquidity_pools?limit=${POOL_LIMIT}&order=desc`, base);
    const [root, pools] = await Promise.all([request(base, options), request(endpoint, options)]);
    if (!root.ok || !pools.ok) {
      return { status: 'unavailable', reason: 'Horizon could not return pool reserves.' };
    }

    const metadata = await root.json();
    if (metadata?.network_passphrase !== getNetworkPassphrase()) {
      return { status: 'unavailable', reason: 'Horizon reported a different Stellar network.' };
    }

    const body = await pools.json();
    const records: unknown = body?._embedded?.records;
    if (!Array.isArray(records) || records.length > POOL_LIMIT || !records.every(isPool)) {
      return { status: 'unavailable', reason: 'Horizon returned an invalid pool page.' };
    }

    return {
      status: 'available',
      source: 'Stellar Horizon',
      network: STELLAR_NETWORK,
      observedAt: new Date().toISOString(),
      pools: records,
    };
  } catch {
    return { status: 'unavailable', reason: 'Horizon could not return pool reserves.' };
  }
}
