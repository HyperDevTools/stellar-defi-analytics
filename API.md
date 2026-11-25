# Stellar DeFi Analytics API

## Liquidity pool reserves

Open `/dashboard` to inspect a snapshot of up to ten classic Stellar liquidity pools. The server validates the response from Horizon and checks its network passphrase against the selected network. Each row includes the pool ID, both reserve amounts, total shares, and the fee in basis points. Reserve amounts and shares remain decimal strings so their full ledger precision is preserved.

The timestamp records when the application read the snapshot. An empty page means Horizon returned no pool records. A network mismatch, timeout, or invalid payload produces an unavailable state.

## USD total value locked

`GET /api/tvl` reports the current availability of the USD valuation metric. The response is HTTP 200 with this shape while a USD valuation provider is unavailable.

```json
{
  "tvl": null,
  "status": "unavailable",
  "reason": "No USD valuation provider is configured."
}
```

Clients should read `status` before rendering a value. Pool reserves are denominated in their underlying assets.

## Transaction exports

`DataExporter` in `lib/export/dataExporter.ts` exposes CSV, JSON, and tax CSV export functions for caller-supplied transaction records. Empty inputs produce an empty JSON array or CSV headers. PDF exports reject as unsupported. See the [export tests](__tests__/export/dataExporter.test.ts) for runnable examples.

## Configuration

Set `NEXT_PUBLIC_STELLAR_NETWORK` to `testnet` or `mainnet`. The application selects the corresponding public Horizon URL by default. Set `NEXT_PUBLIC_HORIZON_URL` to use a custom endpoint on the same network. Restart the application after editing `.env.local`.
