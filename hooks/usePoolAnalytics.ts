import { useState, useEffect } from 'react';
import { PoolAnalytics } from '@/types/pool';
import { calculatePoolAnalytics } from '@/lib/analytics/pools';

export function usePoolAnalytics(poolId: string, timeframe = '30d') {
  const [result, setResult] = useState<{
    poolId: string;
    timeframe: string;
    analytics: PoolAnalytics | null;
    error: Error | null;
  } | null>(null);

  useEffect(() => {
    let active = true;
    calculatePoolAnalytics(poolId, timeframe)
      .then((analytics) => {
        if (active) setResult({ poolId, timeframe, analytics, error: null });
      })
      .catch((cause: unknown) => {
        if (active) {
          const error = cause instanceof Error ? cause : new Error(String(cause));
          setResult({ poolId, timeframe, analytics: null, error });
        }
      });

    return () => {
      active = false;
    };
  }, [poolId, timeframe]);

  const currentResult =
    result?.poolId === poolId && result.timeframe === timeframe ? result : null;

  return {
    analytics: currentResult?.analytics ?? null,
    isLoading: currentResult === null,
    error: currentResult?.error ?? null,
  };
}
