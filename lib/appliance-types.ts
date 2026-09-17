export type ApplianceCategory =
  | "lighting"
  | "fans_cooling"
  | "air_conditioning"
  | "entertainment"
  | "computing"
  | "mobile_charging"
  | "kitchen"
  | "laundry"
  | "water_pumps"
  | "heating"
  | "personal_care"
  | "cleaning"
  | "networking"
  | "other";

export type UsageMode = "daily" | "weekly" | "monthly";

export interface PowerPreset {
  label: string;
  watts: number;
}

export interface CatalogAppliance {
  id: string;
  name: string;
  category: ApplianceCategory;
  defaultPowerW: number;
  presets: PowerPreset[];
  defaultUsageMode: UsageMode;
  defaultHoursPerDay?: number;
  defaultDaysPerMonth?: number;
  defaultHoursPerWeek?: number;
  defaultDaysPerWeek?: number;
  defaultHoursPerUse?: number;
  defaultUsesPerMonth?: number;
  supportsDutyCycle?: boolean;
  defaultDutyCycle?: number; // 0.05 to 1.0 (e.g. 0.60 for AC, 0.50 for Fridge)
  supportsStandby?: boolean;
  defaultStandbyW?: number;
  disclaimer?: string;
  iconName?: string;
}

export interface UserAppliance {
  instanceId: string;
  catalogId?: string;
  name: string;
  category: ApplianceCategory;
  quantity: number;
  powerW: number;

  // Usage Configuration
  usageMode: UsageMode;
  hoursPerDay: number; // 0 to 24
  daysPerMonth: number; // 1 to 31
  daysPerWeek: number; // 0 to 7
  hoursPerUse: number; // 0 to 24
  usesPerMonth: number; // >= 0

  // Duty Cycle & Standby
  dutyCycle: number; // 0.05 to 1.0 (5% to 100%)
  standbyW: number; // >= 0
  standbyHoursPerDay?: number; // optional override; defaults to max(0, 24 - activeHours)

  enabled: boolean;
}

export interface ApplianceEnergyResult {
  instanceId: string;
  name: string;
  category: ApplianceCategory;
  quantity: number;
  powerW: number;
  dutyCycle: number;
  effectiveActiveHoursPerMonth: number;
  activeKWh: number;
  standbyKWh: number;
  totalKWh: number;
  percentageOfTotal: number;
  peakPowerW: number;
}

export interface CategorySummary {
  category: ApplianceCategory;
  label: string;
  iconName: string;
  totalKWh: number;
  percentage: number;
  itemCount: number;
}

export interface HouseholdCalculationResult {
  totalMonthlyKWh: number;
  dailyAverageKWh: number;
  annualKWh: number;
  connectedPeakKW: number;
  suggestedDemandKW: number;
  items: ApplianceEnergyResult[];
  categorySummaries: CategorySummary[];
  topConsumers: ApplianceEnergyResult[];
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  originalKWh: number;
  modifiedKWh: number;
  differenceKWh: number;
  percentageChange: number;
}
