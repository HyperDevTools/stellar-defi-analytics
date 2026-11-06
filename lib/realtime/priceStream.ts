export interface PriceUpdate {
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export interface HorizonStreamMessage {
  pair?: string;
  price?: number | string;
  change24h?: number;
  volume24h?: number;
  timestamp?: number;
}

type PriceCallback = (update: PriceUpdate) => void;

export class PriceStreamManager {
  private subscriptions: Map<string, Set<PriceCallback>> = new Map();
  private latestPrices: Map<string, PriceUpdate> = new Map();
  private connected = false;
  private reconnectAttempts = 0;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;

  async connect(horizonUrl = 'wss://horizon.stellar.org'): Promise<void> {
    if (!horizonUrl) {
      throw new Error('horizonUrl is required');
    }
    this.connected = true;
    this.reconnectAttempts = 0;
  }

  disconnect(): void {
    this.connected = false;
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getActiveStreamCount(): number {
    return this.subscriptions.size;
  }

  subscribe(assetPair: string, callback: PriceCallback): () => void {
    const normalized = assetPair.toUpperCase();
    const set = this.subscriptions.get(normalized) ?? new Set<PriceCallback>();
    set.add(callback);
    this.subscriptions.set(normalized, set);

    const existing = this.latestPrices.get(normalized);
    if (existing) {
      callback(existing);
    }

    return () => {
      const current = this.subscriptions.get(normalized);
      if (current) {
        current.delete(callback);
        if (current.size === 0) {
          this.subscriptions.delete(normalized);
        }
      }
    };
  }

  handleMessage(message: HorizonStreamMessage): void {
    const pair = (message.pair || 'XLM/USDC').toUpperCase();
    const numericPrice = Number(message.price ?? 0);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return;
    }

    const update: PriceUpdate = {
      pair,
      price: numericPrice,
      change24h: Number(message.change24h ?? 0),
      volume24h: Number(message.volume24h ?? 0),
      timestamp: message.timestamp ?? Date.now(),
    };

    this.latestPrices.set(pair, update);
    const callbacks = this.subscriptions.get(pair);
    if (callbacks) {
      callbacks.forEach((cb) => cb(update));
    }
  }

  getReconnectBackoffMs(baseMs = 1000): number {
    this.reconnectAttempts += 1;
    return Math.min(30_000, baseMs * Math.pow(2, this.reconnectAttempts - 1));
  }
}
