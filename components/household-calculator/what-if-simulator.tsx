"use client";

import { useMemo } from "react";
import { UserAppliance } from "@/lib/appliance-types";
import { calculateHouseholdEnergy, simulateWhatIf } from "@/lib/appliance-calc";
import { calculateBill } from "@/lib/tariff";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, TrendingDown } from "lucide-react";

interface WhatIfSimulatorProps {
  appliances: UserAppliance[];
  demandKW: number;
}

export function WhatIfSimulator({ appliances, demandKW }: WhatIfSimulatorProps) {
  const currentResult = useMemo(() => {
    return calculateHouseholdEnergy(appliances);
  }, [appliances]);

  const currentBill = useMemo(() => {
    return calculateBill(currentResult.totalMonthlyKWh, demandKW);
  }, [currentResult.totalMonthlyKWh, demandKW]);

  // Generate applicable smart scenarios
  const scenarios = useMemo(() => {
    const list: {
      id: string;
      title: string;
      description: string;
      diffKWh: number;
      savedCost: number;
      pct: number;
    }[] = [];

    const hasAC = appliances.some(
      (a) => a.enabled && a.category === "air_conditioning" && a.hoursPerDay > 2
    );
    const hasNonBLDCFans = appliances.some(
      (a) => a.enabled && a.category === "fans_cooling" && a.powerW >= 55
    );
    const hasStandbyLoads = appliances.some(
      (a) => a.enabled && a.standbyW > 0
    );
    const hasLongLights = appliances.some(
      (a) => a.enabled && a.category === "lighting" && a.hoursPerDay > 4
    );

    // Scenario 1: AC -2 hours/day
    if (hasAC) {
      const sim = simulateWhatIf(
        appliances,
        "AC 2 Hours Less",
        "Reduce air conditioning runtime by 2 hours each day",
        (items) =>
          items.map((item) =>
            item.category === "air_conditioning"
              ? { ...item, hoursPerDay: Math.max(0, item.hoursPerDay - 2) }
              : item
          )
      );
      const simBill = calculateBill(sim.modifiedKWh, demandKW);
      const savedBDT = currentBill.grandTotal - simBill.grandTotal;
      list.push({
        id: "ac-2h",
        title: "Run AC 2 hours less daily",
        description: "Set a sleep timer or raise thermostat to 26°C",
        diffKWh: Math.abs(sim.differenceKWh),
        savedCost: Math.max(0, savedBDT),
        pct: Math.abs(sim.percentageChange),
      });
    }

    // Scenario 2: Switch fans to 35W BLDC
    if (hasNonBLDCFans) {
      const sim = simulateWhatIf(
        appliances,
        "Upgrade to BLDC Fans",
        "Replace standard 65W/75W ceiling fans with 35W BLDC smart motor fans",
        (items) =>
          items.map((item) =>
            item.category === "fans_cooling" && item.powerW > 35
              ? { ...item, powerW: 35 }
              : item
          )
      );
      const simBill = calculateBill(sim.modifiedKWh, demandKW);
      const savedBDT = currentBill.grandTotal - simBill.grandTotal;
      list.push({
        id: "bldc-fan",
        title: "Upgrade to 35W BLDC Fans",
        description: "High-efficiency brushless motors save over 45% fan power",
        diffKWh: Math.abs(sim.differenceKWh),
        savedCost: Math.max(0, savedBDT),
        pct: Math.abs(sim.percentageChange),
      });
    }

    // Scenario 3: Kill Standby Power
    if (hasStandbyLoads) {
      const sim = simulateWhatIf(
        appliances,
        "Cut Vampire Standby Draw",
        "Turn off main switch on TVs, monitors, and chargers when not in use",
        (items) => items.map((item) => ({ ...item, standbyW: 0 }))
      );
      const simBill = calculateBill(sim.modifiedKWh, demandKW);
      const savedBDT = currentBill.grandTotal - simBill.grandTotal;
      list.push({
        id: "kill-standby",
        title: "Eliminate Standby Vampire Draw",
        description: "Switch off wall sockets for entertainment & chargers",
        diffKWh: Math.abs(sim.differenceKWh),
        savedCost: Math.max(0, savedBDT),
        pct: Math.abs(sim.percentageChange),
      });
    }

    // Scenario 4: Turn off lights 1h earlier
    if (hasLongLights) {
      const sim = simulateWhatIf(
        appliances,
        "Lighting 1 Hour Less",
        "Turn off unnecessary lighting 1 hour earlier per evening",
        (items) =>
          items.map((item) =>
            item.category === "lighting"
              ? { ...item, hoursPerDay: Math.max(0, item.hoursPerDay - 1) }
              : item
          )
      );
      const simBill = calculateBill(sim.modifiedKWh, demandKW);
      const savedBDT = currentBill.grandTotal - simBill.grandTotal;
      list.push({
        id: "lights-1h",
        title: "Reduce Lighting 1 hr daily",
        description: "Optimize room illumination and utilize natural daylight",
        diffKWh: Math.abs(sim.differenceKWh),
        savedCost: Math.max(0, savedBDT),
        pct: Math.abs(sim.percentageChange),
      });
    }

    return list;
  }, [appliances, demandKW, currentBill.grandTotal]);

  if (scenarios.length === 0 || currentResult.totalMonthlyKWh === 0) {
    return null;
  }

  return (
    <Card className="border border-border bg-card shadow-sm sm:shadow-md p-5 sm:p-6 space-y-4">
      <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingDown className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
              What-If Energy Savings Simulator
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Potential monthly reductions tailored to your equipment
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
          Smart Insights
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/[0.03] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-xs sm:text-sm text-foreground">
                  {sc.title}
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shrink-0">
                  <ArrowDownRight className="size-3.5 mr-0.5" />
                  -{sc.diffKWh.toFixed(1)} kWh
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {sc.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-emerald-500/10 text-[11px] font-mono">
                <span className="text-muted-foreground">Est. Bill Impact:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Save ~৳{Math.round(sc.savedCost)} / mo (-{sc.pct.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
