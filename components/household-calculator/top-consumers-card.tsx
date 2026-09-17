"use client";

import { HouseholdCalculationResult } from "@/lib/appliance-types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, PieChart } from "lucide-react";
import { ApplianceIcon } from "./appliance-icon";
import { APPLIANCE_CATALOG } from "@/lib/appliance-catalog";

interface TopConsumersCardProps {
  result: HouseholdCalculationResult;
}

export function TopConsumersCard({ result }: TopConsumersCardProps) {
  if (result.topConsumers.length === 0 || result.totalMonthlyKWh === 0) {
    return null;
  }

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-4">
      <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
              Top Electricity Consumers
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Highest energy drainers in your household
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono">
          {result.topConsumers.length} High Loads
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div className="space-y-2.5">
          {result.topConsumers.map((item, index) => {
            const catalog = APPLIANCE_CATALOG.find((c) => c.name === item.name);
            const percentage = item.percentageOfTotal;
            return (
              <div
                key={item.instanceId}
                className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-5 rounded-md bg-muted text-muted-foreground font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <ApplianceIcon
                      name={catalog?.iconName}
                      className="size-3.5 text-primary shrink-0"
                    />
                    <span className="font-medium text-foreground truncate">
                      {item.name}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-muted-foreground text-[11px]">
                        ({item.quantity}x)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-semibold text-foreground">
                      {item.totalKWh.toFixed(1)} kWh
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary font-bold"
                    >
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar Meter */}
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Distribution Pills */}
        {result.categorySummaries.length > 0 && (
          <div className="pt-2 border-t border-border/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <PieChart className="size-3.5 text-primary" />
              <span>Category Distribution</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.categorySummaries.map((cat) => (
                <div
                  key={cat.category}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/50 bg-card/60 text-[11px]"
                >
                  <ApplianceIcon name={cat.iconName} className="size-3 text-primary" />
                  <span className="font-medium text-foreground">{cat.label}</span>
                  <span className="font-mono text-muted-foreground">
                    {cat.totalKWh.toFixed(1)} kWh ({cat.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
