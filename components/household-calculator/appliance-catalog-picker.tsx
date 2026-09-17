"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  APPLIANCE_CATALOG,
  CATEGORY_DEFINITIONS,
} from "@/lib/appliance-catalog";
import {
  CatalogAppliance,
  ApplianceCategory,
  UserAppliance,
} from "@/lib/appliance-types";
import { ApplianceIcon } from "./appliance-icon";
import { generateApplianceId } from "@/lib/utils";
import { Plus, Search, Check } from "lucide-react";

interface ApplianceCatalogPickerProps {
  onAddAppliance: (item: UserAppliance) => void;
}

export function ApplianceCatalogPicker({
  onAddAppliance,
}: ApplianceCatalogPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ApplianceCategory | "all"
  >("all");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredCatalog = useMemo(() => {
    return APPLIANCE_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelect = (catalogItem: CatalogAppliance) => {
    const newInstance: UserAppliance = {
      instanceId: generateApplianceId(catalogItem.id),
      catalogId: catalogItem.id,
      name: catalogItem.name,
      category: catalogItem.category,
      quantity: 1,
      powerW: catalogItem.defaultPowerW,
      usageMode: catalogItem.defaultUsageMode,
      hoursPerDay: catalogItem.defaultHoursPerDay ?? 6,
      daysPerMonth: catalogItem.defaultDaysPerMonth ?? 30,
      daysPerWeek: catalogItem.defaultDaysPerWeek ?? 7,
      hoursPerUse: catalogItem.defaultHoursPerUse ?? 1,
      usesPerMonth: catalogItem.defaultUsesPerMonth ?? 10,
      dutyCycle: catalogItem.defaultDutyCycle ?? 1.0,
      standbyW: catalogItem.defaultStandbyW ?? 0,
      enabled: true,
    };

    onAddAppliance(newInstance);
    setJustAddedId(catalogItem.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="rounded-xl h-9 gap-2 font-medium shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4" />
            <span>Add Appliance</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl gap-0">
        <DialogHeader className="p-2 border-b border-border/40 shrink-0">
          <DialogTitle>Appliance Catalog</DialogTitle>
          <DialogDescription>
            Choose standard household appliances with pre-configured power specs
            and usage defaults.
          </DialogDescription>

          {/* Search & Category Filter Bar */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appliances (e.g., Fan, AC, Microwave, Laptop)..."
                className="pl-9 h-10 rounded-xl bg-muted/40 border-border/60 text-xs sm:text-sm"
              />
            </div>

            {/* Horizontal Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-transform duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                    : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted"
                }`}
              >
                All ({APPLIANCE_CATALOG.length})
              </button>
              {CATEGORY_DEFINITIONS.map((cat) => {
                const count = APPLIANCE_CATALOG.filter(
                  (i) => i.category === cat.id,
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-xl border transition-transform duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                        : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Catalog Items Scrollable Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2 scrollbar-thin">
          {filteredCatalog.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No matching appliances found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCatalog.map((item) => {
                const isAdded = justAddedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 hover:border-primary/40 transition-[border-color,background-color] duration-150 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <ApplianceIcon
                          name={item.iconName}
                          className="size-4"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-medium text-xs sm:text-sm text-foreground truncate">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground/80">
                            {item.defaultPowerW}W
                          </span>
                          <span>·</span>
                          <span className="truncate capitalize">
                            {item.defaultUsageMode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isAdded ? "default" : "outline"}
                      onClick={() => handleSelect(item)}
                      className={`h-8 px-3 rounded-xl text-xs font-medium cursor-pointer shrink-0 active:scale-[0.97] transition-transform duration-150 ${
                        isAdded
                          ? "bg-primary text-primary-foreground hover:bg-primary shadow-xs font-semibold"
                          : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="size-3.5 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="size-3.5 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <span>All values can be customized once added.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 text-xs rounded-xl cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
