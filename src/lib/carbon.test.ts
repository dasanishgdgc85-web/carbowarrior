import { describe, expect, it } from "vitest";
import { estimateCO2, formatCO2, scoreImpact } from "./carbon";

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
  });

  it("ranks beef significantly higher than plant-based", () => {
    const beef = estimateCO2("Meal", "Beef", 1);
    const plant = estimateCO2("Meal", "Plant-based", 1);
    expect(beef).toBeGreaterThan(plant * 10);
  });
});

describe("scoreImpact", () => {
  it("buckets co2 totals", () => {
    expect(scoreImpact(0.5)).toBe("Low");
    expect(scoreImpact(5)).toBe("Medium");
    expect(scoreImpact(25)).toBe("High");
  });
});

describe("formatCO2", () => {
  it("uses grams under 1 kg", () => {
    expect(formatCO2(0.42)).toBe("420 g CO₂");
  });
  it("uses kg above 1", () => {
    expect(formatCO2(2.5)).toBe("2.50 kg CO₂");
  });
});
