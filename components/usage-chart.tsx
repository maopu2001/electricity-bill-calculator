"use client";

import { BillResult, formatCurrency } from "@/lib/tariff";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface UsageChartProps {
  result: BillResult;
}

export function UsageChart({ result }: UsageChartProps) {
  const activeSlabs = result.slabBreakdown.filter((s) => s.isActive && s.unitsInSlab > 0);

  const data = activeSlabs.map((s) => ({
    name: s.slab.label,
    cost: parseFloat(s.cost.toFixed(2)),
    color: s.slab.color,
    units: s.unitsInSlab,
    rate: s.slab.energyRate,
  }));

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-4">
      <CardHeader className="p-0 pb-1">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <span className="p-1 rounded-md bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </span>
            Cost Distribution by Slab
          </CardTitle>
          <CardDescription className="text-xs">
            Visual breakdown of energy charges incurred per slab tier
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.length > 0 ? (
          <div className="h-[220px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tickFormatter={(val) => `৳${val}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 12, fill: "var(--foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-popover/95 p-3 text-popover-foreground shadow-lg backdrop-blur-sm text-xs space-y-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span>{d.name} Slab</span>
                          </div>
                          <div className="text-muted-foreground text-[11px] tabular-nums">
                            Rate: ৳{d.rate.toFixed(2)}/kWh
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
                            <span className="text-muted-foreground">Units:</span>
                            <span className="font-medium text-foreground tabular-nums">
                              {d.units} kWh
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className="font-bold text-primary tabular-nums">
                              {formatCurrency(d.cost)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="cost" radius={[0, 6, 6, 0]} barSize={22}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[180px] flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 border border-dashed border-border/60 rounded-xl bg-muted/10">
            <BarChart3 className="size-6 text-muted-foreground/40" />
            <span>Enter electricity usage above to generate cost distribution</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
