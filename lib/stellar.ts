import { Horizon, Networks } from '@stellar/stellar-sdk';

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;

export const server = new Horizon.Server(HORIZON_URL);

export function getNetworkPassphrase(): string {
  return NETWORK;
}

export async function getAccountBalances(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error('Error fetching account balances:', error);
    throw error;
  }
}

export async function getAssetPrice(assetCode: string, assetIssuer: string): Promise<number> {
  // Placeholder for asset price fetching logic
  // In a real implementation, this would fetch from a DEX or price oracle
  return 1.0;
}

export async function getTVL(): Promise<number> {
  // Placeholder for TVL calculation
  // In a real implementation, this would aggregate data from various protocols
  return 1000000;
}
