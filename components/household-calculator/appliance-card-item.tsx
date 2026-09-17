"use client";

import { useMemo, useState } from "react";
import { UserAppliance, UsageMode } from "@/lib/appliance-types";
import { APPLIANCE_CATALOG } from "@/lib/appliance-catalog";
import { calculateApplianceEnergy } from "@/lib/appliance-calc";
import { ApplianceIcon } from "./appliance-icon";
import { Button } from "@/components/ui/button";
import { NumericInput } from "@/components/ui/numeric-input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Minus,
  Plus,
  Trash2,
  Copy,
  Sliders,
  Power,
  ChevronDown,
  Info,
} from "lucide-react";

interface ApplianceCardItemProps {
  appliance: UserAppliance;
  onUpdate: (instanceId: string, updates: Partial<UserAppliance>) => void;
  onRemove: (instanceId: string) => void;
  onDuplicate: (instanceId: string) => void;
  onToggle: (instanceId: string) => void;
}

export function ApplianceCardItem({
  appliance,
  onUpdate,
  onRemove,
  onDuplicate,
  onToggle,
}: ApplianceCardItemProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Look up catalog metadata for presets & icon
  const catalogItem = useMemo(() => {
    return APPLIANCE_CATALOG.find((c) => c.id === appliance.catalogId);
  }, [appliance.catalogId]);

  const energyResult = useMemo(() => {
    return calculateApplianceEnergy(appliance);
  }, [appliance]);

  const presets = catalogItem?.presets || [];

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 space-y-4 ${
        appliance.enabled
          ? "border-border/80 bg-card shadow-xs hover:shadow-md hover:border-border"
          : "border-border/40 bg-card/40 opacity-60"
      }`}
    >
      {/* Card Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onToggle(appliance.instanceId)}
            className={`size-11 sm:size-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
              appliance.enabled
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            title={appliance.enabled ? "Disable device" : "Enable device"}
          >
            <ApplianceIcon name={catalogItem?.iconName} className="size-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-foreground truncate">
                {appliance.name}
              </span>
              {!appliance.enabled && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Disabled
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
              <span>
                {appliance.quantity} × {appliance.powerW}W
              </span>
              {appliance.dutyCycle < 1.0 && (
                <>
                  <span>·</span>
                  <span className="text-primary font-medium">
                    {Math.round(appliance.dutyCycle * 100)}% duty
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Header: Monthly kWh Pill & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="font-bold text-sm sm:text-base font-mono text-foreground">
              {energyResult.totalKWh.toFixed(2)}{" "}
              <span className="text-xs font-normal text-muted-foreground">kWh</span>
            </div>
            <div className="text-[10px] text-muted-foreground">per month</div>
          </div>

          <div className="flex items-center gap-1 pl-1 border-l border-border/50">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicate(appliance.instanceId)}
                    className="size-8 sm:size-7 rounded-lg text-muted-foreground hover:text-foreground active:scale-[0.97] cursor-pointer"
                    aria-label="Duplicate appliance"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Duplicate device</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(appliance.instanceId)}
                    className="size-8 sm:size-7 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 active:scale-[0.97] cursor-pointer"
                    aria-label="Delete appliance"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Remove device</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
      {appliance.enabled && (
        <div className="space-y-3.5 pt-1 border-t border-border/40 text-xs">
          {/* Top Control Bar: Quantity Stepper & Power Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Quantity Stepper */}
            <div className="sm:col-span-4 flex items-center justify-between p-1.5 bg-muted/40 rounded-xl border border-border/50">
              <span className="text-[11px] font-medium text-muted-foreground pl-2">
                Quantity:
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onUpdate(appliance.instanceId, {
                      quantity: Math.max(1, appliance.quantity - 1),
                    })
                  }
                  disabled={appliance.quantity <= 1}
                  className="size-8 sm:size-7 rounded-lg active:scale-[0.97] cursor-pointer"
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-7 text-center font-mono font-semibold text-foreground text-sm">
                  {appliance.quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onUpdate(appliance.instanceId, {
                      quantity: appliance.quantity + 1,
                    })
                  }
                  className="size-8 sm:size-7 rounded-lg active:scale-[0.97] cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Power Custom Input */}
            <div className="sm:col-span-8 flex items-center gap-2">
              <div className="relative flex-1">
                <NumericInput
                  min={0}
                  allowDecimals
                  value={appliance.powerW}
                  onValueChange={(val) =>
                    onUpdate(appliance.instanceId, {
                      powerW: val,
                    })
                  }
                  className="h-10 pr-12 rounded-xl bg-muted/30 font-mono text-xs sm:text-sm font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground pointer-events-none">
                  Watts
                </span>
              </div>
            </div>
          </div>

          {/* Quick Wattage Preset Chips */}
          {presets.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap mr-0.5">
                Presets:
              </span>
              {presets.map((preset) => {
                const isSelected = appliance.powerW === preset.watts;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      onUpdate(appliance.instanceId, { powerW: preset.watts })
                    }
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-transform duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                        : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Usage Pattern & Frequency Config */}
          <div className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-foreground">
                Usage Pattern
              </span>
              <div className="inline-flex rounded-lg bg-muted/60 p-0.5 border border-border/40">
                {(["daily", "weekly", "monthly"] as UsageMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      onUpdate(appliance.instanceId, { usageMode: mode })
                    }
                    className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md capitalize transition-all cursor-pointer ${
                      appliance.usageMode === mode
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Inputs */}
            {appliance.usageMode === "daily" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Hours / Day</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.hoursPerDay}h
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={24}
                    allowDecimals
                    value={appliance.hoursPerDay}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        hoursPerDay: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Days / Month</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.daysPerMonth}d
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={31}
                    allowDecimals={false}
                    value={appliance.daysPerMonth}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        daysPerMonth: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            {appliance.usageMode === "weekly" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Hours / Day</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.hoursPerDay}h
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={24}
                    allowDecimals
                    value={appliance.hoursPerDay}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        hoursPerDay: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Days / Week</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.daysPerWeek}d
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={7}
                    allowDecimals={false}
                    value={appliance.daysPerWeek}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        daysPerWeek: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            {appliance.usageMode === "monthly" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Hours / Use</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.hoursPerUse}h
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={24}
                    allowDecimals
                    value={appliance.hoursPerUse}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        hoursPerUse: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Uses / Month</span>
                    <span className="font-mono font-semibold text-foreground">
                      {appliance.usesPerMonth}
                    </span>
                  </div>
                  <NumericInput
                    min={0}
                    max={120}
                    allowDecimals={false}
                    value={appliance.usesPerMonth}
                    onValueChange={(val) =>
                      onUpdate(appliance.instanceId, {
                        usesPerMonth: val,
                      })
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Advanced Section: Operating Duty Cycle & Standby Power */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <Sliders className="size-3" />
              <span>
                {showAdvanced ? "Hide advanced tuning" : "Tune duty cycle & standby power"}
              </span>
              <ChevronDown
                className={`size-3 transition-transform duration-150 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-2.5 p-3 rounded-xl bg-muted/20 border border-border/50 space-y-3 animate-in fade-in-50 duration-150">
                {/* Operating Duty Cycle Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <span>Estimated Operating Duty Cycle</span>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <span className="cursor-help">
                              <Info className="size-3 text-muted-foreground" />
                            </span>
                          }
                        />
                        <TooltipContent className="max-w-xs text-xs">
                          Actual compressor or heating element active running time percentage (e.g., ~60% for AC inverter, ~50% for refrigerator).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-mono font-semibold text-primary">
                      {Math.round(appliance.dutyCycle * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[Math.round(appliance.dutyCycle * 100)]}
                    min={5}
                    max={100}
                    step={5}
                    onValueChange={(val) => {
                      const num = Array.isArray(val) ? val[0] : val;
                      onUpdate(appliance.instanceId, {
                        dutyCycle: num / 100,
                      });
                    }}
                    className="py-1.5 cursor-pointer touch-none"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>5% (Cycling)</span>
                    <span>100% (Continuous Load)</span>
                  </div>
                </div>

                {/* Standby Power Input */}
                <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-3 items-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                      <Power className="size-3 text-amber-500" />
                      <span>Standby Power</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Vampire power draw when idle
                    </p>
                  </div>
                  <div className="relative">
                    <NumericInput
                      min={0}
                      allowDecimals
                      value={appliance.standbyW}
                      onValueChange={(val) =>
                        onUpdate(appliance.instanceId, {
                          standbyW: val,
                        })
                      }
                      className="h-8 pr-7 rounded-lg bg-background font-mono text-xs"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground pointer-events-none">
                      W
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
