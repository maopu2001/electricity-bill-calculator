"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalculatorForm } from "@/components/calculator-form";
import { BillSummary } from "@/components/bill-summary";
import { AmountSummary } from "@/components/amount-summary";
import { SlabBreakdown } from "@/components/slab-breakdown";
import { UsageChart } from "@/components/usage-chart";
import { TariffInfo } from "@/components/tariff-info";
import { HouseholdCalculatorView } from "@/components/household-calculator/household-calculator-view";
import { calculateBill, calculateUnitsFromAmount } from "@/lib/tariff";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ShieldCheck, Banknote, Home, Globe, Code2 } from "lucide-react";
import { useCalculatorStore } from "@/hooks/use-calculator-store";

export default function HomePage() {
  const {
    mode,
    units,
    amount,
    demand,
    isHydrated,
    setMode,
    setUnits,
    setAmount,
    setDemand,
  } = useCalculatorStore();

  const billResult = useMemo(() => {
    if (!isHydrated) return null;
    if (mode === "units") return calculateBill(units, demand);
    return null;
  }, [mode, units, demand, isHydrated]);

  const reverseResult = useMemo(() => {
    if (!isHydrated) return null;
    if (mode === "amount") return calculateUnitsFromAmount(amount, demand);
    return null;
  }, [mode, amount, demand, isHydrated]);

  const hasResult =
    isHydrated &&
    ((mode === "units" && units > 0) || (mode === "amount" && amount > 0));

  const handleApplyFromHousehold = useCallback(
    (calcUnits: number, suggestedDemand: number) => {
      setUnits(calcUnits);
      if (suggestedDemand > 0) {
        setDemand(suggestedDemand);
      }
      setMode("units");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setUnits, setDemand, setMode],
  );

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Dynamic ambient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.54_0.17_155/0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,oklch(0.68_0.19_155/0.09),transparent_70%)] blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.62_0.16_195/0.05),transparent_70%)] blur-3xl" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative size-8 sm:size-9 rounded-xl border border-border/60 bg-card p-1 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="Electricity Bill Calculator"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-foreground truncate">
                  VoltCalc
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 border-primary/30 text-primary bg-primary/10 font-normal shrink-0"
                >
                  BERC (LT-A)
                </Badge>
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block truncate">
                Bangladesh Electricity Bill & Load Calculator
              </p>
            </div>
          </div>

          {/* Desktop Navigation Pill Tabs */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center p-1 rounded-xl bg-muted/70 border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => setMode("units")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                  mode === "units"
                    ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="size-3.5 text-primary" />
                <span>Units (kWh)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("amount")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                  mode === "amount"
                    ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Banknote className="size-3.5 text-primary" />
                <span>Budget (৳)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("appliances")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                  mode === "appliances"
                    ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="size-3.5 text-primary" />
                <span>Household Load</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1 rounded-full border border-border/40 bg-muted/30">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>2024–2026 Rates</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile & Tablet Mode Switcher Bar (< lg) */}
        <div className="lg:hidden px-3 sm:px-6 pb-2.5 pt-0.5 border-t border-border/20">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/70 border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setMode("units")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                mode === "units"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-3.5 text-primary shrink-0" />
              <span className="truncate">Units</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("amount")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                mode === "amount"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Banknote className="size-3.5 text-primary shrink-0" />
              <span className="truncate">Budget</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("appliances")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                mode === "appliances"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="size-3.5 text-primary shrink-0" />
              <span className="truncate">Appliances</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
        {/* Intro Subtitle */}
        <div className="text-center sm:text-left space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {mode === "appliances"
              ? "Household Appliance Electricity Estimator"
              : "Domestic Electricity Tariff Calculator"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {mode === "appliances"
              ? "Accurately compute monthly kWh from your fans, lights, AC, fridge, TV, pumps, and custom devices with customizable wattages and duty cycles."
              : "Accurate monthly bill estimation with progressive slab breakdown, demand charges, 0.5% statutory rebate, and 5% VAT."}
          </p>
        </div>

        {/* Dynamic Mode Views */}
        {mode === "appliances" ? (
          <HouseholdCalculatorView
            demandKW={demand}
            onApplyToBill={handleApplyFromHousehold}
          />
        ) : (
          /* Two-Column Bento Layout for Units / Amount modes */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Interactive Input Deck */}
            <div className="lg:col-span-5 space-y-6">
              {!isHydrated ? (
                <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-8 w-28 rounded-xl" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                </Card>
              ) : (
                <CalculatorForm
                  mode={mode}
                  units={units}
                  amount={amount}
                  demand={demand}
                  onModeChange={setMode}
                  onUnitsChange={setUnits}
                  onDemandChange={setDemand}
                  onAmountChange={setAmount}
                />
              )}

              {/* Quick Helper Tips */}
              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>Statutory Tariff Formula</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Subtotal = Energy Cost + Demand Fee (৳42/kW). Rebate of 0.5%
                  is deducted from subtotal, followed by 5% VAT on the
                  post-rebate amount.
                </p>
              </div>
            </div>

            {/* Right Column: Live Results & Analytics Deck */}
            <div className="lg:col-span-7 space-y-6">
              {!isHydrated ? (
                <div className="space-y-6">
                  <Card className="border border-border bg-card shadow-md sm:shadow-lg p-5 sm:p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-14 w-48" />
                    <Skeleton className="h-px w-full" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  </Card>
                  <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </Card>
                </div>
              ) : hasResult ? (
                <>
                  {/* Units mode results */}
                  {mode === "units" && billResult && (
                    <div className="space-y-6">
                      <BillSummary result={billResult} />
                      <SlabBreakdown result={billResult} />
                      <UsageChart result={billResult} />
                    </div>
                  )}

                  {/* Amount mode results */}
                  {mode === "amount" && reverseResult && (
                    <div className="space-y-6">
                      <AmountSummary result={reverseResult} />
                      {reverseResult.estimatedUnits > 0 && (
                        <>
                          <SlabBreakdown
                            result={{
                              totalUnits: reverseResult.estimatedUnits,
                              demandKW: demand,
                              slabBreakdown: reverseResult.slabBreakdown,
                              totalEnergyCharge: reverseResult.energyCharge,
                              totalDemandCharge: reverseResult.demandCharge,
                              subtotal: reverseResult.subtotal,
                              rebate: reverseResult.rebate,
                              afterRebate: reverseResult.afterRebate,
                              vat: reverseResult.vat,
                              grandTotal: reverseResult.inputAmount,
                            }}
                          />
                          <UsageChart
                            result={{
                              totalUnits: reverseResult.estimatedUnits,
                              demandKW: demand,
                              slabBreakdown: reverseResult.slabBreakdown,
                              totalEnergyCharge: reverseResult.energyCharge,
                              totalDemandCharge: reverseResult.demandCharge,
                              subtotal: reverseResult.subtotal,
                              rebate: reverseResult.rebate,
                              afterRebate: reverseResult.afterRebate,
                              vat: reverseResult.vat,
                              grandTotal: reverseResult.inputAmount,
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Card className="border border-dashed border-border/70 bg-card/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-2xl bg-muted/50 text-muted-foreground">
                    <Zap className="size-8 text-primary/60" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base text-foreground">
                      Awaiting Input
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Enter your energy consumption in kWh or budget in ৳ on the
                      left to calculate live tariff breakdown.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Tariff Reference Section */}
        <div className="pt-2">
          <TariffInfo />
        </div>
      </main>

      {/* Minimalist Clean Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-xs text-muted-foreground bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p>
              VoltCalc © {new Date().getFullYear()} · Based on official BERC Residential (LT-A) schedule
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              For estimation and planning purposes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-xs">
            <Link
              href="https://maopu.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors cursor-pointer group"
            >
              <Globe className="size-3.5 text-primary group-hover:rotate-12 transition-transform" />
              <span>M. Aktaruzzaman Opu</span>
            </Link>

            <span className="text-border select-none">|</span>

            <Link
              href="https://github.com/maopu2001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                className="size-3.5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M216.5 362.5c-66-8-112.5-55.5-112.5-117 0-25 9-52 24-70-6.5-16.5-5.5-51.5 2-66 20-2.5 47 8 63 22.5 19-6 39-9 63.5-9s44.5 3 62.5 8.5c15.5-14 43-24.5 63-22 7 13.5 8 48.5 1.5 65.5 16 19 24.5 44.5 24.5 70.5 0 61.5-46.5 108-113.5 116.5 17 11 28.5 35 28.5 62.5l0 52C323 491.5 335.5 500 350.5 494 441 459.5 512 369 512 257 512 115.5 397 0 255.5 0S0 115.5 0 257c0 111 70.5 203 165.5 237.5 13.5 5 26.5-4 26.5-17.5l0-40c-7 3-16 5-24 5-33 0-52.5-18-66.5-51.5-5.5-13.5-11.5-21.5-23-23-6-.5-8-3-8-6 0-6 10-10.5 20-10.5 14.5 0 27 9 40 27.5 10 14.5 20.5 21 33 21s20.5-4.5 32-16c8.5-8.5 15-16 21-21z"
                />
              </svg>
              <span>GitHub</span>
            </Link>

            <span className="text-border select-none">|</span>

            <Link
              href="https://github.com/maopu2001/electricity-bill-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Code2 className="size-3.5 text-primary" />
              <span>Source</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
