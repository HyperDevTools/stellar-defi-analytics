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

export interface PoolAnalytics {
  apy: {
    current: number;
    day7: number;
    day30: number;
    day90: number;
    projected: number;
  };
  impermanentLoss: {
    current: number;
    historical: Array<{ timestamp: number; value: number }>;
    netVsFees: number;
  };
  fees: {
    total: number;
    perLpToken: number;
    breakdown: Array<{ period: string; fees: number; apr: number }>;
  };
  health: {
    liquidityDepth: number;
    volumeToLiquidityRatio: number;
    averagePriceImpact: number;
  };
}
