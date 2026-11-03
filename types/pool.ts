export interface Pool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  reserveA: string;
  reserveB: string;
  totalLiquidity: string;
  volume24h: string;
  apy: number;
}

export interface Token {
  code: string;
  issuer: string;
  name?: string;
  icon?: string;
}

export interface LiquidityPosition {
  poolId: string;
  pool: Pool;
  liquidity: string;
  sharePercent: number;
  valueUSD: number;
}
