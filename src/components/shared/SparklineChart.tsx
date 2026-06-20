"use client";

import { useEffect, useRef, memo } from "react";
import { cn, cnColor } from "@/lib/utils";
import type { OHLCV } from "@/types/stock";

interface SparklineChartProps {
  data: OHLCV[] | { close: number }[];
  change?: number | null;
  width?: number;
  height?: number;
  className?: string;
  lineColor?: string;
}

function drawSparkline(
  canvas: HTMLCanvasElement,
  points: number[],
  color: string,
  width: number,
  height: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx || points.length < 2) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const xStep = (width - 2) / (points.length - 1);

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color.replace(")", ",0.2)").replace("rgb", "rgba"));
  gradient.addColorStop(1, "transparent");

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";

  points.forEach((p, i) => {
    const x = 1 + i * xStep;
    const y = height - 1 - ((p - min) / range) * (height - 4);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Fill area
  ctx.lineTo(1 + (points.length - 1) * xStep, height - 1);
  ctx.lineTo(1, height - 1);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
}

const SparklineChart = memo(function SparklineChart({
  data,
  change,
  width = 120,
  height = 40,
  className,
  lineColor,
}: SparklineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const color =
    lineColor ||
    (change == null
      ? "rgb(var(--primary) / <alpha-value>)"
      : change >= 0
        ? "rgb(34 197 94)"
        : "rgb(239 68 68)");

  // Extract close-like values
  const closes = data.map((d) => ("close" in d ? d.close : (d as { close: number }).close)).filter((v): v is number => v != null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || closes.length < 2) return;

    const observer = new ResizeObserver(() => {
      drawSparkline(canvas, closes, color.replace("rgb(var(--primary) / <alpha-value>)", "rgb(99 102 241)"), width, height);
    });
    observer.observe(canvas);
    drawSparkline(canvas, closes, color.replace("rgb(var(--primary) / <alpha-value>)", "rgb(99 102 241)"), width, height);

    return () => observer.disconnect();
  }, [closes, color, width, height]);

  if (closes.length < 2) {
    return (
      <div className={cn("flex items-center justify-center text-xs text-muted-foreground", className)} style={{ width, height }}>
        —
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className={cn("block", className)}
    />
  );
});

export { SparklineChart };
