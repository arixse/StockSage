/**
 * Technical Indicators Calculator
 * Computes common technical analysis indicators from OHLCV data.
 */

export interface OHLCVBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalResult {
  dates: string[];
  closes: number[];
  ma5: (number | null)[];
  ma10: (number | null)[];
  ma20: (number | null)[];
  ma60: (number | null)[];
  ma200: (number | null)[];
  macd: (number | null)[];
  macdSignal: (number | null)[];
  macdHistogram: (number | null)[];
  rsi14: (number | null)[];
  bollingerUpper: (number | null)[];
  bollingerMiddle: (number | null)[];
  bollingerLower: (number | null)[];
  volumeMA20: (number | null)[];
}

function sma(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null);
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period] + data[i];
    result[i] = sum / period;
  }

  return result;
}

function ema(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null);
  if (data.length < period) return result;

  // Start with SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  const multiplier = 2 / (period + 1);
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    result[i] = (data[i] - result[i - 1]!) * multiplier + result[i - 1]!;
  }

  return result;
}

function rsi(data: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null);
  if (data.length < period + 1) return result;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < gains.length; i++) {
    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - 100 / (1 + rs);
    }

    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  return result;
}

export function computeTechnicals(data: OHLCVBar[]): TechnicalResult {
  // Data should be in chronological order (oldest first)
  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const closes = sorted.map((d) => d.close);
  const volumes = sorted.map((d) => d.volume);
  const highs = sorted.map((d) => d.high);
  const lows = sorted.map((d) => d.low);
  const dates = sorted.map((d) => d.date);

  // Moving Averages
  const ma5 = sma(closes, 5);
  const ma10 = sma(closes, 10);
  const ma20 = sma(closes, 20);
  const ma60 = sma(closes, 60);
  const ma200 = sma(closes, 200);

  // MACD (12, 26, 9)
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine: (number | null)[] = new Array(closes.length).fill(null);
  for (let i = 0; i < closes.length; i++) {
    if (ema12[i] != null && ema26[i] != null) {
      macdLine[i] = ema12[i]! - ema26[i]!;
    }
  }

  // MACD Signal (9-day EMA of MACD)
  const macdValues = macdLine.filter((v) => v != null) as number[];
  const signalEma = ema(macdValues, 9);
  const macdSignal: (number | null)[] = new Array(closes.length).fill(null);
  const macdHistogram: (number | null)[] = new Array(closes.length).fill(null);

  let signalIdx = 0;
  for (let i = 0; i < closes.length; i++) {
    if (macdLine[i] != null) {
      if (signalEma[signalIdx] != null) {
        macdSignal[i] = signalEma[signalIdx];
        macdHistogram[i] = macdLine[i]! - signalEma[signalIdx]!;
      }
      signalIdx++;
    }
  }

  // RSI (14)
  const rsi14 = rsi(closes, 14);

  // Bollinger Bands (20, 2)
  const bbMiddle = ma20;
  const bbUpper: (number | null)[] = new Array(closes.length).fill(null);
  const bbLower: (number | null)[] = new Array(closes.length).fill(null);

  for (let i = 19; i < closes.length; i++) {
    const slice = closes.slice(i - 19, i + 1);
    const mean = bbMiddle[i]!;
    const variance = slice.reduce((sum, val) => sum + (val - mean) ** 2, 0) / 20;
    const stdDev = Math.sqrt(variance);
    bbUpper[i] = mean + 2 * stdDev;
    bbLower[i] = mean - 2 * stdDev;
  }

  // Volume MA (20)
  const volumeMA20 = sma(volumes, 20);

  return {
    dates,
    closes,
    ma5,
    ma10,
    ma20,
    ma60,
    ma200,
    macd: macdLine,
    macdSignal,
    macdHistogram,
    rsi14,
    bollingerUpper: bbUpper,
    bollingerMiddle: bbMiddle,
    bollingerLower: bbLower,
    volumeMA20,
  };
}

export function latestTechnicals(data: OHLCVBar[]) {
  const tech = computeTechnicals(data);
  const last = (arr: (number | null)[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] != null) return arr[i];
    }
    return null;
  };

  return {
    ma5: last(tech.ma5),
    ma10: last(tech.ma10),
    ma20: last(tech.ma20),
    ma60: last(tech.ma60),
    ma200: last(tech.ma200),
    macd: last(tech.macd),
    macdSignal: last(tech.macdSignal),
    macdHistogram: last(tech.macdHistogram),
    rsi14: last(tech.rsi14),
    bollingerUpper: last(tech.bollingerUpper),
    bollingerMiddle: last(tech.bollingerMiddle),
    bollingerLower: last(tech.bollingerLower),
    volumeMA20: last(tech.volumeMA20),
  };
}
