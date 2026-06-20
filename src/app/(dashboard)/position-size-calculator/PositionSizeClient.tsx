"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricSlider } from "@/components/shared/MetricSlider";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, AlertTriangle, TrendingDown, PiggyBank } from "lucide-react";

export function PositionSizeClient() {
  const [portfolioValue, setPortfolioValue] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLossPrice, setStopLossPrice] = useState(95);

  const results = useMemo(() => {
    const capitalAtRisk = portfolioValue * (riskPercent / 100);
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);
    const positionSize = riskPerShare > 0 ? Math.floor(capitalAtRisk / riskPerShare) : 0;
    const positionValue = positionSize * entryPrice;
    const positionPercent = portfolioValue > 0 ? (positionValue / portfolioValue) * 100 : 0;
    const stopLossPercent = entryPrice > 0 ? ((stopLossPrice - entryPrice) / entryPrice) * 100 : 0;
    const rewardRatio = riskPerShare > 0 ? Math.abs(stopLossPercent) : 0;

    return {
      capitalAtRisk,
      riskPerShare,
      positionSize,
      positionValue,
      positionPercent,
      stopLossPercent,
      rewardRatio,
    };
  }, [portfolioValue, riskPercent, entryPrice, stopLossPrice]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Input Parameters
          </CardTitle>
          <CardDescription>Enter your portfolio details and risk parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="portfolio-value" className="text-sm font-medium">
              Portfolio / Account Value
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="portfolio-value"
                type="number"
                min={100}
                step={100}
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="pl-9 font-mono"
              />
            </div>
          </div>

          <MetricSlider
            label="Risk per Trade"
            min={0.25}
            max={5}
            step={0.25}
            value={riskPercent}
            onChange={setRiskPercent}
            formatValue={(v) => v.toFixed(2)}
            unit="%"
            hint="Recommended: 0.5-2% of portfolio per trade"
          />

          <div className="space-y-2">
            <Label htmlFor="entry-price" className="text-sm font-medium">
              Entry Price
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="entry-price"
                type="number"
                min={0.01}
                step={0.01}
                value={entryPrice}
                onChange={(e) => setEntryPrice(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                className="pl-9 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stop-loss" className="text-sm font-medium">
              Stop Loss Price
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="stop-loss"
                type="number"
                min={0.01}
                step={0.01}
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                className="pl-9 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            Results
          </CardTitle>
          <CardDescription>Your position sizing recommendation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main result */}
          <div className="bg-primary/5 rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Recommended Position Size</p>
            <p className="text-4xl font-bold font-mono text-primary">
              {results.positionSize}
            </p>
            <p className="text-sm text-muted-foreground mt-1">shares</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capital at Risk</span>
              <span className="font-mono font-medium text-red-500">
                ${results.capitalAtRisk.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk per Share</span>
              <span className="font-mono">${results.riskPerShare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Position Value</span>
              <span className="font-mono font-medium">${results.positionValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">% of Portfolio</span>
              <span className="font-mono">{results.positionPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stop Loss %</span>
              <span className={results.stopLossPercent < 0 ? "text-red-500 font-mono" : "font-mono"}>
                {results.stopLossPercent >= 0 ? "+" : ""}
                {results.stopLossPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This is a risk management tool, not financial advice. Always do your own research before trading.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
