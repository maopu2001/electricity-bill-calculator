"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BillResult, formatCurrency } from "@/lib/tariff";
import { Layers, Info } from "lucide-react";

interface SlabBreakdownProps {
  result: BillResult;
}

export function SlabBreakdown({ result }: SlabBreakdownProps) {
  const activeSlabs = result.slabBreakdown.filter((s) => s.isActive && s.unitsInSlab > 0);

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-5">
      <CardHeader className="p-0 pb-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span className="p-1 rounded-md bg-primary/10 text-primary">
                <Layers className="size-4" />
              </span>
              Slab-wise Tier Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              BERC stepped tariff allocation across billing tiers
            </CardDescription>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <button type="button" className="cursor-help text-muted-foreground hover:text-foreground">
                  <Info className="size-4" />
                </button>
              }
            />
            <TooltipContent side="top" className="max-w-xs text-xs">
              Tariff uses progressive tiered calculation. Units above 75 kWh are charged step-by-step in respective slabs.
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* Multi-Segment Usage Bar */}
        {result.totalUnits > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Slab Distribution</span>
              <span className="tabular-nums font-medium text-foreground">{result.totalUnits} kWh total</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex p-0.5 gap-0.5 border border-border/40">
              {activeSlabs.map((s, i) => {
                const percentage = (s.unitsInSlab / result.totalUnits) * 100;
                return (
                  <div
                    key={i}
                    className="h-full rounded-xs transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: s.slab.color,
                    }}
                    title={`${s.slab.label}: ${s.unitsInSlab} kWh (${percentage.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Breakdown Table (sm and up) */}
        <div className="hidden sm:block rounded-xl border border-border/60 overflow-hidden bg-muted/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Slab Tier</TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Rate (Tk)</TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Units</TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount (৳)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.slabBreakdown.map((slabResult, i) => {
                const isCurrentActive = slabResult.isActive && slabResult.unitsInSlab > 0;
                return (
                  <TableRow
                    key={i}
                    className={`transition-colors border-b border-border/30 last:border-0 ${
                      isCurrentActive
                        ? "bg-primary/5 font-medium text-foreground"
                        : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    <TableCell className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: slabResult.slab.color }}
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          {slabResult.slab.label}
                        </span>
                        {isCurrentActive && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-primary/30 text-primary bg-primary/10">
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3 px-3.5 text-xs sm:text-sm tabular-nums text-muted-foreground">
                      ৳{slabResult.slab.energyRate.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right py-3 px-3.5 text-xs sm:text-sm tabular-nums font-medium">
                      {slabResult.unitsInSlab > 0 ? (
                        <span>{slabResult.unitsInSlab.toLocaleString()} <span className="text-[10px] text-muted-foreground">kWh</span></span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3 px-3.5 text-xs sm:text-sm tabular-nums font-semibold text-foreground">
                      {slabResult.cost > 0 ? (
                        formatCurrency(slabResult.cost)
                      ) : (
                        <span className="text-muted-foreground/50 font-normal">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Breakdown Card List (< sm) */}
        <div className="sm:hidden space-y-2">
          {result.slabBreakdown.map((slabResult, i) => {
            const isCurrentActive = slabResult.isActive && slabResult.unitsInSlab > 0;
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-[border-color,background-color] duration-150 ${
                  isCurrentActive
                    ? "border-primary/40 bg-primary/5 shadow-xs"
                    : "border-border/40 bg-muted/10 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: slabResult.slab.color }}
                    />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {slabResult.slab.label}
                    </span>
                    {isCurrentActive && (
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-3.5 border-primary/30 text-primary bg-primary/10 font-bold shrink-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-foreground shrink-0">
                    {slabResult.cost > 0 ? formatCurrency(slabResult.cost) : "৳0.00"}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1.5 pt-1.5 border-t border-border/30 font-mono">
                  <span>Rate: ৳{slabResult.slab.energyRate.toFixed(2)}/kWh</span>
                  <span>
                    Usage: <strong className="text-foreground">{slabResult.unitsInSlab > 0 ? `${slabResult.unitsInSlab} kWh` : "0 kWh"}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
