"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SLABS } from "@/lib/tariff";
import { ChevronDown, FileText, ExternalLink, ShieldCheck, Zap, Percent, Landmark } from "lucide-react";
import Link from "next/link";

export function TariffInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border border-border bg-card shadow-sm sm:shadow-md overflow-hidden transition-all">
        <CollapsibleTrigger
          render={
            <button
              type="button"
              className="w-full text-left p-5 sm:p-6 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-pointer group"
            />
          }
        >
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <FileText className="size-4" />
            </span>
            <div>
              <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                Official BERC Residential (LT-A) Tariff Schedule
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 bg-muted border-border font-normal">
                  Gazette 2024–2026
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                View statutory energy rates, demand fees, rebate & VAT calculation rules
              </p>
            </div>
          </div>

          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180 text-foreground" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 px-5 sm:px-6 pb-6 space-y-5 border-t border-border/40">
            {/* Tariff Schedule Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden mt-4 bg-muted/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                    <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Slab Range</TableHead>
                    <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Energy Rate (Tk/kWh)</TableHead>
                    <TableHead className="py-2.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Demand Fee (Tk/kW/mo)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SLABS.map((slab, i) => (
                    <TableRow key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                      <TableCell className="py-3 px-3.5">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: slab.color }}
                          />
                          <span>{slab.label}</span>
                          {slab.label === "Life Line" && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                              Subsidized
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3 px-3.5 text-xs sm:text-sm tabular-nums font-semibold text-foreground">
                        ৳{slab.energyRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right py-3 px-3.5 text-xs sm:text-sm tabular-nums text-muted-foreground">
                        ৳{slab.demandRate.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Explanatory notes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  <Zap className="size-3.5 text-primary" />
                  <span>Stepped Billing</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Usage above 75 kWh is calculated progressively through each successive tier.
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  <Percent className="size-3.5 text-primary" />
                  <span>0.5% Timely Rebate</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  A 0.5% statutory rebate is deducted from subtotal (Energy + Demand charges).
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  <Landmark className="size-3.5 text-primary" />
                  <span>5.0% VAT</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Govt. Value Added Tax (VAT) of 5% is calculated on the amount after rebate.
                </p>
              </div>
            </div>

            {/* Official Source Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-muted-foreground border-t border-border/40">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                Bangladesh Energy Regulatory Commission (BERC)
              </span>

              <Link
                href="https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-bpdb/2026/5/e37ed032-9fe9-4717-b84c-92d06c96bcde.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                Official Gazette Notice (PDF)
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
