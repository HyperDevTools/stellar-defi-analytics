'use client';

import React from 'react';
import { usePoolAnalytics } from '@/hooks/usePoolAnalytics';

export function PoolAnalytics({ poolId = 'XLM-USDC-POOL' }: { poolId?: string }) {
  const { analytics, isLoading, error } = usePoolAnalytics(poolId, '30d');

  if (error) {
    return <div className="p-4 text-red-600">Failed to load pool analytics: {error.message}</div>;
  }
  if (isLoading || !analytics) {
    return <div className="p-4 text-gray-500">Loading pool analytics...</div>;
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Pool Analytics ({poolId})</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 rounded">
          <div className="text-xs text-gray-500">Current APY</div>
          <div className="text-lg font-bold text-blue-700">{analytics.apy.current}%</div>
        </div>
        <div className="p-3 bg-amber-50 rounded">
          <div className="text-xs text-gray-500">Impermanent Loss</div>
          <div className="text-lg font-bold text-amber-700">{analytics.impermanentLoss.current}%</div>
        </div>
        <div className="p-3 bg-green-50 rounded">
          <div className="text-xs text-gray-500">30d Fees Earned</div>
          <div className="text-lg font-bold text-green-700">${analytics.fees.total.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-purple-50 rounded">
          <div className="text-xs text-gray-500">Avg Price Impact ($5k)</div>
          <div className="text-lg font-bold text-purple-700">{analytics.health.averagePriceImpact}%</div>
        </div>
      </div>
    </div>
  );
}
