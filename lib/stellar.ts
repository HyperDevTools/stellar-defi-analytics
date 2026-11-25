import { Horizon, Networks } from '@stellar/stellar-sdk';

export const STELLAR_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';
export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ||
  (STELLAR_NETWORK === 'mainnet'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org');

export const server = new Horizon.Server(HORIZON_URL);

export function getNetworkPassphrase(): string {
  return STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
}

export async function getAccountBalances(publicKey: string) {
  const account = await server.loadAccount(publicKey);
  return account.balances;
}

export interface UnavailableMetric {
  status: 'unavailable';
  value: null;
  reason: string;
}

export async function getAssetPrice(
  assetCode: string,
  assetIssuer: string,
): Promise<UnavailableMetric> {
  return {
    status: 'unavailable',
    value: null,
    reason: `No price provider is configured for ${assetCode}:${assetIssuer}.`,
  };
}

export async function getTVL(): Promise<UnavailableMetric> {
  return {
    status: 'unavailable',
    value: null,
    reason: 'No USD valuation provider is configured.',
  };
}
