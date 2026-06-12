// Pure carbon footprint calculation utilities.
// Emission factors are approximate, sourced from public datasets (EPA, DEFRA).
// All factors are kg CO2-equivalent per unit of activity.
//
// This module is the domain core of Verdant: a personal carbon-footprint
// tracker that helps users (1) measure daily activity emissions,
// (2) understand their relative impact, and (3) project their annual
// footprint against science-based reduction targets.

export type LogKind = "Transport" | "Meal" | "Energy" | "Purchase";

export type ImpactLevel = "Low" | "Medium" | "High";

export const EMISSION_FACTORS = {
  Transport: {
    Car: 0.21, // per mile
    Bus: 0.08,
    Bike: 0,
    Walk: 0,
    Train: 0.04,
  },
  Meal: {
    "Plant-based": 0.4, // per serving
    Vegetarian: 0.9,
    Chicken: 1.8,
    Beef: 6.6,
  },
  Energy: {
    Electricity: 0.42, // per kWh (US grid avg)
    Gas: 0.18,
    Water: 0.34,
  },
  Purchase: {
    Clothing: 0.05, // per $
    Electronics: 0.12,
    Goods: 0.04,
  },
} as const;

// Global per-capita average (~4.7 t CO2/yr) used as the baseline goal.
// Science-based personal target for 1.5°C pathway: ~2.0 t/yr by 2030.
export const ANNUAL_TARGET_KG = 2000;
export const GLOBAL_AVG_KG = 4700;

export function estimateCO2(
  kind: LogKind,
  option: string,
  amount: number,
): number {
  const table = EMISSION_FACTORS[kind] as Record<string, number>;
  const factor = table[option];
  if (factor === undefined || !Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(factor * amount * 100) / 100;
}

export function scoreImpact(co2: number): ImpactLevel {
  if (!Number.isFinite(co2) || co2 < 0) return "Low";
  if (co2 < 2) return "Low";
  if (co2 < 10) return "Medium";
  return "High";
}

export function formatCO2(kg: number): string {
  if (!Number.isFinite(kg) || kg < 0) return "0 g CO₂";
  if (kg < 1) return `${Math.round(kg * 1000)} g CO₂`;
  return `${kg.toFixed(2)} kg CO₂`;
}

// Sum a list of logs into a single kg CO2 total.
export interface CarbonLog {
  kind: LogKind;
  option: string;
  amount: number;
}

export function totalCO2(logs: CarbonLog[]): number {
  const total = logs.reduce(
    (sum, l) => sum + estimateCO2(l.kind, l.option, l.amount),
    0,
  );
  return Math.round(total * 100) / 100;
}

// Project a daily-average footprint to an annual estimate (kg/yr).
export function projectAnnual(dailyKg: number): number {
  if (!Number.isFinite(dailyKg) || dailyKg < 0) return 0;
  return Math.round(dailyKg * 365);
}

// 0-100 sustainability score relative to ANNUAL_TARGET_KG.
// At or under target = 100; at 3x target or worse = 0; linear in between.
export function sustainabilityScore(annualKg: number): number {
  if (!Number.isFinite(annualKg) || annualKg <= ANNUAL_TARGET_KG) return 100;
  const max = ANNUAL_TARGET_KG * 3;
  if (annualKg >= max) return 0;
  const ratio = (annualKg - ANNUAL_TARGET_KG) / (max - ANNUAL_TARGET_KG);
  return Math.round((1 - ratio) * 100);
}

// Compare a value to the global per-capita average, returns a +/- percentage.
// Negative = below average (better), positive = above (worse).
export function vsGlobalAverage(annualKg: number): number {
  if (!Number.isFinite(annualKg) || annualKg < 0) return 0;
  return Math.round(((annualKg - GLOBAL_AVG_KG) / GLOBAL_AVG_KG) * 100);
}

// Equivalency helpers — translate kg CO2 into intuitive units.
// 1 mature tree absorbs ~21 kg CO2 / year.
export function treesEquivalent(kg: number): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return Math.round(kg / 21);
}

// Average US gas car: ~0.4 kg CO2 / mile.
export function carMilesEquivalent(kg: number): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return Math.round(kg / 0.4);
}

// Suggest the single highest-impact reduction from a set of logs.
export function topReduction(
  logs: CarbonLog[],
): { kind: LogKind; option: string; co2: number } | null {
  if (logs.length === 0) return null;
  let best: { kind: LogKind; option: string; co2: number } | null = null;
  for (const l of logs) {
    const co2 = estimateCO2(l.kind, l.option, l.amount);
    if (!best || co2 > best.co2) best = { kind: l.kind, option: l.option, co2 };
  }
  return best && best.co2 > 0 ? best : null;
}
