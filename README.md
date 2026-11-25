# Stellar DeFi Analytics 📊

[![CI](https://github.com/HyperDevTools/stellar-defi-analytics/actions/workflows/ci.yml/badge.svg)](https://github.com/HyperDevTools/stellar-defi-analytics/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub issues](https://img.shields.io/github/issues/HyperDevTools/stellar-defi-analytics)](https://github.com/HyperDevTools/stellar-defi-analytics/issues)
[![GitHub stars](https://img.shields.io/github/stars/HyperDevTools/stellar-defi-analytics)](https://github.com/HyperDevTools/stellar-defi-analytics/stargazers)

A read-only dashboard for inspecting classic Stellar liquidity pool reserves from Horizon.

**Documentation site:** [Stellar DeFi Analytics field guide](https://hyperdevtools.github.io/stellar-defi-analytics/)

> The dashboard reads Stellar liquidity pool reserves from Horizon. USD TVL and asset prices show an unavailable state until a valuation provider is configured. Portfolio calculations and price-stream modules remain experimental.

**Version:** 0.1.0 | [Changelog](CHANGELOG.md) | [API Docs](API.md)

## Overview

- Inspect up to ten Stellar liquidity pools on testnet or mainnet, including raw reserve amounts, issued shares, and fees.
- See the network reported by Horizon and the time the application read the pool snapshot.
- Export caller-supplied transactions as CSV, JSON, or tax CSV. Empty inputs produce an empty JSON array or CSV headers without transaction rows.

## Installation

Use Node.js 22.12 or newer.

```bash
git clone https://github.com/HyperDevTools/stellar-defi-analytics.git
cd stellar-defi-analytics
npm ci
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Configuration

The default is Stellar testnet. Copy `.env.example` to `.env.local` to select a different network or use a custom Horizon endpoint.

## Verify the dashboard

1. Start the app with `npm run dev` and open `/dashboard`.
2. In **Liquidity pool reserves**, check the network, observation time, and amounts denominated in each pool's assets. Testnet can return an empty pool page.
3. To inspect mainnet, set `NEXT_PUBLIC_STELLAR_NETWORK=mainnet`. Remove a testnet Horizon override or set it to `https://horizon.stellar.org`, then restart the app.
4. Visit `/api/tvl`. It returns `tvl: null` and `status: "unavailable"` until a USD provider is available.

The current dashboard reports one page of classic Stellar liquidity pools. Its reserves are in asset units. Aggregated USD valuations, protocol-wide coverage, historical APY, and wallet performance are future work.

## 🏗️ Architecture

```text
app/dashboard/           Dashboard route
app/api/tvl/             USD TVL availability endpoint
components/              Dashboard and pool views
lib/poolReserves.ts       Horizon snapshot parsing
lib/export/              Transaction and tax exports
lib/analytics/           Experimental analytics calculations
__tests__/               Service, calculation, and UI tests
```

## Testing and build

```bash
npm test
npm run lint
npm run type-check
npm run build
npm start
```

The [CI workflow](.github/workflows/ci.yml) checks Node.js 22 and 24.

## Extending the app

The [Horizon reader](lib/poolReserves.ts) validates pool snapshots. The [dashboard view](components/PoolReserves.tsx) displays observed amounts and reports missing data. Additional data providers should attach their source, network, and observation time and keep unavailable values explicit.

## Contributing

See the [contribution guide](CONTRIBUTING.md) and [open issues](https://github.com/HyperDevTools/stellar-defi-analytics/issues). The [security policy](SECURITY.md) explains how to report security concerns.

## Roadmap

- Add a USD valuation provider with provenance and freshness checks.
- Add pagination or asset filters for Horizon liquidity pools.
- Expand protocol coverage and historical analytics.

## License

[MIT](LICENSE)
