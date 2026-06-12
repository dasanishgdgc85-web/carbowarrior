import { describe, expect, it } from "vitest";
import {
  ANNUAL_TARGET_KG,
  GLOBAL_AVG_KG,
  carMilesEquivalent,
  estimateCO2,
  formatCO2,
  projectAnnual,
  scoreImpact,
  sustainabilityScore,
  topReduction,
  totalCO2,
  treesEquivalent,
  vsGlobalAverage,
  type CarbonLog,
} from "./carbon";

describe("estimateCO2", () => {
  it("computes car emissions per mile", () => {
    expect(estimateCO2("Transport", "Car", 10)).toBeCloseTo(2.1);
  });

  it("returns 0 for zero-emission transport", () => {
    expect(estimateCO2("Transport", "Bike", 50)).toBe(0);
    expect(estimateCO2("Transport", "Walk", 5)).toBe(0);
  });

  it("returns 0 for unknown option or invalid amount", () => {
    expect(estimateCO2("Meal", "Unknown", 1)).toBe(0);
    expect(estimateCO2("Energy", "Electricity", -5)).toBe(0);
    expect(estimateCO2("Energy", "Electricity", NaN)).toBe(0);
    expect(estimateCO2("Transport", "Car", Infinity)).toBe(0);
  });

  it("handles zero amount", () => {
    expect(estimateCO2("Transport", "Car", 0)).toBe(0);
  });

  it("ranks beef significantly higher than plant-based", () => {
    const beef = estimateCO2("Meal", "Beef", 1);
    const plant = estimateCO2("Meal", "Plant-based", 1);
    expect(beef).toBeGreaterThan(plant * 10);
  });

  it("computes purchase emissions per dollar", () => {
    expect(estimateCO2("Purchase", "Electronics", 100)).toBeCloseTo(12);
    expect(estimateCO2("Purchase", "Clothing", 50)).toBeCloseTo(2.5);
  });

  it("rounds to 2 decimals", () => {
    const v = estimateCO2("Transport", "Bus", 3);
    expect(v.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
  });
});

describe("scoreImpact", () => {
  it("buckets co2 totals", () => {
    expect(scoreImpact(0)).toBe("Low");
    expect(scoreImpact(0.5)).toBe("Low");
    expect(scoreImpact(1.99)).toBe("Low");
    expect(scoreImpact(2)).toBe("Medium");
    expect(scoreImpact(5)).toBe("Medium");
    expect(scoreImpact(9.99)).toBe("Medium");
    expect(scoreImpact(10)).toBe("High");
    expect(scoreImpact(25)).toBe("High");
  });

  it("treats invalid input as Low", () => {
    expect(scoreImpact(NaN)).toBe("Low");
    expect(scoreImpact(-5)).toBe("Low");
  });
});

describe("formatCO2", () => {
  it("uses grams under 1 kg", () => {
    expect(formatCO2(0.42)).toBe("420 g CO₂");
    expect(formatCO2(0.001)).toBe("1 g CO₂");
  });
  it("uses kg above 1", () => {
    expect(formatCO2(2.5)).toBe("2.50 kg CO₂");
    expect(formatCO2(100)).toBe("100.00 kg CO₂");
  });
  it("handles invalid input", () => {
    expect(formatCO2(NaN)).toBe("0 g CO₂");
    expect(formatCO2(-1)).toBe("0 g CO₂");
  });
});

describe("totalCO2", () => {
  it("sums multiple logs", () => {
    const logs: CarbonLog[] = [
      { kind: "Transport", option: "Car", amount: 10 }, // 2.1
      { kind: "Meal", option: "Beef", amount: 1 }, // 6.6
      { kind: "Energy", option: "Electricity", amount: 5 }, // 2.1
    ];
    expect(totalCO2(logs)).toBeCloseTo(10.8, 1);
  });

  it("returns 0 for empty list", () => {
    expect(totalCO2([])).toBe(0);
  });

  it("ignores invalid logs without throwing", () => {
    expect(
      totalCO2([{ kind: "Meal", option: "Unknown", amount: 1 }]),
    ).toBe(0);
  });
});

describe("projectAnnual", () => {
  it("multiplies daily by 365", () => {
    expect(projectAnnual(10)).toBe(3650);
    expect(projectAnnual(0)).toBe(0);
  });
  it("returns 0 for invalid input", () => {
    expect(projectAnnual(NaN)).toBe(0);
    expect(projectAnnual(-1)).toBe(0);
  });
});

describe("sustainabilityScore", () => {
  it("returns 100 at or under target", () => {
    expect(sustainabilityScore(0)).toBe(100);
    expect(sustainabilityScore(ANNUAL_TARGET_KG)).toBe(100);
  });
  it("returns 0 at 3x target or worse", () => {
    expect(sustainabilityScore(ANNUAL_TARGET_KG * 3)).toBe(0);
    expect(sustainabilityScore(ANNUAL_TARGET_KG * 10)).toBe(0);
  });
  it("scales linearly between target and 3x target", () => {
    expect(sustainabilityScore(ANNUAL_TARGET_KG * 2)).toBe(50);
  });
});

describe("vsGlobalAverage", () => {
  it("returns 0 for the average value", () => {
    expect(vsGlobalAverage(GLOBAL_AVG_KG)).toBe(0);
  });
  it("returns negative when below average", () => {
    expect(vsGlobalAverage(GLOBAL_AVG_KG / 2)).toBe(-50);
  });
  it("returns positive when above average", () => {
    expect(vsGlobalAverage(GLOBAL_AVG_KG * 2)).toBe(100);
  });
});

describe("equivalencies", () => {
  it("converts kg to trees (21 kg/yr each)", () => {
    expect(treesEquivalent(210)).toBe(10);
    expect(treesEquivalent(0)).toBe(0);
    expect(treesEquivalent(-5)).toBe(0);
  });
  it("converts kg to car miles (0.4 kg/mi)", () => {
    expect(carMilesEquivalent(40)).toBe(100);
    expect(carMilesEquivalent(0)).toBe(0);
  });
});

describe("topReduction", () => {
  it("returns the highest-impact log", () => {
    const result = topReduction([
      { kind: "Transport", option: "Car", amount: 5 }, // 1.05
      { kind: "Meal", option: "Beef", amount: 2 }, // 13.2
      { kind: "Energy", option: "Gas", amount: 10 }, // 1.8
    ]);
    expect(result?.kind).toBe("Meal");
    expect(result?.option).toBe("Beef");
  });
  it("returns null for empty or all-zero logs", () => {
    expect(topReduction([])).toBeNull();
    expect(
      topReduction([{ kind: "Transport", option: "Bike", amount: 10 }]),
    ).toBeNull();
  });
});
