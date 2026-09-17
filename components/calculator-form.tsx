"use client";

import { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Gauge,
  Info,
  Banknote,
  Sparkles,
  Minus,
  Plus,
} from "lucide-react";

export type CalcMode = "units" | "amount";

const UNIT_PRESETS = [
  { label: "50 kWh", value: 50, desc: "Life Line" },
  { label: "75 kWh", value: 75, desc: "Tier 1" },
  { label: "150 kWh", value: 150, desc: "Average" },
  { label: "300 kWh", value: 300, desc: "Mid" },
  { label: "500 kWh", value: 500, desc: "Heavy" },
];

const AMOUNT_PRESETS = [
  { label: "৳500", value: 500 },
  { label: "৳1,500", value: 1500 },
  { label: "৳3,000", value: 3000 },
  { label: "৳5,000", value: 5000 },
  { label: "৳10,000", value: 10000 },
];

const UNIT_TICKS = [
  { val: 0, pct: 0, label: "0" },
  { val: 250, pct: 25, label: "250" },
  { val: 500, pct: 50, label: "500" },
  { val: 750, pct: 75, label: "750" },
  { val: 1000, pct: 100, label: "1,000" },
];

const AMOUNT_TICKS = [
  { val: 0, pct: 0, label: "৳0" },
  { val: 2500, pct: 25, label: "৳2.5k" },
  { val: 5000, pct: 50, label: "৳5k" },
  { val: 7500, pct: 75, label: "৳7.5k" },
  { val: 10000, pct: 100, label: "৳10k" },
];

// Magnetic detent pull helper
function applyMagneticSnap(
  val: number,
  interval: number,
  threshold: number,
): number {
  const remainder = val % interval;
  if (remainder <= threshold) {
    return val - remainder;
  }
  if (interval - remainder <= threshold) {
    return val + (interval - remainder);
  }
  return val;
}

interface CalculatorFormProps {
  mode: CalcMode;
  units: number;
  amount: number;
  demand: number;
  onModeChange: (mode: CalcMode) => void;
  onUnitsChange: (units: number) => void;
  onDemandChange: (demand: number) => void;
  onAmountChange: (amount: number) => void;
}

export function CalculatorForm({
  mode,
  units,
  amount,
  demand,
  onModeChange,
  onUnitsChange,
  onDemandChange,
  onAmountChange,
}: CalculatorFormProps) {
  const handleUnitsChange = useCallback(
    (value: string) => {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0) {
        onUnitsChange(parsed);
      } else if (value === "") {
        onUnitsChange(0);
      }
    },
    [onUnitsChange],
  );

  const handleUnitsSlider = useCallback(
    (value: number | readonly number[]) => {
      const rawVal = Array.isArray(value) ? value[0] : value;
      // Magnetic push toward 50 kWh increments (threshold ±8 kWh)
      const magneticVal = applyMagneticSnap(rawVal, 50, 8);
      onUnitsChange(magneticVal);
    },
    [onUnitsChange],
  );

  const applyUnitsPreset = useCallback(
    (val: number) => {
      onUnitsChange(val);
    },
    [onUnitsChange],
  );

  const handleDemandChange = useCallback(
    (value: string) => {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0) {
        onDemandChange(parsed);
      } else if (value === "") {
        onDemandChange(0);
      }
    },
    [onDemandChange],
  );

  const adjustDemand = useCallback(
    (delta: number) => {
      const next = Math.max(0, parseFloat((demand + delta).toFixed(1)));
      onDemandChange(next);
    },
    [demand, onDemandChange],
  );

  const handleAmountChange = useCallback(
    (value: string) => {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0) {
        onAmountChange(parsed);
      } else if (value === "") {
        onAmountChange(0);
      }
    },
    [onAmountChange],
  );

  const handleAmountSlider = useCallback(
    (value: number | readonly number[]) => {
      const rawVal = Array.isArray(value) ? value[0] : value;
      // Magnetic push toward 500 BDT increments (threshold ±75 BDT)
      const magneticVal = applyMagneticSnap(rawVal, 500, 75);
      onAmountChange(magneticVal);
    },
    [onAmountChange],
  );

  const applyAmountPreset = useCallback(
    (val: number) => {
      onAmountChange(val);
    },
    [onAmountChange],
  );

  const handleModeSwitch = useCallback(
    (newMode: CalcMode) => {
      onModeChange(newMode);
    },
    [onModeChange],
  );

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 transition-all">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span className="p-1 rounded-md bg-primary/10 text-primary">
                {mode === "units" ? (
                  <Zap className="size-4" />
                ) : (
                  <Banknote className="size-4" />
                )}
              </span>
              {mode === "units"
                ? "Calculate by Consumption"
                : "Calculate by Bill Amount"}
            </CardTitle>
            <CardDescription className="text-xs">
              {mode === "units"
                ? "Input monthly kWh to estimate total tariff and breakdown"
                : "Input budget in Taka to estimate available units"}
            </CardDescription>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex items-center self-start sm:self-auto p-1 rounded-xl bg-muted/70 border border-border/40">
            <button
              type="button"
              onClick={() => handleModeSwitch("units")}
              className={`w-22 flex items-center gap-1.5 p-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                mode === "units"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-3.5 text-primary" />
              Units (kWh)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("amount")}
              className={`w-22 flex items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                mode === "amount"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Banknote className="size-3.5 text-emerald-500" />
              Amount (৳)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-6 pt-1">
        {/* Main Input Field */}
        {mode === "units" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="units-input"
                className="font-medium text-foreground flex items-center gap-1.5"
              >
                Monthly Usage
              </label>
              <span className="text-muted-foreground tabular-nums">
                Unit: kWh
              </span>
            </div>

            {/* Hero Input Box */}
            <div className="relative group rounded-2xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all p-3.5 sm:p-4 flex items-baseline justify-between">
              <input
                id="units-input"
                type="number"
                min={0}
                value={units === 0 ? "" : units}
                onChange={(e) => handleUnitsChange(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="w-full text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="shrink-0 text-sm font-medium text-muted-foreground pl-2 select-none">
                kWh
              </span>
            </div>

            {/* Slider with Exact Alignment & Tick Markers */}
            <div className="space-y-1 pt-1">
              <Slider
                value={[units]}
                max={1000}
                step={1}
                onValueChange={handleUnitsSlider}
                className="py-1.5 cursor-pointer"
              />

              {/* Exact Positioned Ticks & Labels */}
              <div className="relative w-full h-7 mt-1.5 select-none">
                {UNIT_TICKS.map((tick) => {
                  const isPastOrActive = units >= tick.val;
                  const isExact = units === tick.val;
                  return (
                    <button
                      key={tick.val}
                      type="button"
                      onClick={() => onUnitsChange(tick.val)}
                      style={{ left: `${tick.pct}%` }}
                      className={`group absolute top-0 flex flex-col cursor-pointer transition-all duration-150 ${
                        tick.pct === 0
                          ? "items-start"
                          : tick.pct === 100
                            ? "-translate-x-full items-end"
                            : "-translate-x-1/2 items-center"
                      }`}
                      title={`Jump to ${tick.label} kWh`}
                    >
                      {/* Vertical Pip Indicator */}
                      <span
                        className={`w-[2px] h-1.5 rounded-full transition-all duration-200 ${
                          isExact
                            ? "bg-primary h-2 shadow-xs"
                            : isPastOrActive
                              ? "bg-primary/80"
                              : "bg-border/90 group-hover:bg-muted-foreground"
                        }`}
                      />
                      {/* Text Label */}
                      <span
                        className={`text-[11px] tabular-nums mt-0.5 font-medium transition-colors ${
                          isExact
                            ? "text-primary font-bold"
                            : isPastOrActive
                              ? "text-foreground"
                              : "text-muted-foreground/75 group-hover:text-foreground"
                        }`}
                      >
                        {tick.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                <span>Quick Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {UNIT_PRESETS.map((p) => {
                  const isSelected = units === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => applyUnitsPreset(p.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                      }`}
                    >
                      {p.label}
                      {p.desc && (
                        <span className="ml-1 text-[10px] opacity-75">
                          ({p.desc})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="amount-input"
                className="font-medium text-foreground flex items-center gap-1.5"
              >
                Total Bill Amount
              </label>
              <span className="text-muted-foreground tabular-nums">
                Unit: BDT (৳)
              </span>
            </div>

            {/* Hero Input Box */}
            <div className="relative group rounded-2xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all p-3.5 sm:p-4 flex items-baseline justify-between">
              <span className="shrink-0 text-2xl sm:text-3xl font-semibold text-muted-foreground pr-2 select-none">
                ৳
              </span>
              <input
                id="amount-input"
                type="number"
                min={0}
                value={amount === 0 ? "" : amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="w-full text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="shrink-0 text-sm font-medium text-muted-foreground pl-2 select-none">
                BDT
              </span>
            </div>

            {/* Slider with Exact Alignment & Tick Markers */}
            <div className="space-y-1 pt-1">
              <Slider
                value={[amount]}
                max={10000}
                step={10}
                onValueChange={handleAmountSlider}
                className="py-1.5 cursor-pointer"
              />

              {/* Exact Positioned Ticks & Labels */}
              <div className="relative w-full h-7 mt-1.5 select-none">
                {AMOUNT_TICKS.map((tick) => {
                  const isPastOrActive = amount >= tick.val;
                  const isExact = amount === tick.val;
                  return (
                    <button
                      key={tick.val}
                      type="button"
                      onClick={() => applyAmountPreset(tick.val)}
                      style={{ left: `${tick.pct}%` }}
                      className={`group absolute top-0 flex flex-col cursor-pointer transition-all duration-150 ${
                        tick.pct === 0
                          ? "items-start"
                          : tick.pct === 100
                            ? "-translate-x-full items-end"
                            : "-translate-x-1/2 items-center"
                      }`}
                      title={`Jump to ${tick.label}`}
                    >
                      {/* Vertical Pip Indicator */}
                      <span
                        className={`w-[2px] h-1.5 rounded-full transition-all duration-200 ${
                          isExact
                            ? "bg-primary h-2 shadow-xs"
                            : isPastOrActive
                              ? "bg-primary/80"
                              : "bg-border/90 group-hover:bg-muted-foreground"
                        }`}
                      />
                      {/* Text Label */}
                      <span
                        className={`text-[11px] tabular-nums mt-0.5 font-medium transition-colors ${
                          isExact
                            ? "text-primary font-bold"
                            : isPastOrActive
                              ? "text-foreground"
                              : "text-muted-foreground/75 group-hover:text-foreground"
                        }`}
                      >
                        {tick.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="size-3 text-emerald-500" />
                <span>Quick Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AMOUNT_PRESETS.map((p) => {
                  const isSelected = amount === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => applyAmountPreset(p.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Demand Load Section */}
        <div className="pt-3 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gauge className="size-4 text-primary" />
              <label
                htmlFor="demand-input"
                className="text-xs font-medium text-foreground"
              >
                Sanctioned Demand Load
              </label>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="cursor-help inline-flex text-muted-foreground hover:text-foreground"
                    >
                      <Info className="size-3.5" />
                    </button>
                  }
                />
                <TooltipContent side="top" className="max-w-64 text-xs">
                  Fixed demand load in kW (residential typical: 1–2 kW). Used to
                  compute the ৳42.00/kW monthly demand charge.
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              ৳42.00 / kW / mo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-12 rounded-xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all px-3.5 flex items-center justify-between">
              <input
                id="demand-input"
                type="number"
                min={0}
                step={0.1}
                value={demand === 0 ? "" : demand}
                onChange={(e) => handleDemandChange(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="w-full text-lg font-semibold tabular-nums bg-transparent border-none outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="1"
              />
              <span className="text-xs font-medium text-muted-foreground select-none pl-2">
                kW
              </span>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustDemand(-0.5)}
                disabled={demand <= 0}
                className="size-9 rounded-xl border-border/60 hover:bg-muted active:scale-95 cursor-pointer"
                aria-label="Decrease demand load by 0.5 kW"
              >
                <Minus className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustDemand(0.5)}
                className="size-9 rounded-xl border-border/60 hover:bg-muted active:scale-95 cursor-pointer"
                aria-label="Increase demand load by 0.5 kW"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
