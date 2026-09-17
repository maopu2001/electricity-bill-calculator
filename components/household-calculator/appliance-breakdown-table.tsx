"use client";

import { ApplianceEnergyResult } from "@/lib/appliance-types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableProperties } from "lucide-react";

interface ApplianceBreakdownTableProps {
  items: ApplianceEnergyResult[];
  totalKWh: number;
}

export function ApplianceBreakdownTable({
  items,
  totalKWh,
}: ApplianceBreakdownTableProps) {
  if (items.length === 0) return null;

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-4 sm:p-6 space-y-4">
      <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <TableProperties className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
              Appliance Consumption Table
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Itemized inventory specifications and computed monthly energy
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
          {items.length} Items
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop Table (sm and up) */}
        <div className="hidden sm:block rounded-xl border border-border/60 overflow-hidden bg-muted/10">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground">
                  Appliance
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-center">
                  Qty
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-right">
                  Power
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-right">
                  Duty
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-right">
                  Active Hrs/Mo
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-right">
                  Monthly kWh
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold text-foreground text-right">
                  Share
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs font-mono">
              {items.map((item) => (
                <TableRow key={item.instanceId} className="border-border/40 hover:bg-muted/30">
                  <TableCell className="py-2.5 px-3.5 font-sans font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-center text-muted-foreground">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-right text-foreground">
                    {item.powerW} W
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-right text-muted-foreground">
                    {Math.round(item.dutyCycle * 100)}%
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-right text-muted-foreground">
                    {item.effectiveActiveHoursPerMonth.toFixed(1)} h
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-right font-semibold text-foreground">
                    {item.totalKWh.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2.5 px-3.5 text-right font-medium text-primary">
                    {item.percentageOfTotal.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 border-border/80 bg-muted/30 font-bold">
                <TableCell colSpan={5} className="py-3 px-3.5 font-sans text-foreground">
                  Total Monthly Household Energy
                </TableCell>
                <TableCell className="py-3 px-3.5 text-right text-primary text-sm">
                  {totalKWh.toFixed(2)} kWh
                </TableCell>
                <TableCell className="py-3 px-3.5 text-right text-primary">
                  100%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List (< sm) */}
        <div className="sm:hidden space-y-2.5">
          {items.map((item) => (
            <div
              key={item.instanceId}
              className="p-3 rounded-xl border border-border/60 bg-muted/10 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {item.name}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-[10px] text-muted-foreground">
                      ({item.quantity}x)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                  <span className="font-bold text-foreground">
                    {item.totalKWh.toFixed(2)} kWh
                  </span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-bold bg-primary/10 text-primary">
                    {item.percentageOfTotal.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border/30 font-mono">
                <div>
                  <span className="text-muted-foreground/70">Power: </span>
                  <span className="text-foreground font-medium">{item.powerW}W</span>
                </div>
                <div>
                  <span className="text-muted-foreground/70">Duty: </span>
                  <span className="text-foreground font-medium">{Math.round(item.dutyCycle * 100)}%</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground/70">Hrs: </span>
                  <span className="text-foreground font-medium">{item.effectiveActiveHoursPerMonth.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Total Summary */}
          <div className="p-3 rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Total Consumption</span>
            <span className="text-primary font-mono text-sm">{totalKWh.toFixed(2)} kWh / mo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
