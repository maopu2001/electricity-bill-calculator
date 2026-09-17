"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BillResult, formatCurrency, getActiveSlabIndex, SLABS } from "@/lib/tariff";
import { Receipt, TrendingUp, Landmark, BadgePercent, Check, Copy, Zap } from "lucide-react";

interface BillSummaryProps {
  result: BillResult;
}

export function BillSummary({ result }: BillSummaryProps) {
  const [copied, setCopied] = useState(false);
  const activeIndex = getActiveSlabIndex(result.totalUnits);
  const activeSlab = SLABS[activeIndex];

  const handleCopy = async () => {
    const text = `⚡ Electricity Bill Calculation (BERC Residential LT-A)
Total Units: ${result.totalUnits} kWh
Demand Load: ${result.demandKW} kW
---------------------------------
Energy Charge: ${formatCurrency(result.totalEnergyCharge)}
Demand Charge: ${formatCurrency(result.totalDemandCharge)}
Subtotal: ${formatCurrency(result.subtotal)}
Rebate (0.5%): -${formatCurrency(result.rebate)}
VAT (5%): +${formatCurrency(result.vat)}
---------------------------------
Grand Total: ${formatCurrency(result.grandTotal)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Card className="relative overflow-hidden border border-primary/30 bg-card shadow-md sm:shadow-lg p-4 sm:p-6">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 size-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <CardContent className="relative p-0 space-y-4 sm:space-y-6">
        {/* Header line */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Receipt className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated Total Bill
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="border border-primary/30 bg-primary/10 text-primary font-medium px-2.5 py-0.5 text-xs flex items-center gap-1.5"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              {activeSlab.label === "Life Line" ? "Life Line (0–50)" : `${activeSlab.label} kWh Slab`}
            </Badge>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="size-9 rounded-xl border-border/60 hover:bg-muted/60 active:scale-[0.97] transition-transform duration-150 cursor-pointer"
                    aria-label="Copy bill calculation summary"
                  />
                }
              >
                {copied ? (
                  <Check className="size-4 text-primary" />
                ) : (
                  <Copy className="size-4 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {copied ? "Copied to clipboard!" : "Copy calculation breakdown"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Grand Total Hero Number */}
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground tabular-nums flex items-baseline gap-1.5 font-mono">
            <span>{formatCurrency(result.grandTotal)}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
            <Zap className="size-3.5 text-primary shrink-0" />
            <span>
              Computed for <strong className="font-semibold text-foreground">{result.totalUnits} kWh</strong> usage & <strong className="font-semibold text-foreground">{result.demandKW} kW</strong> demand
            </span>
          </p>
        </div>

        <Separator className="bg-border/60" />

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <TrendingUp className="size-3.5 text-primary" />
              <span>Energy Charge</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground tabular-nums">
              {formatCurrency(result.totalEnergyCharge)}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Landmark className="size-3.5 text-primary" />
              <span>Demand Charge</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground tabular-nums">
              {formatCurrency(result.totalDemandCharge)}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <BadgePercent className="size-3.5 text-primary" />
              <span>Rebate (0.5%)</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tracking-tight text-primary tabular-nums">
              -{formatCurrency(result.rebate)}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Receipt className="size-3.5 text-muted-foreground" />
              <span>VAT (5%)</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground tabular-nums">
              +{formatCurrency(result.vat)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
