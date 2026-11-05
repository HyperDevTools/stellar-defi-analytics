export interface YieldOpportunity {
  protocol: string;
  poolId: string;
  tokenPair: string;
  apy: number;
  apr: number;
  rewards: Array<{
    token: string;
    amount: number;
    apr: number;
  }>;
  tvl: number;
  volume24h: number;
  risk: {
    impermanentLoss: 'low' | 'medium' | 'high';
    protocolRisk: 'audited' | 'unaudited';
    liquidityRisk: 'low' | 'medium' | 'high';
  };
  requirements: {
    minDeposit: number;
    lockupPeriod?: number;
  };
  url: string;
}

export interface OpportunityFilters {
  protocol?: string;
  asset?: string;
  maxIlRisk?: 'low' | 'medium' | 'high';
  sortBy?: 'apy' | 'riskAdjusted' | 'tvl';
}

export function calculateRiskAdjustedScore(opp: YieldOpportunity): number {
  const ilPenalty =
    opp.risk.impermanentLoss === 'low' ? 1.0 : opp.risk.impermanentLoss === 'medium' ? 0.8 : 0.6;
  const auditBonus = opp.risk.protocolRisk === 'audited' ? 1.0 : 0.7;
  const liqFactor =
    opp.risk.liquidityRisk === 'low' ? 1.0 : opp.risk.liquidityRisk === 'medium' ? 0.85 : 0.65;
  return Number((opp.apy * ilPenalty * auditBonus * liqFactor).toFixed(2));
}

const DEFAULT_OPPORTUNITIES: YieldOpportunity[] = [
  {
    protocol: 'Aquarius',
    poolId: 'aqua-xlm-usdc',
    tokenPair: 'XLM/USDC',
    apy: 18.4,
    apr: 16.8,
    rewards: [{ token: 'AQUA', amount: 25000, apr: 9.2 }],
    tvl: 4_250_000,
    volume24h: 980_000,
    risk: { impermanentLoss: 'medium', protocolRisk: 'audited', liquidityRisk: 'low' },
    requirements: { minDeposit: 10 },
    url: 'https://aqua.network/pools',
  },
  {
    protocol: 'Ultra Stellar',
    poolId: 'ultra-yxlm-xlm',
    tokenPair: 'yXLM/XLM',
    apy: 9.6,
    apr: 9.2,
    rewards: [{ token: 'yXLM', amount: 5000, apr: 5.1 }],
    tvl: 8_100_000,
    volume24h: 1_450_000,
    risk: { impermanentLoss: 'low', protocolRisk: 'audited', liquidityRisk: 'low' },
    requirements: { minDeposit: 1 },
    url: 'https://ultrastellar.com',
  },
  {
    protocol: 'StellarX',
    poolId: 'stellarx-eurc-usdc',
    tokenPair: 'EURC/USDC',
    apy: 12.1,
    apr: 11.4,
    rewards: [{ token: 'AQUA', amount: 12000, apr: 4.5 }],
    tvl: 2_300_000,
    volume24h: 510_000,
    risk: { impermanentLoss: 'low', protocolRisk: 'audited', liquidityRisk: 'medium' },
    requirements: { minDeposit: 50 },
    url: 'https://www.stellarx.com/amm',
  },
];

export class YieldAggregator {
  private opportunities: YieldOpportunity[];

  constructor(initialOpportunities: YieldOpportunity[] = DEFAULT_OPPORTUNITIES) {
    this.opportunities = initialOpportunities;
  }

  async fetchAllOpportunities(): Promise<YieldOpportunity[]> {
    return [...this.opportunities].sort((a, b) => b.apy - a.apy);
  }

  async getTopOpportunities(filters: OpportunityFilters = {}): Promise<YieldOpportunity[]> {
    const riskRank = { low: 1, medium: 2, high: 3 };
    let filtered = [...this.opportunities];

    if (filters.protocol) {
      const p = filters.protocol.toLowerCase();
      filtered = filtered.filter((o) => o.protocol.toLowerCase() === p);
    }
    if (filters.asset) {
      const a = filters.asset.toUpperCase();
      filtered = filtered.filter((o) => o.tokenPair.toUpperCase().includes(a));
    }
    if (filters.maxIlRisk) {
      const ceiling = riskRank[filters.maxIlRisk];
      filtered = filtered.filter((o) => riskRank[o.risk.impermanentLoss] <= ceiling);
    }

    const sortBy = filters.sortBy ?? 'apy';
    if (sortBy === 'riskAdjusted') {
      filtered.sort((a, b) => calculateRiskAdjustedScore(b) - calculateRiskAdjustedScore(a));
    } else if (sortBy === 'tvl') {
      filtered.sort((a, b) => b.tvl - a.tvl);
    } else {
      filtered.sort((a, b) => b.apy - a.apy);
    }

    return filtered;
  }
}
