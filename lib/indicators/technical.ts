export interface MACDData {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export interface BollingerBandPoint {
  upper: number;
  middle: number;
  lower: number;
}

/**
 * Calculate Simple Moving Average (SMA) over `period`.
 */
export function calculateSMA(prices: number[], period: number): number[] {
  if (period <= 0 || prices.length < period) return [];
  const result: number[] = [];
  let windowSum = 0;
  for (let i = 0; i < prices.length; i += 1) {
    windowSum += prices[i];
    if (i >= period) {
      windowSum -= prices[i - period];
    }
    if (i >= period - 1) {
      result.push(Number((windowSum / period).toFixed(6)));
    }
  }
  return result;
}

/**
 * Calculate Exponential Moving Average (EMA) over `period`.
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (period <= 0 || prices.length < period) return [];
  const k = 2 / (period + 1);
  const seed = prices.slice(0, period).reduce((acc, v) => acc + v, 0) / period;
  const result: number[] = [Number(seed.toFixed(6))];
  let prev = seed;
  for (let i = period; i < prices.length; i += 1) {
    const next = prices[i] * k + prev * (1 - k);
    result.push(Number(next.toFixed(6)));
    prev = next;
  }
  return result;
}

/**
 * Calculate Wilder's Relative Strength Index (RSI) over `period` (default 14).
 */
export function calculateRSI(prices: number[], period = 14): number[] {
  if (period <= 0 || prices.length <= period) return [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i += 1) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  const computeRsiVal = (g: number, l: number) => {
    if (l === 0) return 100;
    const rs = g / l;
    return Number((100 - 100 / (1 + rs)).toFixed(2));
  };

  const result: number[] = [computeRsiVal(avgGain, avgLoss)];
  for (let i = period + 1; i < prices.length; i += 1) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result.push(computeRsiVal(avgGain, avgLoss));
  }
  return result;
}

/**
 * Calculate MACD line, signal line, and histogram.
 */
export function calculateMACD(
  prices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): MACDData {
  if (fastPeriod <= 0 || slowPeriod <= fastPeriod || prices.length < slowPeriod) {
    return { macd: [], signal: [], histogram: [] };
  }
  const fastEma = calculateEMA(prices, fastPeriod);
  const slowEma = calculateEMA(prices, slowPeriod);
  const offset = slowPeriod - fastPeriod;

  const macdLine = slowEma.map((slowVal, idx) =>
    Number((fastEma[idx + offset] - slowVal).toFixed(6)),
  );
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const sigOffset = macdLine.length - signalLine.length;
  const histogram = signalLine.map((sigVal, idx) =>
    Number((macdLine[idx + sigOffset] - sigVal).toFixed(6)),
  );

  return {
    macd: macdLine,
    signal: signalLine,
    histogram,
  };
}

/**
 * Calculate Bollinger Bands (upper, middle, lower) over `period` and `stdDevMultiplier`.
 */
export function calculateBollingerBands(
  prices: number[],
  period = 20,
  stdDevMultiplier = 2,
): BollingerBandPoint[] {
  if (period <= 0 || prices.length < period) return [];
  const points: BollingerBandPoint[] = [];

  for (let i = period - 1; i < prices.length; i += 1) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((acc, v) => acc + v, 0) / period;
    const variance = slice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    points.push({
      upper: Number((mean + stdDevMultiplier * stdDev).toFixed(6)),
      middle: Number(mean.toFixed(6)),
      lower: Number((mean - stdDevMultiplier * stdDev).toFixed(6)),
    });
  }
  return points;
}
