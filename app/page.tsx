"use client";

import { useMemo } from "react";
import Image from "next/image";
import { CalculatorForm } from "@/components/calculator-form";
import { BillSummary } from "@/components/bill-summary";
import { AmountSummary } from "@/components/amount-summary";
import { SlabBreakdown } from "@/components/slab-breakdown";
import { UsageChart } from "@/components/usage-chart";
import { TariffInfo } from "@/components/tariff-info";
import { calculateBill, calculateUnitsFromAmount } from "@/lib/tariff";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ShieldCheck } from "lucide-react";
import { useCalculatorStore } from "@/hooks/use-calculator-store";

export default function Home() {
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

  const hasResult = isHydrated && ((mode === "units" && units > 0) || (mode === "amount" && amount > 0));

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Dynamic ambient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.54_0.17_155/0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,oklch(0.68_0.19_155/0.09),transparent_70%)] blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.62_0.16_195/0.05),transparent_70%)] blur-3xl" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative size-9 rounded-xl border border-border/60 bg-card p-1 shadow-xs flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Electricity Bill Calculator"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
                  VoltCalc
                </span>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-normal"
                >
                  BERC 230/400V
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Bangladesh Electricity Bill & Tariff Calculator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground px-2.5 py-1 rounded-full border border-border/40 bg-muted/30">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Schedule</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
        {/* Intro Subtitle */}
        <div className="text-center sm:text-left space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Domestic Electricity Tariff Calculator
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Accurate monthly bill estimation with progressive slab breakdown, demand charges, 0.5% statutory rebate, and 5% VAT.
          </p>
        </div>

        {/* Two-Column Bento Layout */}
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
                Subtotal = Energy Cost + Demand Fee (৳42/kW). Rebate of 0.5% is deducted from subtotal, followed by 5% VAT on the post-rebate amount.
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
                    Enter your energy consumption in kWh or budget in ৳ on the left to calculate live tariff breakdown.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Tariff Reference Section */}
        <div className="pt-2">
          <TariffInfo />
        </div>
      </main>

      {/* Minimalist Clean Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            VoltCalc © {new Date().getFullYear()} · Based on official BERC 230/400V LT-A schedule
          </span>
          <span className="text-[11px] text-muted-foreground/70">
            For estimation and planning purposes.
          </span>
        </div>
      </footer>
    </div>
  );
}
