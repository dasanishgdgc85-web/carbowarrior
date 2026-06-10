import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  Leaf,
  Home as HomeIcon,
  Trophy,
  User,
  Plus,
  ShoppingBag,
  Zap,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Verdant — Your Carbon Footprint, Quietly Tracked" },
      {
        name: "description",
        content:
          "A calm, mobile-first companion that helps you understand and reduce your personal carbon footprint with daily insights and community challenges.",
      },
      { property: "og:title", content: "Verdant — Carbon Footprint Companion" },
      {
        property: "og:description",
        content:
          "Track your carbon footprint, get personalized reduction tips, and join community challenges.",
      },
    ],
  }),
  component: Home,
});

const categories = [
  { label: "Transport", value: "Med", detail: "142 kg" },
  { label: "Food", value: "Low", detail: "86 kg" },
  { label: "Home", value: "Optimal", detail: "54 kg" },
] as const;

const tips = [
  {
    title: "Skip the single-use cup",
    saving: "-4.2 kg CO₂ / mo",
    hint: "Your morning latte habit",
    accent: "from-emerald-200 to-emerald-300",
  },
  {
    title: "Prioritize local produce",
    saving: "-8.5 kg CO₂ / mo",
    hint: "In-season, within 100 mi",
    accent: "from-lime-200 to-emerald-300",
  },
  {
    title: "One meat-free day a week",
    saving: "-11.3 kg CO₂ / mo",
    hint: "Try Meatless Monday",
    accent: "from-amber-100 to-lime-300",
  },
];

function Home() {
  const [tab, setTab] = useState<"home" | "challenges" | "profile">("home");

  return (
    <div className="min-h-screen w-full bg-mint">
      <div className="relative mx-auto min-h-screen max-w-[440px] bg-paper pb-32">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-10 pb-6">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
              Tuesday, June 10
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Morning, Sarah
            </h2>
          </div>
          <div className="grid size-10 place-items-center overflow-hidden rounded-full bg-mint ring-1 ring-black/5">
            <span className="text-sm font-semibold text-moss">S</span>
          </div>
        </header>

        <main className="space-y-6 px-4">
          {/* Score card */}
          <section className="space-y-8 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium text-sage">
                  Sustainability Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight text-ink">
                    78
                  </span>
                  <span className="font-medium text-sage/70">/100</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex h-12 items-end gap-1">
                  {[6, 8, 10, 7, 12].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full ${i === 4 ? "bg-moss" : "bg-mint"}`}
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-moss">
                  <TrendingUp className="size-3" />
                  +12% this month
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-black/5 pt-6">
              {categories.map((c) => (
                <div key={c.label} className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-sage">
                    {c.label}
                  </p>
                  <p className="text-sm font-semibold text-ink">{c.value}</p>
                  <p className="text-[11px] text-sage/80">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick log */}
          <section className="space-y-3">
            <h3 className="px-1 text-sm font-semibold text-ink">Quick log</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickButton icon={<Car className="size-4" />} label="Transport" />
              <QuickButton icon={<Leaf className="size-4" />} label="Meal" />
              <QuickButton icon={<Zap className="size-4" />} label="Energy" />
              <QuickButton
                icon={<ShoppingBag className="size-4" />}
                label="Purchase"
              />
            </div>
          </section>

          {/* Challenge */}
          <section className="space-y-4 rounded-3xl bg-moss p-6 text-primary-foreground shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
                  Active Challenge
                </span>
                <h4 className="text-lg font-medium">The 2-Mile Radius</h4>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">
                4 days left
              </span>
            </div>

            <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-mint" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["AM", "RK", "JT"].map((i, idx) => (
                  <div
                    key={i}
                    className="grid size-7 place-items-center rounded-full bg-white/15 text-[10px] font-semibold ring-2 ring-moss"
                    style={{ zIndex: 10 - idx }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/80">
                You & 12 others are within reach
              </span>
            </div>

            <button className="w-full rounded-xl bg-paper py-2.5 text-sm font-semibold text-moss transition-transform active:scale-[0.99]">
              View leaderboard
            </button>
          </section>

          {/* Tips */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-ink">
                Personalized tips
              </h3>
              <button className="text-xs font-medium text-sage hover:text-moss">
                See all
              </button>
            </div>
            <div className="space-y-3">
              {tips.map((t) => (
                <div
                  key={t.title}
                  className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-black/5"
                >
                  <div
                    className={`size-12 shrink-0 rounded-xl bg-gradient-to-br ${t.accent} ring-1 ring-black/5`}
                  />
                  <div className="flex-1 space-y-0.5">
                    <h5 className="text-sm font-medium leading-tight text-ink">
                      {t.title}
                    </h5>
                    <p className="text-xs text-sage">{t.hint}</p>
                    <p className="text-[11px] font-semibold text-moss">
                      {t.saving}
                    </p>
                  </div>
                  <button className="grid size-8 place-items-center rounded-full bg-paper text-moss ring-1 ring-black/5 transition-transform active:scale-95">
                    <Plus className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Equivalents */}
          <section className="grid grid-cols-2 gap-3">
            <Stat value="14" unit="trees" label="Equivalent this year" />
            <Stat value="312" unit="mi" label="Car miles avoided" />
          </section>
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[440px] -translate-x-1/2 items-center justify-around border-t border-black/5 bg-paper/85 px-8 py-4 backdrop-blur-xl">
          <NavBtn
            active={tab === "home"}
            onClick={() => setTab("home")}
            icon={<HomeIcon className="size-5" />}
            label="Home"
          />
          <NavBtn
            active={tab === "challenges"}
            onClick={() => setTab("challenges")}
            icon={<Trophy className="size-5" />}
            label="Challenges"
          />
          <NavBtn
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            icon={<User className="size-5" />}
            label="Profile"
          />
        </nav>
      </div>
    </div>
  );
}

function QuickButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2.5 rounded-2xl bg-card p-3 text-sm font-medium text-ink ring-1 ring-black/5 transition-transform active:scale-[0.98]">
      <span className="grid size-8 place-items-center rounded-lg bg-mint text-moss">
        {icon}
      </span>
      <span>{label}</span>
      <ChevronRight className="ml-auto size-4 text-sage" />
    </button>
  );
}

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-black/5">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight text-ink">
          {value}
        </span>
        <span className="text-xs font-medium text-sage">{unit}</span>
      </div>
      <p className="mt-1 text-[11px] text-sage">{label}</p>
    </div>
  );
}

function NavBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-wide transition-colors ${
        active ? "text-moss" : "text-sage/60"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
