"use client";

import { useMemo, useState } from "react";
import { useHouseholdStore } from "@/hooks/use-household-store";
import { calculateHouseholdEnergy } from "@/lib/appliance-calc";
import { TemplateSelectorBar } from "./template-selector-bar";
import { ApplianceCatalogPicker } from "./appliance-catalog-picker";
import { CustomApplianceDialog } from "./custom-appliance-dialog";
import { ApplianceCardItem } from "./appliance-card-item";
import { HouseholdSummaryStats } from "./household-summary-stats";
import { TopConsumersCard } from "./top-consumers-card";
import { WhatIfSimulator } from "./what-if-simulator";
import { ApplianceBreakdownTable } from "./appliance-breakdown-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";

interface HouseholdCalculatorViewProps {
  demandKW: number;
  onApplyToBill: (units: number, demandKW: number) => void;
}

export function HouseholdCalculatorView({
  demandKW,
  onApplyToBill,
}: HouseholdCalculatorViewProps) {
  const {
    appliances,
    isHydrated,
    addAppliance,
    updateAppliance,
    removeAppliance,
    duplicateAppliance,
    toggleAppliance,
    loadTemplate,
    resetToDefault,
    clearAll,
  } = useHouseholdStore();

  const [searchFilter, setSearchFilter] = useState("");

  const calculationResult = useMemo(() => {
    return calculateHouseholdEnergy(appliances);
  }, [appliances]);

  const filteredAppliances = useMemo(() => {
    if (!searchFilter.trim()) return appliances;
    const query = searchFilter.toLowerCase();
    return appliances.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query),
    );
  }, [appliances, searchFilter]);

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="h-48 border border-border bg-card/60 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-32 border border-border bg-card/60 rounded-2xl" />
          <Card className="h-32 border border-border bg-card/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Quick Household Templates Bar */}
      <TemplateSelectorBar
        onSelectTemplate={loadTemplate}
        onClearAll={clearAll}
        onResetDefault={resetToDefault}
        activeItemCount={appliances.length}
      />

      {/* 2. Master Hero Summary Card */}
      <HouseholdSummaryStats
        result={calculationResult}
        demandKW={demandKW}
        onApplyToBill={onApplyToBill}
      />

      {/* 3. Top Consumers & What-If Analysis Grid */}
      {appliances.length > 0 && calculationResult.totalMonthlyKWh > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <TopConsumersCard result={calculationResult} />
          <WhatIfSimulator appliances={appliances} demandKW={demandKW} />
        </div>
      )}

      {/* 4. Appliance Inventory Header & Action Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Household Appliance Inventory
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                {appliances.length} Devices
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure power ratings, usage frequency, and duty cycle for each
              room or appliance.
            </p>
          </div>

          {/* Action Buttons: Add from catalog or custom */}
          <div className="flex items-center gap-2 shrink-0">
            <ApplianceCatalogPicker onAddAppliance={addAppliance} />
            <CustomApplianceDialog onAddAppliance={addAppliance} />
          </div>
        </div>

        {/* Filter search bar if multiple appliances */}
        {appliances.length > 4 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter inventory list..."
              className="pl-9 h-9 sm:h-10 rounded-xl bg-muted/30 border-border/50 text-xs sm:text-sm"
            />
          </div>
        )}

        {/* Appliance Cards Deck */}
        {appliances.length === 0 ? (
          <Card className="border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 rounded-2xl">
            <div className="size-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center">
              <Home className="size-6 text-primary" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-semibold text-base text-foreground">
                No Appliances Added Yet
              </h3>
              <p className="text-xs text-muted-foreground">
                Start by picking from standard presets above or add your first
                device from the catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <Button
                onClick={() => loadTemplate("bachelor_1bhk")}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs cursor-pointer"
              >
                Load Bachelor Template
              </Button>
              <Button
                onClick={() => loadTemplate("family_2_3bhk")}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs cursor-pointer"
              >
                Load Family Template
              </Button>
              <Button
                onClick={() => loadTemplate("ac_household")}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs cursor-pointer"
              >
                Load AC Household Template
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppliances.map((appliance) => (
              <ApplianceCardItem
                key={appliance.instanceId}
                appliance={appliance}
                onUpdate={updateAppliance}
                onRemove={removeAppliance}
                onDuplicate={duplicateAppliance}
                onToggle={toggleAppliance}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Complete Itemized Breakdown Table */}
      {appliances.length > 0 && calculationResult.totalMonthlyKWh > 0 && (
        <div className="pt-2">
          <ApplianceBreakdownTable
            items={calculationResult.items}
            totalKWh={calculationResult.totalMonthlyKWh}
          />
        </div>
      )}
    </div>
  );
}
