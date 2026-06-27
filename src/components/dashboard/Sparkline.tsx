/**
 * Tiny inline SVG sparkline for the watchlist table.
 * Server component — no client JS, no chart library dependency.
 * Renders the last N closes normalized into the viewBox.
 */
interface SparklineProps {
  closes: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ closes, positive, width = 96, height = 28 }: SparklineProps) {
  if (!closes || closes.length < 2) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const stepX = width / (closes.length - 1);

  const points = closes
    .map((c, i) => {
      const x = i * stepX;
      const y = height - ((c - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const stroke = positive ? "#22c55e" : "#ef4444";
  const fill = positive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";

  // Close the path for a filled area under the line.
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="inline-block align-middle"
    >
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
