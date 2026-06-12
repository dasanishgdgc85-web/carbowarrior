# Verdant — Personal Carbon Footprint Companion

Verdant is a mobile-first web app that helps individuals **measure, understand, and reduce** their daily carbon footprint.

## Problem Statement

Most people want to lower their climate impact but lack a simple way to:

1. **Measure** the CO₂ cost of everyday choices (driving, meals, electricity, purchases).
2. **Understand** which activities matter most relative to a science-based target.
3. **Act** on personalized, ranked recommendations and stay motivated over time.

Verdant addresses all three with a calm, low-friction UX.

## How the App Solves It

| Need | Feature | Source |
| --- | --- | --- |
| Measure | Quick-log sheet for Transport / Meal / Energy / Purchase with live CO₂ estimate | `src/routes/app.tsx`, `src/lib/carbon.ts` |
| Understand | Sustainability score (0–100) benchmarked against the 1.5 °C personal target (2 t/yr) and global average (4.7 t/yr) | `sustainabilityScore`, `vsGlobalAverage` |
| Act | Personalized tip cards, community challenges, leaderboard, weekly impact email | `HomeTab`, `ChallengesTab`, `ProfileTab` |
| Stay motivated | Tree- and car-mile equivalencies, streaks, opt-in habit tracking | `treesEquivalent`, `carMilesEquivalent` |

## Domain Core

All carbon math lives in `src/lib/carbon.ts` as pure functions with no UI dependencies, so it is fully unit-tested (`src/lib/carbon.test.ts`):

- `estimateCO2(kind, option, amount)` — emission factors from EPA / DEFRA
- `totalCO2(logs)` — sum of a day or period
- `projectAnnual(daily)` — annual projection
- `sustainabilityScore(annualKg)` — 0–100 vs the 2 t/yr target
- `vsGlobalAverage(annualKg)` — % vs 4.7 t/yr per-capita average
- `treesEquivalent` / `carMilesEquivalent` — intuitive units
- `topReduction(logs)` — highest-impact action to cut next

## Running

```bash
bun install
bun run dev          # local preview
bun run vitest run   # unit tests
```

## Tech

TanStack Start, React 19, Tailwind v4, shadcn/ui, Vitest.
