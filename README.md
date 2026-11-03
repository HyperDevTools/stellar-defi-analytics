# Stellar DeFi Analytics 📊

An open-source analytics dashboard for Stellar DeFi protocols. Track liquidity pools, DEX volumes, lending protocols, and more with real-time data visualization.

## 🎯 Overview

Stellar DeFi Analytics provides comprehensive insights into the Stellar DeFi ecosystem:
- **Real-time Metrics**: Live data from Stellar DeFi protocols
- **Liquidity Tracking**: Monitor liquidity pools and LP positions
- **DEX Analytics**: Trade volumes, prices, and market depth
- **Protocol Metrics**: TVL, user counts, transaction volumes
- **Historical Data**: Charts and trends over time
- **Portfolio Tracking**: Track your DeFi positions across protocols

## 🚀 Features

- 📈 **Interactive Charts** - Powered by Recharts with responsive design
- 🔄 **Real-time Updates** - Live data with automatic refresh
- 🎨 **Modern UI** - Built with Next.js 14 and Tailwind CSS
- 📱 **Responsive** - Works seamlessly on desktop and mobile
- 🌐 **Multi-Protocol Support** - Aggregates data from multiple Stellar DeFi protocols
- 💾 **Data Export** - Export analytics data to CSV/JSON
- 🔍 **Search & Filter** - Find specific pools, tokens, or protocols quickly
- 🎯 **Custom Dashboards** - Create personalized views

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/HyperDevTools/stellar-defi-analytics.git
cd stellar-defi-analytics

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🔧 Configuration

Create a `.env.local` file in the root directory:

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Optional: RPC endpoints for faster data access
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Analytics Configuration
NEXT_PUBLIC_REFRESH_INTERVAL=30000
NEXT_PUBLIC_HISTORICAL_DAYS=30
```

## 📚 Usage

### Dashboard Overview

The main dashboard provides:
- Total Value Locked (TVL) across all protocols
- 24h trading volumes
- Top performing tokens
- Recent transactions
- Protocol breakdowns

### Liquidity Pools

View and analyze liquidity pools:
```typescript
import { useLiquidityPools } from '@/hooks/useLiquidityPools';

export default function PoolsPage() {
  const { pools, isLoading } = useLiquidityPools();

  return (
    <div>
      {pools.map(pool => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  );
}
```

### DEX Analytics

Track DEX trading activity:
```typescript
import { useDexVolume } from '@/hooks/useDexVolume';

export default function DexPage() {
  const { volume, history } = useDexVolume('24h');

  return (
    <VolumeChart data={history} totalVolume={volume} />
  );
}
```

### Portfolio Tracking

Monitor your DeFi positions:
```typescript
import { usePortfolio } from '@/hooks/usePortfolio';

export default function Portfolio() {
  const { positions, totalValue } = usePortfolio(walletAddress);

  return (
    <PortfolioSummary positions={positions} total={totalValue} />
  );
}
```

## 🏗️ Architecture

```
stellar-defi-analytics/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── pools/             # Liquidity pools pages
│   ├── dex/               # DEX analytics pages
│   └── portfolio/         # Portfolio tracking pages
├── components/            # React components
│   ├── charts/           # Chart components
│   ├── cards/            # Card components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── useLiquidityPools.ts
│   ├── useDexVolume.ts
│   └── usePortfolio.ts
├── lib/                  # Utility libraries
│   ├── stellar.ts       # Stellar SDK utilities
│   ├── api.ts           # API client
│   └── formatters.ts    # Data formatters
├── services/             # Data services
│   ├── horizon.ts       # Horizon API service
│   ├── soroban.ts       # Soroban RPC service
│   └── protocols/       # Protocol-specific services
└── types/               # TypeScript types
    ├── pool.ts
    ├── token.ts
    └── transaction.ts
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 🎨 Customization

### Adding New Protocols

1. Create a new service in `services/protocols/`:

```typescript
// services/protocols/myprotocol.ts
export class MyProtocolService {
  async getTVL(): Promise<number> {
    // Fetch TVL data
  }

  async getPools(): Promise<Pool[]> {
    // Fetch pools
  }
}
```

2. Register the protocol in `lib/protocols.ts`:

```typescript
import { MyProtocolService } from '@/services/protocols/myprotocol';

export const protocols = {
  myprotocol: new MyProtocolService(),
  // ... other protocols
};
```

### Custom Charts

Create custom charts using Recharts:

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export function CustomChart({ data }) {
  return (
    <LineChart data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run linter and tests
6. Submit a pull request

## 📋 Roadmap

- [ ] Lending protocol analytics
- [ ] Yield farming metrics
- [ ] Token price alerts
- [ ] Advanced charting (candlesticks, depth charts)
- [ ] Historical data export
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Social features (shared dashboards)
- [ ] API for third-party integrations

## 🔐 Security

- All data is read-only from public blockchain sources
- No private keys are stored or transmitted
- Wallet connections use standard Stellar wallet adapters
- Security audits welcome - please report issues responsibly

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🔗 Links

- [Live Demo](https://stellar-defi-analytics.vercel.app)
- [Documentation](https://hyperdevtools.github.io/stellar-defi-analytics)
- [Stellar DeFi Ecosystem](https://stellar.org/ecosystem)
- [Issue Tracker](https://github.com/HyperDevTools/stellar-defi-analytics/issues)

## 💬 Support

- Open an issue for bug reports or feature requests
- Join our community discussions
- Contribute to the codebase
- Star the repo if you find it useful!

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by HyperDevTools
