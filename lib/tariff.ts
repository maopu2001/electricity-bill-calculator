export interface Slab {
  label: string;
  min: number;
  max: number | null;
  energyRate: number;
  demandRate: number;
  color: string;
}

export const SLABS: Slab[] = [
  { label: "Life Line", min: 0, max: 50, energyRate: 4.63, demandRate: 42.0, color: "hsl(142, 76%, 46%)" },
  { label: "0–75", min: 1, max: 75, energyRate: 5.26, demandRate: 42.0, color: "hsl(199, 89%, 48%)" },
  { label: "76–200", min: 76, max: 200, energyRate: 8.50, demandRate: 42.0, color: "hsl(262, 83%, 58%)" },
  { label: "201–300", min: 201, max: 300, energyRate: 9.10, demandRate: 42.0, color: "hsl(32, 95%, 54%)" },
  { label: "301–400", min: 301, max: 400, energyRate: 9.62, demandRate: 42.0, color: "hsl(358, 75%, 59%)" },
  { label: "401–600", min: 401, max: 600, energyRate: 15.01, demandRate: 42.0, color: "hsl(25, 95%, 53%)" },
  { label: "Above 600", min: 601, max: null, energyRate: 17.35, demandRate: 42.0, color: "hsl(0, 84%, 60%)" },
];

export interface SlabResult {
  slab: Slab;
  unitsInSlab: number;
  cost: number;
  isActive: boolean;
}

export interface BillResult {
  totalUnits: number;
  demandKW: number;
  slabBreakdown: SlabResult[];
  totalEnergyCharge: number;
  totalDemandCharge: number;
  subtotal: number;
  rebate: number;
  afterRebate: number;
  vat: number;
  grandTotal: number;
}

export function calculateBill(units: number, demandKW: number): BillResult {
  const slabBreakdown: SlabResult[] = [];

  if (units <= 50) {
    // Life Line: ALL units at ৳4.63
    slabBreakdown.push({
      slab: SLABS[0],
      unitsInSlab: units,
      cost: units * SLABS[0].energyRate,
      isActive: true,
    });
  } else if (units <= 75) {
    // Not life line: ALL units at ৳5.26
    slabBreakdown.push({
      slab: SLABS[1],
      unitsInSlab: units,
      cost: units * SLABS[1].energyRate,
      isActive: true,
    });
  } else {
    // Incremental: units > 75
    // First 75 units at ৳5.26
    slabBreakdown.push({
      slab: SLABS[1],
      unitsInSlab: 75,
      cost: 75 * SLABS[1].energyRate,
      isActive: true,
    });

    let remaining = units - 75;

    // 76–200 (up to 125 units)
    const units76_200 = Math.min(remaining, 125);
    slabBreakdown.push({
      slab: SLABS[2],
      unitsInSlab: units76_200,
      cost: units76_200 * SLABS[2].energyRate,
      isActive: units76_200 > 0,
    });
    remaining -= units76_200;

    // 201–300 (up to 100 units)
    const units201_300 = Math.min(remaining, 100);
    slabBreakdown.push({
      slab: SLABS[3],
      unitsInSlab: units201_300,
      cost: units201_300 * SLABS[3].energyRate,
      isActive: units201_300 > 0,
    });
    remaining -= units201_300;

    // 301–400 (up to 100 units)
    const units301_400 = Math.min(remaining, 100);
    slabBreakdown.push({
      slab: SLABS[4],
      unitsInSlab: units301_400,
      cost: units301_400 * SLABS[4].energyRate,
      isActive: units301_400 > 0,
    });
    remaining -= units301_400;

    // 401–600 (up to 200 units)
    const units401_600 = Math.min(remaining, 200);
    slabBreakdown.push({
      slab: SLABS[5],
      unitsInSlab: units401_600,
      cost: units401_600 * SLABS[5].energyRate,
      isActive: units401_600 > 0,
    });
    remaining -= units401_600;

    // Above 600
    slabBreakdown.push({
      slab: SLABS[6],
      unitsInSlab: remaining,
      cost: remaining * SLABS[6].energyRate,
      isActive: remaining > 0,
    });

    // Life Line is inactive when > 50 units
    slabBreakdown.unshift({
      slab: SLABS[0],
      unitsInSlab: 0,
      cost: 0,
      isActive: false,
    });
  }

  const totalEnergyCharge = slabBreakdown.reduce((sum, s) => sum + s.cost, 0);
  const totalDemandCharge = demandKW * 42.0;
  const subtotal = totalEnergyCharge + totalDemandCharge;
  const rebate = subtotal * 0.005;
  const afterRebate = subtotal - rebate;
  const vat = afterRebate * 0.05;
  const grandTotal = afterRebate + vat;

  return {
    totalUnits: units,
    demandKW,
    slabBreakdown,
    totalEnergyCharge,
    totalDemandCharge,
    subtotal,
    rebate,
    afterRebate,
    vat,
    grandTotal,
  };
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getActiveSlabIndex(units: number): number {
  if (units <= 50) return 0;
  if (units <= 75) return 1;
  if (units <= 200) return 2;
  if (units <= 300) return 3;
  if (units <= 400) return 4;
  if (units <= 600) return 5;
  return 6;
}

export interface ReverseResult {
  estimatedUnits: number;
  energyCharge: number;
  demandCharge: number;
  subtotal: number;
  rebate: number;
  afterRebate: number;
  vat: number;
  inputAmount: number;
  slabBreakdown: SlabResult[];
}

export function calculateUnitsFromAmount(amount: number, demandKW: number): ReverseResult {
  if (amount <= 0) {
    return {
      estimatedUnits: 0,
      energyCharge: 0,
      demandCharge: demandKW * 42,
      subtotal: 0,
      rebate: 0,
      afterRebate: 0,
      vat: 0,
      inputAmount: amount,
      slabBreakdown: [],
    };
  }

  // Step 1: Work backwards from grand total
  const afterRebate = amount / 1.05;
  const subtotal = afterRebate / 0.995;
  const rebate = subtotal * 0.005;
  const demandCharge = demandKW * 42.0;
  const energyCharge = Math.max(0, subtotal - demandCharge);

  // Step 2: Figure out units from energy charge
  let units = 0;
  let remaining = energyCharge;

  // Check Life Line: max energy = 50 × 4.63 = 231.50
  const lifeLineMax = 50 * SLABS[0].energyRate;
  if (energyCharge <= lifeLineMax) {
    units = energyCharge / SLABS[0].energyRate;
  }
  // Check 0-75 slab: max energy = 75 × 5.26 = 394.50
  else if (energyCharge <= 75 * SLABS[1].energyRate) {
    units = energyCharge / SLABS[1].energyRate;
  }
  // Incremental for > 75
  else {
    // First 75 units at 5.26
    const cost75 = 75 * SLABS[1].energyRate;
    remaining = energyCharge - cost75;
    units = 75;

    // Slab tiers: [slabIndex, maxUnitsInSlab]
    const tiers: [number, number][] = [
      [2, 125],  // 76-200
      [3, 100],  // 201-300
      [4, 100],  // 301-400
      [5, 200],  // 401-600
      [6, Infinity], // 600+
    ];

    for (const [slabIdx, maxUnits] of tiers) {
      if (remaining <= 0) break;
      const rate = SLABS[slabIdx].energyRate;
      const maxCost = maxUnits === Infinity ? Infinity : maxUnits * rate;

      if (remaining >= maxCost && maxUnits !== Infinity) {
        units += maxUnits;
        remaining -= maxCost;
      } else {
        units += remaining / rate;
        remaining = 0;
      }
    }
  }

  units = Math.round(units * 100) / 100; // round to 2 decimal places

  // Step 3: Generate slab breakdown for the estimated units
  const slabBreakdown = calculateBill(units, demandKW).slabBreakdown;

  return {
    estimatedUnits: units,
    energyCharge,
    demandCharge: demandCharge,
    subtotal,
    rebate,
    afterRebate,
    vat: afterRebate * 0.05,
    inputAmount: amount,
    slabBreakdown,
  };
}
