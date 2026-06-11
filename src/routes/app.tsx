import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { estimateCO2, formatCO2, type LogKind } from "@/lib/carbon";
import { toast } from "sonner";
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
  Check,
  Medal,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Verdant" },
      {
        name: "description",
        content:
          "Track your sustainability score, log activity, and join community challenges.",
      },
    ],
  }),
  component: AppHome,
});



const initialTips = [
  {
    id: "cup",
    title: "Skip the single-use cup",
    saving: "-4.2 kg CO₂ / mo",
    hint: "Your morning latte habit",
    accent: "from-emerald-200 to-emerald-300",
  },
  {
    id: "local",
    title: "Prioritize local produce",
    saving: "-8.5 kg CO₂ / mo",
    hint: "In-season, within 100 mi",
    accent: "from-lime-200 to-emerald-300",
  },
  {
    id: "meat",
    title: "One meat-free day a week",
    saving: "-11.3 kg CO₂ / mo",
    hint: "Try Meatless Monday",
    accent: "from-amber-100 to-lime-300",
  },
];

const leaderboard = [
  { rank: 1, name: "Amelia M.", score: 94, you: false },
  { rank: 2, name: "Ravi K.", score: 89, you: false },
  { rank: 3, name: "Sarah (you)", score: 78, you: true },
  { rank: 4, name: "Jamal T.", score: 74, you: false },
  { rank: 5, name: "Priya S.", score: 71, you: false },
];

function AppHome() {
  const [tab, setTab] = useState<"home" | "challenges" | "profile">("home");
  const [logOpen, setLogOpen] = useState(false);
  const [logKind, setLogKind] = useState<LogKind>("Transport");
  const [boardOpen, setBoardOpen] = useState(false);
  const [acceptedTips, setAcceptedTips] = useState<string[]>([]);
  const [score, setScore] = useState(78);
  const [logCount, setLogCount] = useState(0);
  const [notifs, setNotifs] = useState(true);
  const [weekly, setWeekly] = useState(true);

  const openLog = (kind: LogKind) => {
    setLogKind(kind);
    setLogOpen(true);
  };

  const handleLog = (amount: string) => {
    setLogOpen(false);
    setLogCount((n) => n + 1);
    setScore((s) => Math.min(100, s + 1));
    toast.success(`${logKind} logged`, {
      description: amount
        ? `${amount} — score +1`
        : "Activity recorded — score +1",
    });
  };

  const acceptTip = (id: string, title: string) => {
    if (acceptedTips.includes(id)) {
      toast.info("Already on your list");
      return;
    }
    setAcceptedTips((a) => [...a, id]);
    setScore((s) => Math.min(100, s + 2));
    toast.success("Added to your habits", { description: title });
  };

  return (
    <div className="min-h-screen w-full bg-mint">
      <div className="relative mx-auto min-h-screen max-w-[440px] bg-paper pb-32">
        {tab === "home" && (
          <HomeTab
            score={score}
            logCount={logCount}
            tips={initialTips}
            acceptedTips={acceptedTips}
            onOpenLog={openLog}
            onOpenBoard={() => setBoardOpen(true)}
            onAcceptTip={acceptTip}
          />
        )}
        {tab === "challenges" && (
          <ChallengesTab onOpenBoard={() => setBoardOpen(true)} />
        )}
        {tab === "profile" && (
          <ProfileTab
            score={score}
            notifs={notifs}
            weekly={weekly}
            setNotifs={setNotifs}
            setWeekly={setWeekly}
          />
        )}

        <nav
          aria-label="Primary"
          className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[440px] -translate-x-1/2 items-center justify-around border-t border-black/5 bg-paper/85 px-8 py-4 backdrop-blur-xl"
        >
          <NavBtn
            active={tab === "home"}
            onClick={() => setTab("home")}
            icon={<HomeIcon className="size-5" aria-hidden="true" />}
            label="Home"
          />
          <NavBtn
            active={tab === "challenges"}
            onClick={() => setTab("challenges")}
            icon={<Trophy className="size-5" aria-hidden="true" />}
            label="Challenges"
          />
          <NavBtn
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            icon={<User className="size-5" aria-hidden="true" />}
            label="Profile"
          />
        </nav>
      </div>

      {/* Log activity sheet */}
      <Sheet open={logOpen} onOpenChange={setLogOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Log {logKind.toLowerCase()}</SheetTitle>
            <SheetDescription>
              Quickly add an activity. We'll estimate the CO₂ impact for you.
            </SheetDescription>
          </SheetHeader>
          <LogForm kind={logKind} onSubmit={handleLog} onCancel={() => setLogOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Leaderboard dialog */}
      <Dialog open={boardOpen} onOpenChange={setBoardOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>The 2-Mile Radius</DialogTitle>
            <DialogDescription>Leaderboard — 4 days left</DialogDescription>
          </DialogHeader>
          <ul className="divide-y divide-black/5">
            {leaderboard.map((r) => (
              <li
                key={r.rank}
                className={`flex items-center gap-3 py-3 ${
                  r.you ? "rounded-lg bg-mint/60 px-2" : ""
                }`}
              >
                <span className="w-6 text-sm font-semibold text-sage">
                  {r.rank}
                </span>
                <span className="flex-1 text-sm font-medium text-ink">
                  {r.name}
                </span>
                {r.rank <= 3 && <Medal className="size-4 text-moss" />}
                <span className="text-sm font-semibold text-moss">
                  {r.score}
                </span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-moss text-paper hover:bg-moss/90"
            onClick={() => {
              setBoardOpen(false);
              toast.success("You're in! Good luck this week.");
            }}
          >
            Stay in challenge
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HomeTab({
  score,
  logCount,
  tips,
  acceptedTips,
  onOpenLog,
  onOpenBoard,
  onAcceptTip,
}: {
  score: number;
  logCount: number;
  tips: typeof initialTips;
  acceptedTips: string[];
  onOpenLog: (k: LogKind) => void;
  onOpenBoard: () => void;
  onAcceptTip: (id: string, title: string) => void;
}) {
  const progress = useMemo(() => Math.min(100, 68 + logCount * 4), [logCount]);

  return (
    <>
      <header className="flex items-center justify-between px-5 pt-10 pb-6">
        <div className="space-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
            Tuesday, June 10
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Morning, Sarah
          </h1>
        </div>
        <Link
          to="/"
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-mint ring-1 ring-black/5 transition-transform active:scale-95"
          aria-label="Back to landing"
        >
          <span className="text-sm font-semibold text-moss">S</span>
        </Link>
      </header>

      <main className="space-y-6 px-4">
        <section className="space-y-8 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-sage">
                Sustainability Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-ink tabular-nums">
                  {score}
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
            {[
              { label: "Transport", value: "Med", detail: "142 kg" },
              { label: "Food", value: "Low", detail: "86 kg" },
              { label: "Home", value: "Optimal", detail: "54 kg" },
            ].map((c) => (
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

        <section className="space-y-3">
          <h3 className="px-1 text-sm font-semibold text-ink">Quick log</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickButton
              icon={<Car className="size-4" />}
              label="Transport"
              onClick={() => onOpenLog("Transport")}
            />
            <QuickButton
              icon={<Leaf className="size-4" />}
              label="Meal"
              onClick={() => onOpenLog("Meal")}
            />
            <QuickButton
              icon={<Zap className="size-4" />}
              label="Energy"
              onClick={() => onOpenLog("Energy")}
            />
            <QuickButton
              icon={<ShoppingBag className="size-4" />}
              label="Purchase"
              onClick={() => onOpenLog("Purchase")}
            />
          </div>
        </section>

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
            <div
              className="h-full rounded-full bg-mint transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
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

          <Button
            onClick={onOpenBoard}
            className="w-full rounded-xl bg-paper py-2.5 text-sm font-semibold text-moss hover:bg-paper/90"
          >
            View leaderboard
          </Button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-ink">
              Personalized tips
            </h3>
            <button
              type="button"
              onClick={() => toast.info("Full library coming soon")}
              className="text-xs font-medium text-sage hover:text-moss"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {tips.map((t) => {
              const added = acceptedTips.includes(t.id);
              return (
                <div
                  key={t.id}
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
                  <button
                    type="button"
                    onClick={() => onAcceptTip(t.id, t.title)}
                    aria-label={added ? "Added" : "Add tip"}
                    className={`grid size-8 place-items-center rounded-full ring-1 ring-black/5 transition-transform active:scale-95 ${
                      added ? "bg-moss text-paper" : "bg-paper text-moss"
                    }`}
                  >
                    {added ? (
                      <Check className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 pb-4">
          <Stat value="14" unit="trees" label="Equivalent this year" />
          <Stat value="312" unit="mi" label="Car miles avoided" />
        </section>
      </main>
    </>
  );
}

function ChallengesTab({ onOpenBoard }: { onOpenBoard: () => void }) {
  const challenges = [
    {
      title: "The 2-Mile Radius",
      desc: "Walk, bike, or transit anywhere under 2 miles.",
      participants: 218,
      joined: true,
    },
    {
      title: "Meat-Free Week",
      desc: "Skip animal protein for 7 days straight.",
      participants: 1432,
      joined: false,
    },
    {
      title: "Cold-Wash Month",
      desc: "Wash every load in cold water for 30 days.",
      participants: 612,
      joined: false,
    },
  ];
  const [joined, setJoined] = useState<string[]>(["The 2-Mile Radius"]);

  return (
    <>
      <header className="px-5 pt-10 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Community
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Challenges
        </h1>
      </header>
      <main className="space-y-4 px-4">
        {challenges.map((c) => {
          const isJoined = joined.includes(c.title);
          return (
            <div
              key={c.title}
              className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-black/5"
            >
              <div>
                <h4 className="text-base font-semibold text-ink">{c.title}</h4>
                <p className="mt-1 text-sm text-sage">{c.desc}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-sage">
                  {c.participants.toLocaleString()} participants
                </span>
                <Button
                  size="sm"
                  variant={isJoined ? "outline" : "default"}
                  className={
                    isJoined ? "" : "bg-moss text-paper hover:bg-moss/90"
                  }
                  onClick={() => {
                    if (isJoined) {
                      setJoined((j) => j.filter((t) => t !== c.title));
                      toast("Left challenge", { description: c.title });
                    } else {
                      setJoined((j) => [...j, c.title]);
                      toast.success("Joined!", { description: c.title });
                    }
                  }}
                >
                  {isJoined ? "Joined" : "Join"}
                </Button>
              </div>
              {isJoined && (
                <button
                  onClick={onOpenBoard}
                  className="flex w-full items-center justify-between rounded-xl bg-mint px-3 py-2 text-xs font-medium text-moss"
                >
                  View leaderboard
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </main>
    </>
  );
}

function ProfileTab({
  score,
  notifs,
  weekly,
  setNotifs,
  setWeekly,
}: {
  score: number;
  notifs: boolean;
  weekly: boolean;
  setNotifs: (v: boolean) => void;
  setWeekly: (v: boolean) => void;
}) {
  return (
    <>
      <header className="px-5 pt-10 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Account
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Profile
        </h1>
      </header>
      <main className="space-y-6 px-4">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-5 ring-1 ring-black/5">
          <div className="grid size-14 place-items-center rounded-full bg-mint text-lg font-semibold text-moss">
            S
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-ink">Sarah Chen</p>
            <p className="text-sm text-sage">Score {score} · Member since May</p>
          </div>
        </div>

        <div className="space-y-1 rounded-2xl bg-card ring-1 ring-black/5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-sage" />
              <span className="text-sm font-medium text-ink">
                Push notifications
              </span>
            </div>
            <Switch checked={notifs} onCheckedChange={setNotifs} />
          </div>
          <div className="border-t border-black/5" />
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Settings className="size-4 text-sage" />
              <span className="text-sm font-medium text-ink">
                Weekly impact email
              </span>
            </div>
            <Switch checked={weekly} onCheckedChange={setWeekly} />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={() => toast("Annual report sent to your inbox")}
        >
          <ChevronRight className="size-4" />
          Export annual report
        </Button>

        <Link
          to="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-3 text-sm font-medium text-moss transition-transform active:scale-[0.98]"
        >
          <LogOut className="size-4" />
          Back to landing
        </Link>
      </main>
    </>
  );
}

function LogForm({
  kind,
  onSubmit,
  onCancel,
}: {
  kind: LogKind;
  onSubmit: (amount: string) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState("");
  const defaults: Record<LogKind, string> = {
    Transport: "Car",
    Meal: "Plant-based",
    Energy: "Electricity",
    Purchase: "Clothing",
  };
  const [option, setOption] = useState<string>(defaults[kind]);

  const options: Record<LogKind, string[]> = {
    Transport: ["Car", "Bus", "Bike", "Walk", "Train"],
    Meal: ["Plant-based", "Vegetarian", "Chicken", "Beef"],
    Energy: ["Electricity", "Gas", "Water"],
    Purchase: ["Clothing", "Electronics", "Goods"],
  };

  const units: Record<LogKind, string> = {
    Transport: "miles",
    Meal: "servings",
    Energy: "kWh",
    Purchase: "$",
  };
  const unit = units[kind];

  const numericAmount = Number(amount);
  const co2 = estimateCO2(kind, option, numericAmount);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(amount ? `${amount} ${unit} · ${option}` : option);
      }}
      className="space-y-4 px-1 pt-2"
      aria-label={`Log ${kind.toLowerCase()} activity`}
    >
      <div className="space-y-2">
        <Label htmlFor="log-type">Type</Label>
        <Select value={option} onValueChange={setOption}>
          <SelectTrigger id="log-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options[kind].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-amount">Amount ({unit})</Label>
        <Input
          id="log-amount"
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="e.g. 5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div
        aria-live="polite"
        className="rounded-xl bg-mint/50 px-3 py-2 text-xs text-moss"
      >
        Estimated impact:{" "}
        <span className="font-semibold">
          {co2 > 0 ? formatCO2(co2) : "—"}
        </span>
      </div>
      <SheetFooter className="flex-row gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-moss text-paper hover:bg-moss/90"
        >
          Save entry
        </Button>
      </SheetFooter>
    </form>
  );
}

function QuickButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-2xl bg-card p-3 text-sm font-medium text-ink ring-1 ring-black/5 transition-transform active:scale-[0.98] hover:bg-mint/40"
    >
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
      type="button"
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

