import { useEffect, useState } from 'react';

type TVLState =
  | { status: 'loading' }
  | { status: 'unavailable'; reason: string }
  | { status: 'error' };

export function useTVL(): TVLState {
  const [state, setState] = useState<TVLState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    async function loadTVL() {
      try {
        const response = await fetch('/api/tvl', { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load TVL availability');
        const data = await response.json();
        if (data.status !== 'unavailable' || data.tvl !== null || typeof data.reason !== 'string') {
          throw new Error('Invalid TVL availability response');
        }
        if (!controller.signal.aborted) {
          setState({ status: 'unavailable', reason: data.reason });
        }
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error' });
      }
    }

    void loadTVL();
    return () => controller.abort();
  }, []);

  return state;
}
