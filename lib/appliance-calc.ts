import {
  UserAppliance,
  ApplianceEnergyResult,
  HouseholdCalculationResult,
  CategorySummary,
  WhatIfScenario,
} from "./appliance-types";
import { CATEGORY_DEFINITIONS } from "./appliance-catalog";

/**
 * Calculates monthly active hours based on chosen usage mode.
 * Exact precision math without interim rounding.
 */
export function calculateMonthlyActiveHours(item: UserAppliance): number {
  if (item.usageMode === "daily") {
    const hours = Math.max(0, Math.min(24, item.hoursPerDay || 0));
    const days = Math.max(0, Math.min(31, item.daysPerMonth || 0));
    return hours * days;
  }

  if (item.usageMode === "weekly") {
    const hours = Math.max(0, Math.min(24, item.hoursPerDay || 0));
    const daysPerWeek = Math.max(0, Math.min(7, item.daysPerWeek || 0));
    // Average 52 weeks in a year / 12 months = 4.333333333... weeks per month
    return hours * daysPerWeek * (52 / 12);
  }

  if (item.usageMode === "monthly") {
    const hoursPerUse = Math.max(0, Math.min(24, item.hoursPerUse || 0));
    const uses = Math.max(0, item.usesPerMonth || 0);
    return hoursPerUse * uses;
  }

  return 0;
}

/**
 * Calculate energy consumption for an individual appliance instance.
 */
export function calculateApplianceEnergy(item: UserAppliance): ApplianceEnergyResult {
  if (!item.enabled) {
    return {
      instanceId: item.instanceId,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      powerW: item.powerW,
      dutyCycle: item.dutyCycle,
      effectiveActiveHoursPerMonth: 0,
      activeKWh: 0,
      standbyKWh: 0,
      totalKWh: 0,
      percentageOfTotal: 0,
      peakPowerW: 0,
    };
  }

  const quantity = Math.max(1, Math.floor(item.quantity || 1));
  const powerW = Math.max(0, item.powerW || 0);
  const dutyCycle = Math.max(0.05, Math.min(1.0, item.dutyCycle || 1.0));
  const activeHoursPerMonth = calculateMonthlyActiveHours(item);

  // Active Energy = (Watts * Qty * Monthly Hours * DutyCycle) / 1000
  const activeKWh = (powerW * quantity * activeHoursPerMonth * dutyCycle) / 1000;

  // Standby Energy calculation
  let standbyKWh = 0;
  if (item.standbyW && item.standbyW > 0) {
    const dailyActiveHours = item.usageMode === "daily" ? item.hoursPerDay : activeHoursPerMonth / 30;
    const standbyHoursPerDay = item.standbyHoursPerDay !== undefined
      ? Math.max(0, Math.min(24, item.standbyHoursPerDay))
      : Math.max(0, 24 - dailyActiveHours);

    const standbyHoursPerMonth = standbyHoursPerDay * 30;
    standbyKWh = (item.standbyW * quantity * standbyHoursPerMonth) / 1000;
  }

  const totalKWh = activeKWh + standbyKWh;
  const peakPowerW = powerW * quantity;

  return {
    instanceId: item.instanceId,
    name: item.name,
    category: item.category,
    quantity,
    powerW,
    dutyCycle,
    effectiveActiveHoursPerMonth: activeHoursPerMonth,
    activeKWh,
    standbyKWh,
    totalKWh,
    percentageOfTotal: 0, // Calculated in aggregate
    peakPowerW,
  };
}

/**
 * Calculates complete household summary, top consumers, and category aggregates.
 */
export function calculateHouseholdEnergy(appliances: UserAppliance[]): HouseholdCalculationResult {
  const activeItems = appliances.filter((a) => a.enabled);
  const calculatedItems = activeItems.map(calculateApplianceEnergy);

  // Unrounded grand sum
  const totalMonthlyKWh = calculatedItems.reduce((sum, item) => sum + item.totalKWh, 0);
  const connectedPeakWatts = calculatedItems.reduce((sum, item) => sum + item.peakPowerW, 0);
  const connectedPeakKW = connectedPeakWatts / 1000;

  // Calculate percentages
  const enrichedItems = calculatedItems.map((item) => ({
    ...item,
    percentageOfTotal: totalMonthlyKWh > 0 ? (item.totalKWh / totalMonthlyKWh) * 100 : 0,
  }));

  // Top consumers sorted descending
  const topConsumers = [...enrichedItems]
    .filter((i) => i.totalKWh > 0)
    .sort((a, b) => b.totalKWh - a.totalKWh)
    .slice(0, 6);

  // Category Aggregates
  const categoryMap = new Map<string, { totalKWh: number; count: number }>();
  enrichedItems.forEach((item) => {
    const existing = categoryMap.get(item.category) || { totalKWh: 0, count: 0 };
    categoryMap.set(item.category, {
      totalKWh: existing.totalKWh + item.totalKWh,
      count: existing.count + 1,
    });
  });

  const categorySummaries: CategorySummary[] = CATEGORY_DEFINITIONS.map((cat) => {
    const stats = categoryMap.get(cat.id) || { totalKWh: 0, count: 0 };
    return {
      category: cat.id,
      label: cat.label,
      iconName: cat.icon,
      totalKWh: stats.totalKWh,
      percentage: totalMonthlyKWh > 0 ? (stats.totalKWh / totalMonthlyKWh) * 100 : 0,
      itemCount: stats.count,
    };
  }).filter((cat) => cat.totalKWh > 0 || cat.itemCount > 0);

  // Sort categories by highest consumption first
  categorySummaries.sort((a, b) => b.totalKWh - a.totalKWh);

  // Suggested Sanction Demand Load:
  // Diversity factor ~65% of connected peak, rounded up to next integer, min 1 kW
  const suggestedDemandKW = Math.max(1, Math.ceil(connectedPeakKW * 0.65));

  return {
    totalMonthlyKWh,
    dailyAverageKWh: totalMonthlyKWh / 30,
    annualKWh: totalMonthlyKWh * 12,
    connectedPeakKW,
    suggestedDemandKW,
    items: enrichedItems,
    categorySummaries,
    topConsumers,
  };
}

/**
 * Simulates a "What-If" alteration on an appliance list.
 */
export function simulateWhatIf(
  currentAppliances: UserAppliance[],
  scenarioTitle: string,
  scenarioDesc: string,
  modifier: (list: UserAppliance[]) => UserAppliance[]
): WhatIfScenario {
  const originalResult = calculateHouseholdEnergy(currentAppliances);
  const modifiedList = modifier(JSON.parse(JSON.stringify(currentAppliances)));
  const modifiedResult = calculateHouseholdEnergy(modifiedList);

  const differenceKWh = modifiedResult.totalMonthlyKWh - originalResult.totalMonthlyKWh;
  const percentageChange = originalResult.totalMonthlyKWh > 0
    ? (differenceKWh / originalResult.totalMonthlyKWh) * 100
    : 0;

  return {
    id: scenarioTitle.toLowerCase().replace(/\s+/g, "-"),
    title: scenarioTitle,
    description: scenarioDesc,
    originalKWh: originalResult.totalMonthlyKWh,
    modifiedKWh: modifiedResult.totalMonthlyKWh,
    differenceKWh,
    percentageChange,
  };
}
