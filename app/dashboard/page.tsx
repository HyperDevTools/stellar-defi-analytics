import Link from 'next/link';
import { Suspense } from 'react';
import { PoolReserves } from '@/components/PoolReserves';
import { TVLCard } from '@/components/TVLCard';
import { getPoolReserveSnapshot } from '@/lib/poolReserves';

export const dynamic = 'force-dynamic';

async function DashboardPools() {
  return <PoolReserves snapshot={await getPoolReserveSnapshot()} />;
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-bold">Stellar DeFi dashboard</h1>
        <Suspense fallback={<p role="status">Loading Stellar liquidity pool reserves…</p>}>
          <DashboardPools />
        </Suspense>
        <TVLCard />
      </div>
    </main>
  );
}
