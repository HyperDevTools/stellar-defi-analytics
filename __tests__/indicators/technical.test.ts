import {
  calculateBollingerBands,
  calculateEMA,
  calculateMACD,
  calculateRSI,
  calculateSMA,
} from '@/lib/indicators/technical';

describe('Technical Indicators (#5)', () => {
  const samplePrices = Array.from({ length: 35 }, (_, i) => 10 + Math.sin(i / 2) * 2 + i * 0.2);

  it('calculates SMA and EMA accurately', () => {
    expect(calculateSMA([1, 2, 3, 4, 5], 3)).toEqual([2, 3, 4]);
    const ema = calculateEMA([10, 11, 12, 13, 14], 3);
    expect(ema).toHaveLength(3);
    expect(ema[0]).toBe(11);
  });

  it('calculates RSI, MACD, and Bollinger Bands', () => {
    const rsi = calculateRSI(samplePrices, 14);
    expect(rsi.length).toBeGreaterThan(10);
    expect(rsi.every((v) => v >= 0 && v <= 100)).toBe(true);

    const macd = calculateMACD(samplePrices, 12, 26, 9);
    expect(macd.macd.length).toBeGreaterThan(0);
    expect(macd.signal.length).toBeGreaterThan(0);

    const bb = calculateBollingerBands(samplePrices, 20, 2);
    expect(bb.length).toBeGreaterThan(10);
    expect(bb[0].upper).toBeGreaterThan(bb[0].middle);
    expect(bb[0].middle).toBeGreaterThan(bb[0].lower);
  });
});
