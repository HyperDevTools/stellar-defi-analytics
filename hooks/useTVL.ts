import { useState, useEffect } from 'react';

async function fetchTVL(): Promise<number> {
  const response = await fetch('/api/tvl');
  if (!response.ok) {
    throw new Error(`Failed to fetch TVL: ${response.status}`);
  }

  const data = await response.json();
  if (typeof data.tvl !== 'number') {
    throw new Error('Invalid TVL response');
  }

  return data.tvl;
}

export function useTVL() {
  const [tvl, setTvl] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTVL() {
      try {
        setIsLoading(true);
        const data = await fetchTVL();
        setTvl(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTVL();

    // Refresh every 30 seconds
    const interval = setInterval(loadTVL, 30000);

    return () => clearInterval(interval);
  }, []);

  return { tvl, isLoading, error };
}
