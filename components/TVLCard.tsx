'use client';

import { useTVL } from '@/hooks/useTVL';

export function TVLCard() {
  const tvl = useTVL();

  return (
    <section className="p-6 border border-gray-300 rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Total value locked (USD)</h2>
      {tvl.status === 'loading' && <p role="status">Checking availability…</p>}
      {tvl.status === 'unavailable' && <p role="status">Unavailable. {tvl.reason}</p>}
      {tvl.status === 'error' && <p role="alert">Could not load TVL availability.</p>}
    </section>
  );
}
