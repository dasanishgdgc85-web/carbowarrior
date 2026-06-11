// Pure carbon footprint calculation utilities.
// Emission factors are approximate, sourced from public datasets (EPA, DEFRA).
// kg CO2-equivalent per unit of activity.

export type LogKind = "Transport" | "Meal" | "Energy" | "Purchase";

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

export function scoreImpact(co2: number): "Low" | "Medium" | "High" {
  if (co2 < 2) return "Low";
  if (co2 < 10) return "Medium";
  return "High";
}

export function formatCO2(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g CO₂`;
  return `${kg.toFixed(2)} kg CO₂`;
}
