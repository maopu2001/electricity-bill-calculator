"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CATEGORY_DEFINITIONS } from "@/lib/appliance-catalog";
import {
  UserAppliance,
  ApplianceCategory,
  UsageMode,
} from "@/lib/appliance-types";
import { generateApplianceId } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface CustomApplianceDialogProps {
  onAddAppliance: (item: UserAppliance) => void;
}

export function CustomApplianceDialog({
  onAddAppliance,
}: CustomApplianceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ApplianceCategory>("other");
  const [powerW, setPowerW] = useState("100");
  const [quantity, setQuantity] = useState("1");
  const [usageMode, setUsageMode] = useState<UsageMode>("daily");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [hoursPerUse, setHoursPerUse] = useState("1");
  const [usesPerMonth, setUsesPerMonth] = useState("10");
  const [dutyCyclePct, setDutyCyclePct] = useState("100");
  const [standbyW, setStandbyW] = useState("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedWatts = Math.max(1, parseFloat(powerW) || 100);
    const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);
    const parsedDuty = Math.max(
      0.05,
      Math.min(1.0, (parseFloat(dutyCyclePct) || 100) / 100),
    );
    const parsedStandby = Math.max(0, parseFloat(standbyW) || 0);

    const newAppliance: UserAppliance = {
      instanceId: generateApplianceId("custom"),
      name: name.trim(),
      category,
      quantity: parsedQty,
      powerW: parsedWatts,
      usageMode,
      hoursPerDay: Math.max(0, Math.min(24, parseFloat(hoursPerDay) || 0)),
      daysPerMonth: Math.max(1, Math.min(31, parseInt(daysPerMonth, 10) || 30)),
      daysPerWeek: Math.max(0, Math.min(7, parseInt(daysPerWeek, 10) || 7)),
      hoursPerUse: Math.max(0, Math.min(24, parseFloat(hoursPerUse) || 1)),
      usesPerMonth: Math.max(0, parseInt(usesPerMonth, 10) || 10),
      dutyCycle: parsedDuty,
      standbyW: parsedStandby,
      enabled: true,
    };

    onAddAppliance(newAppliance);
    setOpen(false);
    setName("");
    setPowerW("100");
    setQuantity("1");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-9 gap-1.5 font-medium border-dashed border-border/80 hover:border-primary/60 cursor-pointer active:scale-[0.98]"
          >
            <PlusCircle className="size-4 text-primary" />
            <span>Custom Device</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl gap-0">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full min-h-0 flex-1"
        >
          <DialogHeader className="p-2 border-b border-border/40 shrink-0">
            <DialogTitle>Add Custom Appliance</DialogTitle>
            <DialogDescription>
              Configure any electrical device not listed in the standard
              catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-4 text-xs scrollbar-thin">
            {/* Device Name */}
            <div className="space-y-1.5">
              <Label htmlFor="custom-appliance-name">Appliance Name</Label>
              <Input
                id="custom-appliance-name"
                required
                placeholder="e.g., Aquarium Filter, Dehumidifier, 3D Printer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl bg-muted/40"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => {
                  if (val) setCategory(val as ApplianceCategory);
                }}
              >
                <SelectTrigger className="min-h-10 rounded-xl max-w-62 w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_DEFINITIONS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Power & Quantity Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="custom-power">Rated Power (Watts)</Label>
                <NumericInput
                  id="custom-power"
                  min={0}
                  allowDecimals
                  value={powerW}
                  onValueChange={(val) => setPowerW(val.toString())}
                  className="h-10 rounded-xl bg-muted/40 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custom-qty">Quantity</Label>
                <NumericInput
                  id="custom-qty"
                  min={0}
                  allowDecimals={false}
                  value={quantity}
                  onValueChange={(val) => setQuantity(val.toString())}
                  className="h-10 rounded-xl bg-muted/40 font-mono"
                />
              </div>
            </div>

            {/* Usage Pattern Mode */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <Label>Usage Pattern</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["daily", "weekly", "monthly"] as UsageMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setUsageMode(mode)}
                    className={`py-2 text-xs font-medium rounded-xl border capitalize transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                      usageMode === mode
                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Usage Inputs */}
            {usageMode === "daily" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-hrs-daily"
                    className="text-muted-foreground"
                  >
                    Hours per Day
                  </Label>
                  <NumericInput
                    id="custom-hrs-daily"
                    min={0}
                    max={24}
                    allowDecimals
                    value={hoursPerDay}
                    onValueChange={(val) => setHoursPerDay(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-days-month"
                    className="text-muted-foreground"
                  >
                    Days per Month
                  </Label>
                  <NumericInput
                    id="custom-days-month"
                    min={0}
                    max={31}
                    allowDecimals={false}
                    value={daysPerMonth}
                    onValueChange={(val) => setDaysPerMonth(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
              </div>
            )}

            {usageMode === "weekly" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-hrs-weekly"
                    className="text-muted-foreground"
                  >
                    Hours per Day
                  </Label>
                  <NumericInput
                    id="custom-hrs-weekly"
                    min={0}
                    max={24}
                    allowDecimals
                    value={hoursPerDay}
                    onValueChange={(val) => setHoursPerDay(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-days-weekly"
                    className="text-muted-foreground"
                  >
                    Days per Week
                  </Label>
                  <NumericInput
                    id="custom-days-weekly"
                    min={0}
                    max={7}
                    allowDecimals={false}
                    value={daysPerWeek}
                    onValueChange={(val) => setDaysPerWeek(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
              </div>
            )}

            {usageMode === "monthly" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-hrs-monthly"
                    className="text-muted-foreground"
                  >
                    Hours per Use
                  </Label>
                  <NumericInput
                    id="custom-hrs-monthly"
                    min={0}
                    max={24}
                    allowDecimals
                    value={hoursPerUse}
                    onValueChange={(val) => setHoursPerUse(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="custom-uses-monthly"
                    className="text-muted-foreground"
                  >
                    Uses per Month
                  </Label>
                  <NumericInput
                    id="custom-uses-monthly"
                    min={0}
                    max={100}
                    allowDecimals={false}
                    value={usesPerMonth}
                    onValueChange={(val) => setUsesPerMonth(val.toString())}
                    className="h-10 rounded-xl bg-muted/40 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Operating Duty Cycle & Standby Power */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
              <div className="space-y-1.5">
                <Label htmlFor="custom-duty">Duty Cycle (%)</Label>
                <NumericInput
                  id="custom-duty"
                  min={0}
                  max={100}
                  allowDecimals
                  value={dutyCyclePct}
                  onValueChange={(val) => setDutyCyclePct(val.toString())}
                  className="h-10 rounded-xl bg-muted/40 font-mono"
                />
                <p className="text-[10px] text-muted-foreground">
                  100% for continuous load
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custom-standby">Standby Power (W)</Label>
                <NumericInput
                  id="custom-standby"
                  min={0}
                  allowDecimals
                  value={standbyW}
                  onValueChange={(val) => setStandbyW(val.toString())}
                  className="h-10 rounded-xl bg-muted/40 font-mono"
                />
                <p className="text-[10px] text-muted-foreground">
                  When idle / plugged in
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-2 border-t border-border/40 shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="rounded-xl h-9 font-medium cursor-pointer"
            >
              Add to Calculator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
