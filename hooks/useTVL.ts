import { useState, useEffect } from 'react';
import { getTVL } from '@/lib/stellar';

export function useTVL() {
  const [tvl, setTvl] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTVL() {
      try {
        setIsLoading(true);
        const data = await getTVL();
        setTvl(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTVL();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTVL, 30000);

    return () => clearInterval(interval);
  }, []);

  return { tvl, isLoading, error };
}
