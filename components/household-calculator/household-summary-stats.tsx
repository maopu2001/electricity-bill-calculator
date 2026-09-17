"use client";

import { HouseholdCalculationResult } from "@/lib/appliance-types";
import { calculateBill } from "@/lib/tariff";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Calendar,
  Activity,
  Gauge,
  ArrowRight,
} from "lucide-react";

interface HouseholdSummaryStatsProps {
  result: HouseholdCalculationResult;
  demandKW: number;
  onApplyToBill: (units: number, demandKW: number) => void;
}

export function HouseholdSummaryStats({
  result,
  demandKW,
  onApplyToBill,
}: HouseholdSummaryStatsProps) {
  const bill = calculateBill(result.totalMonthlyKWh, demandKW);

  return (
    <div className="space-y-4">
      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden border border-border bg-card shadow-md sm:shadow-lg p-5 sm:p-6 space-y-5">
        {/* Glow ambient accent */}
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-primary/30 text-primary bg-primary/10"
              >
                Calculated Household Consumption
              </Badge>
              <span className="text-xs text-muted-foreground">
                ({result.items.length} Active Devices)
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-foreground">
                {result.totalMonthlyKWh.toFixed(2)}
              </span>
              <span className="text-base sm:text-lg font-semibold text-muted-foreground">
                kWh / month
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right p-3 rounded-xl bg-muted/30 border border-border/50 space-y-0.5">
            <div className="text-[11px] font-medium text-muted-foreground">
              Estimated Monthly Cost (BERC)
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              ৳ {bill.grandTotal.toLocaleString("en-BD", { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Includes demand + rebate + 5% VAT
            </div>
          </div>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Daily Average */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Activity className="size-3.5 text-primary" />
              <span>Daily Average</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {result.dailyAverageKWh.toFixed(2)}{" "}
              <span className="text-xs font-normal text-muted-foreground">kWh</span>
            </div>
          </div>

          {/* Annual Projection */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Calendar className="size-3.5 text-primary" />
              <span>Annual Load</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {Math.round(result.annualKWh).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">kWh</span>
            </div>
          </div>

          {/* Peak Connected Load */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Zap className="size-3.5 text-amber-500" />
              <span>Connected Peak</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {result.connectedPeakKW.toFixed(2)}{" "}
              <span className="text-xs font-normal text-muted-foreground">kW</span>
            </div>
          </div>

          {/* Suggested Sanction Demand */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Gauge className="size-3.5 text-emerald-500" />
              <span>Suggested Demand</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {result.suggestedDemandKW}{" "}
              <span className="text-xs font-normal text-muted-foreground">kW</span>
            </div>
          </div>
        </div>

        {/* Action Button: Push to main bill calculator */}
        <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            Transfer this exact kWh load to the Tariff Breakdown & Slabs analyzer.
          </p>
          <Button
            onClick={() => onApplyToBill(Math.round(result.totalMonthlyKWh * 100) / 100, result.suggestedDemandKW)}
            className="w-full sm:w-auto h-9 px-4 rounded-xl gap-2 font-medium shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <span>View Full Tariff Breakdown</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
