"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useId } from "react";

interface MetricSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  unit?: string;
  hint?: string;
  className?: string;
}

export function MetricSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = String,
  unit = "",
  hint,
  className,
}: MetricSliderProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-sm font-mono tabular-nums text-muted-foreground">
          {formatValue(value)}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            "w-full h-2 bg-muted rounded-full appearance-none cursor-pointer",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percent}%, hsl(var(--muted)) ${percent}%, hsl(var(--muted)) 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{formatValue(min)}{unit}</span>
          <span className="text-xs text-muted-foreground">{formatValue(max)}{unit}</span>
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
