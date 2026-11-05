import { useState, useEffect } from 'react';
import { PriceStreamManager, PriceUpdate } from '@/lib/realtime/priceStream';

const defaultManager = new PriceStreamManager();

export function useRealtimePrice(baseAsset: string, counterAsset: string) {
  const pair = `${baseAsset}/${counterAsset}`.toUpperCase();
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    defaultManager
      .connect()
      .then(() => {
        if (mounted) setIsConnected(true);
      })
      .catch((err) => {
        if (mounted) setError(err as Error);
      });

    const unsubscribe = defaultManager.subscribe(pair, (update: PriceUpdate) => {
      if (mounted) {
        setPrice(update.price);
        setChange24h(update.change24h);
        setVolume24h(update.volume24h);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [pair]);

  return { price, change24h, volume24h, isConnected, error };
}
