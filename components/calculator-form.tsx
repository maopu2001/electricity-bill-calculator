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
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Gauge,
  Info,
  Banknote,
  Sparkles,
  Minus,
  Plus,
  Home,
} from "lucide-react";

export type CalcMode = "units" | "amount" | "appliances";

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
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-4 sm:p-6 transition-[border-color,box-shadow] duration-200">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
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
          <div className="hidden sm:inline-flex items-center self-start sm:self-auto p-1 rounded-xl bg-muted/70 border border-border/40 w-45 -mt-8">
            <button
              type="button"
              onClick={() => handleModeSwitch("units")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                mode === "units"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-3.5 text-primary" />
              Units
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("amount")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                mode === "amount"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Banknote className="size-3.5 text-primary" />
              Budget
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-6 pt-1">
        {/* Main Input Field */}
        {mode === "units" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <Label
                htmlFor="units-input"
                className="font-medium text-foreground flex items-center gap-1.5"
              >
                Monthly Usage
              </Label>
              <span className="text-muted-foreground tabular-nums">
                Unit: kWh
              </span>
            </div>

            {/* Hero Input Box */}
            <div className="relative group rounded-2xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-[border-color,background-color,box-shadow] duration-150 p-3.5 sm:p-4 flex items-baseline justify-between min-h-[58px]">
              <NumericInput
                id="units-input"
                value={units}
                onValueChange={onUnitsChange}
                className="w-full text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight tabular-nums bg-transparent border-none outline-none shadow-none focus-visible:ring-0 focus-visible:border-none p-0 h-auto text-foreground placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="shrink-0 text-sm font-semibold text-muted-foreground pl-2 select-none">
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
                className="py-2 cursor-pointer touch-none"
              />

              {/* Exact Positioned Ticks & Labels */}
              <div className="relative w-full h-8 mt-1 select-none">
                {UNIT_TICKS.map((tick) => {
                  const isPastOrActive = units >= tick.val;
                  const isExact = units === tick.val;
                  return (
                    <button
                      key={tick.val}
                      type="button"
                      onClick={() => onUnitsChange(tick.val)}
                      style={{ left: `${tick.pct}%` }}
                      className={`group absolute top-0 flex flex-col cursor-pointer transition-transform duration-150 active:scale-[0.97] min-h-[36px] ${
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
                        className={`w-[2px] h-1.5 rounded-full transition-all duration-150 ${
                          isExact
                            ? "bg-primary h-2 shadow-xs"
                            : isPastOrActive
                              ? "bg-primary/80"
                              : "bg-border/90 group-hover:bg-muted-foreground"
                        }`}
                      />
                      {/* Text Label */}
                      <span
                        className={`text-[11px] tabular-nums mt-1 font-medium transition-colors ${
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
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {UNIT_PRESETS.map((p) => {
                  const isSelected = units === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => applyUnitsPreset(p.value)}
                      className={`h-7 px-3 py-1 rounded-xl text-xs font-medium border transition-transform duration-150 cursor-pointer active:scale-[0.97] ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                      }`}
                    >
                      {p.label}
                      {p.desc && (
                        <span className="ml-1 text-[10px] opacity-80">
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
              <Label
                htmlFor="amount-input"
                className="font-medium text-foreground flex items-center gap-1.5"
              >
                Total Bill Amount
              </Label>
              <span className="text-muted-foreground tabular-nums">
                Unit: BDT (৳)
              </span>
            </div>

            {/* Hero Input Box */}
            <div className="relative group rounded-2xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-[border-color,background-color,box-shadow] duration-150 p-3.5 sm:p-4 flex items-baseline justify-between min-h-14">
              <span className="shrink-0 text-2xl sm:text-3xl font-semibold text-muted-foreground pr-2 select-none">
                ৳
              </span>
              <NumericInput
                id="amount-input"
                value={amount}
                onValueChange={onAmountChange}
                className="w-full text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight tabular-nums bg-transparent border-none outline-none shadow-none focus-visible:ring-0 focus-visible:border-none p-0 h-auto text-foreground placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="shrink-0 text-sm font-semibold text-muted-foreground pl-2 select-none">
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
                className="py-2 cursor-pointer touch-none"
              />

              {/* Exact Positioned Ticks & Labels */}
              <div className="relative w-full h-8 mt-1 select-none">
                {AMOUNT_TICKS.map((tick) => {
                  const isPastOrActive = amount >= tick.val;
                  const isExact = amount === tick.val;
                  return (
                    <button
                      key={tick.val}
                      type="button"
                      onClick={() => applyAmountPreset(tick.val)}
                      style={{ left: `${tick.pct}%` }}
                      className={`group absolute top-0 flex flex-col cursor-pointer transition-transform duration-150 active:scale-[0.97] min-h-[36px] ${
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
                        className={`w-[2px] h-1.5 rounded-full transition-all duration-150 ${
                          isExact
                            ? "bg-primary h-2 shadow-xs"
                            : isPastOrActive
                              ? "bg-primary/80"
                              : "bg-border/90 group-hover:bg-muted-foreground"
                        }`}
                      />
                      {/* Text Label */}
                      <span
                        className={`text-[11px] tabular-nums mt-1 font-medium transition-colors ${
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
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {AMOUNT_PRESETS.map((p) => {
                  const isSelected = amount === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => applyAmountPreset(p.value)}
                      className={`h-7 px-3 py-1 rounded-xl text-xs font-medium border transition-transform duration-150 cursor-pointer active:scale-[0.97] ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
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
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gauge className="size-4 text-primary" />
              <Label
                htmlFor="demand-input"
                className="text-xs font-medium text-foreground"
              >
                Sanctioned Demand Load
              </Label>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="cursor-help inline-flex text-muted-foreground hover:text-foreground p-1"
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
            <div className="relative flex-1 h-12 rounded-xl border border-border/60 bg-muted/20 focus-within:border-primary/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-[border-color,background-color,box-shadow] duration-150 px-3.5 flex items-center justify-between">
              <NumericInput
                id="demand-input"
                value={demand}
                onValueChange={onDemandChange}
                allowDecimals
                className="w-full text-lg font-bold tabular-nums bg-transparent border-none outline-none shadow-none focus-visible:ring-0 focus-visible:border-none p-0 h-auto text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="1"
              />
              <span className="text-xs font-semibold text-muted-foreground select-none pl-2">
                kW
              </span>
            </div>

            {/* Stepper buttons (min 44px hit-box) */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustDemand(-0.5)}
                disabled={demand <= 0}
                className="size-11 sm:size-10 rounded-xl border-border/60 hover:bg-muted active:scale-[0.97] transition-transform duration-150 cursor-pointer"
                aria-label="Decrease demand load by 0.5 kW"
              >
                <Minus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustDemand(0.5)}
                className="size-11 sm:size-10 rounded-xl border-border/60 hover:bg-muted active:scale-[0.97] transition-transform duration-150 cursor-pointer"
                aria-label="Increase demand load by 0.5 kW"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Helper to Open Appliance Calculator */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Know your appliances?</span>
          <button
            type="button"
            onClick={() => onModeChange("appliances")}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Open Household Estimator</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
