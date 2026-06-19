"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from "lightweight-charts";

interface OHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface KLineChartProps {
  data: OHLCVData[];
  ticker: string;
}

export function KLineChart({ data, ticker }: KLineChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#999",
      },
      localization: {
        locale: "en-US",
        dateFormat: "yyyy-MM-dd",
      },
      grid: {
        vertLines: { color: "rgba(150,150,150,0.1)" },
        horzLines: { color: "rgba(150,150,150,0.1)" },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "rgba(150,150,150,0.2)",
      },
      timeScale: {
        borderColor: "rgba(150,150,150,0.2)",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // K-line (candlestick) series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const isValid = (v: any) => v != null && !isNaN(v);
    const validData = data.filter(
      (d) => isValid(d.open) && isValid(d.high) && isValid(d.low) && isValid(d.close)
    );

    candleSeries.setData(
      validData.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(100,150,255,0.3)",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    volumeSeries.setData(
      validData
        .filter((d) => isValid(d.volume))
        .map((d) => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
        }))
    );

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
      visible: false,
    });

    // Fit content
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, ticker]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No chart data available
      </div>
    );
  }

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
