import { useState, useEffect } from 'react';
import { PoolAnalytics } from '@/types/pool';
import { calculatePoolAnalytics } from '@/lib/analytics/pools';

export function usePoolAnalytics(poolId: string, timeframe = '30d') {
  const [analytics, setAnalytics] = useState<PoolAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    calculatePoolAnalytics(poolId, timeframe)
      .then((res) => {
        if (active) {
          setAnalytics(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err as Error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [poolId, timeframe]);

  return { analytics, isLoading, error };
}
