# API Documentation

This document provides detailed information about the components, hooks, and utilities available in Stellar DeFi Analytics.

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Types](#types)

## Components

### DashboardCard

A reusable card component for displaying dashboard metrics.

```typescript
import { DashboardCard } from '@/components/DashboardCard';

<DashboardCard
  title="Total Value Locked"
  value="$1,234,567"
  change={12.5}
  icon={<TrendingUpIcon />}
/>
```

**Props:**
- `title: string` - Card title
- `value: string | number` - Main value to display
- `change?: number` - Percentage change (optional)
- `icon?: ReactNode` - Icon element (optional)
- `loading?: boolean` - Loading state (optional)

### ProtocolCard

Displays information about a DeFi protocol.

```typescript
import { ProtocolCard } from '@/components/ProtocolCard';

<ProtocolCard
  name="Aquarius"
  tvl={5000000}
  volume24h={125000}
  apy={15.3}
  logo="/protocols/aquarius.png"
/>
```

**Props:**
- `name: string` - Protocol name
- `tvl: number` - Total Value Locked
- `volume24h: number` - 24-hour trading volume
- `apy: number` - Annual Percentage Yield
- `logo: string` - Logo image URL

### ChartContainer

Wrapper component for Recharts visualizations.

```typescript
import { ChartContainer } from '@/components/ChartContainer';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<ChartContainer title="Price History">
  <LineChart data={priceData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Line type="monotone" dataKey="price" stroke="#8884d8" />
  </LineChart>
</ChartContainer>
```

**Props:**
- `title: string` - Chart title
- `children: ReactNode` - Recharts components
- `loading?: boolean` - Loading state
- `error?: string` - Error message

### PortfolioTable

Displays portfolio holdings in a table format.

```typescript
import { PortfolioTable } from '@/components/PortfolioTable';

<PortfolioTable
  holdings={[
    { asset: 'XLM', amount: 1000, value: 100, change24h: 5.2 },
    { asset: 'USDC', amount: 500, value: 500, change24h: 0.1 },
  ]}
/>
```

**Props:**
- `holdings: Array<Holding>` - Array of holdings
- `sortBy?: 'asset' | 'value' | 'change'` - Sort column
- `onRowClick?: (holding: Holding) => void` - Row click handler

## Hooks

### useStellarAccount

Fetches and manages Stellar account data.

```typescript
import { useStellarAccount } from '@/hooks/useStellarAccount';

const { account, balances, loading, error, refresh } = useStellarAccount(publicKey);
```

**Parameters:**
- `publicKey: string` - Stellar account public key

**Returns:**
- `account: Account | null` - Account data
- `balances: Balance[]` - Account balances
- `loading: boolean` - Loading state
- `error: Error | null` - Error object
- `refresh: () => void` - Refresh function

### useProtocolData

Fetches DeFi protocol metrics.

```typescript
import { useProtocolData } from '@/hooks/useProtocolData';

const { protocols, tvlTotal, volume24h, loading } = useProtocolData();
```

**Returns:**
- `protocols: Protocol[]` - Array of protocols
- `tvlTotal: number` - Total TVL across all protocols
- `volume24h: number` - Total 24h volume
- `loading: boolean` - Loading state
- `error: Error | null` - Error object

### useLiquidityPools

Fetches liquidity pool data.

```typescript
import { useLiquidityPools } from '@/hooks/useLiquidityPools';

const { pools, loading, error } = useLiquidityPools();
```

**Returns:**
- `pools: LiquidityPool[]` - Array of liquidity pools
- `loading: boolean` - Loading state
- `error: Error | null` - Error object

### usePriceHistory

Fetches historical price data for an asset.

```typescript
import { usePriceHistory } from '@/hooks/usePriceHistory';

const { prices, loading } = usePriceHistory('XLM', '7d');
```

**Parameters:**
- `asset: string` - Asset code
- `period: '1d' | '7d' | '30d' | '1y'` - Time period

**Returns:**
- `prices: PricePoint[]` - Array of price points
- `loading: boolean` - Loading state
- `error: Error | null` - Error object

## Utilities

### formatCurrency

Formats a number as currency.

```typescript
import { formatCurrency } from '@/lib/format';

formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, 'EUR'); // "€1,234.56"
```

**Parameters:**
- `amount: number` - Amount to format
- `currency?: string` - Currency code (default: 'USD')

### formatPercent

Formats a number as percentage.

```typescript
import { formatPercent } from '@/lib/format';

formatPercent(0.1523); // "15.23%"
formatPercent(0.1523, 1); // "15.2%"
```

**Parameters:**
- `value: number` - Value to format (0.1523 = 15.23%)
- `decimals?: number` - Decimal places (default: 2)

### formatAddress

Formats a Stellar address for display.

```typescript
import { formatAddress } from '@/lib/format';

formatAddress('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
// "GXXXX...XXXX"
```

**Parameters:**
- `address: string` - Full Stellar address
- `chars?: number` - Characters to show on each end (default: 4)

### calculateAPY

Calculates Annual Percentage Yield.

```typescript
import { calculateAPY } from '@/lib/calculations';

calculateAPY(100000, 105000, 30); // 73.91% APY
```

**Parameters:**
- `principal: number` - Initial amount
- `current: number` - Current amount
- `days: number` - Number of days

**Returns:** `number` - APY as percentage

### fetchProtocolTVL

Fetches Total Value Locked for a protocol.

```typescript
import { fetchProtocolTVL } from '@/lib/api';

const tvl = await fetchProtocolTVL('aquarius');
```

**Parameters:**
- `protocolId: string` - Protocol identifier

**Returns:** `Promise<number>` - TVL in USD

## Types

### Protocol

```typescript
interface Protocol {
  id: string;
  name: string;
  logo: string;
  tvl: number;
  volume24h: number;
  apy: number;
  category: 'dex' | 'lending' | 'liquidity';
  url: string;
}
```

### LiquidityPool

```typescript
interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserves: {
    tokenA: number;
    tokenB: number;
  };
  totalShares: number;
  apy: number;
  volume24h: number;
  fees24h: number;
}
```

### PricePoint

```typescript
interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}
```

### Holding

```typescript
interface Holding {
  asset: string;
  amount: number;
  value: number;
  change24h: number;
  logo?: string;
}
```

## Error Handling

All API calls and hooks implement consistent error handling:

```typescript
const { data, error, loading } = useProtocolData();

if (error) {
  // Handle error
  console.error('Failed to fetch protocols:', error.message);
}

if (loading) {
  // Show loading state
  return <LoadingSpinner />;
}

// Use data
return <ProtocolList protocols={data} />;
```

## Rate Limiting

API calls are automatically rate-limited to prevent abuse:

- Maximum 60 requests per minute per endpoint
- Exceeded requests receive 429 status code
- Retry after header indicates when to retry

## Caching

SWR provides automatic caching with configurable options:

```typescript
const { data } = useSWR('/api/protocols', fetcher, {
  refreshInterval: 30000, // Refresh every 30 seconds
  dedupingInterval: 5000, // Dedupe requests within 5 seconds
  revalidateOnFocus: true, // Revalidate when window regains focus
});
```

## Contributing

When adding new components, hooks, or utilities, please:

1. Add TypeScript types/interfaces
2. Include JSDoc comments
3. Update this API documentation
4. Add unit tests
5. Include usage examples

For questions or issues, please open a GitHub issue.
