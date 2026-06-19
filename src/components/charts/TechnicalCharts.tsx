"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries, HistogramSeries } from "lightweight-charts";
import { computeTechnicals, type OHLCVBar } from "@/lib/technicals";

interface Props {
  data: OHLCVBar[];
}

const isValid = (v: any) => v != null && !isNaN(v);

export function MACDChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const tech = computeTechnicals(data);

    const chart = createChart(containerRef.current, {
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
      rightPriceScale: { borderColor: "rgba(150,150,150,0.2)" },
      timeScale: { borderColor: "rgba(150,150,150,0.2)" },
      width: containerRef.current.clientWidth,
      height: 200,
      crosshair: { mode: 0 },
    });

    const macdData = tech.dates
      .map((d, i) => ({
        time: d,
        value: tech.macd[i],
      }))
      .filter((d) => isValid(d.value));

    const signalData = tech.dates
      .map((d, i) => ({
        time: d,
        value: tech.macdSignal[i],
      }))
      .filter((d) => isValid(d.value));

    const histogramData = tech.dates
      .map((d, i) => ({
        time: d,
        value: tech.macdHistogram[i],
        color:
          tech.macdHistogram[i] != null && tech.macdHistogram[i]! >= 0
            ? "rgba(34,197,94,0.5)"
            : "rgba(239,68,68,0.5)",
      }))
      .filter((d) => isValid(d.value));

    chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 2,
    }).setData(macdData as any);

    chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 1,
    }).setData(signalData as any);

    chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
    }).setData(histogramData as any);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export function RSIChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const tech = computeTechnicals(data);

    const chart = createChart(containerRef.current, {
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
      rightPriceScale: {
        borderColor: "rgba(150,150,150,0.2)",
        visible: true,
      },
      timeScale: { borderColor: "rgba(150,150,150,0.2)" },
      width: containerRef.current.clientWidth,
      height: 200,
      crosshair: { mode: 0 },
    });

    const rsiData = tech.dates
      .map((d, i) => ({
        time: d,
        value: tech.rsi14[i],
      }))
      .filter((d) => isValid(d.value));

    chart.addSeries(LineSeries, {
      color: "#8b5cf6",
      lineWidth: 2,
    }).setData(rsiData as any);

    // Add reference lines at 70 and 30
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2 pt-1">
        <span>Overbought (70)</span>
        <span>Oversold (30)</span>
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export function VolumeChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#999",
      },
      localization: {
        locale: "en-US",
        dateFormat: "yyyy-MM-dd",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(150,150,150,0.1)" },
      },
      rightPriceScale: {
        borderColor: "rgba(150,150,150,0.2)",
      },
      timeScale: { borderColor: "rgba(150,150,150,0.2)" },
      width: containerRef.current.clientWidth,
      height: 150,
      crosshair: { mode: 0 },
    });

    const volumeData = data
      .filter((d) => isValid(d.volume) && isValid(d.close) && isValid(d.open))
      .map((d) => ({
        time: d.date,
        value: d.volume,
        color: d.close >= d.open ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)",
      }));

    if (volumeData.length === 0) return;

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
    });
    volumeSeries.setData(volumeData as any);
    chart.timeScale().fitContent();

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}
