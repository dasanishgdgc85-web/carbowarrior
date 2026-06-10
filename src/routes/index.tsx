import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Leaf,
  TrendingDown,
  Users,
  Sparkles,
  Check,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant — Your quiet carbon companion" },
      {
        name: "description",
        content:
          "Understand your carbon footprint, get personalized reduction tips, and join community challenges. A calm, mobile-first companion for everyday climate action.",
      },
      { property: "og:title", content: "Verdant — Your quiet carbon companion" },
      {
        property: "og:description",
        content:
          "Understand your carbon footprint, get personalized reduction tips, and join community challenges.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [email, setEmail] = useState("");

  const onWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You're on the list", {
      description: `We'll email ${email} when early access opens.`,
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-moss text-paper">
            <Leaf className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Verdant</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-sage md:flex">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-ink hover:bg-mint"
          >
            <Link to="/app">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-moss text-paper hover:bg-moss/90"
          >
            <Link to="/app">
              Open app
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 md:pt-20 md:pb-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-medium text-moss">
              <Sparkles className="size-3" />
              Now in private beta
            </span>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Your quiet
              <br />
              <span className="text-moss">carbon companion.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-sage">
              Track your footprint without spreadsheets. Verdant turns daily
              choices into measurable climate action — calm, accurate, and
              built for the long run.
            </p>

            <form
              onSubmit={onWaitlist}
              className="flex max-w-md gap-2 rounded-2xl bg-card p-2 ring-1 ring-black/5"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Mail className="size-4 text-sage" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button
                type="submit"
                className="bg-moss text-paper hover:bg-moss/90"
              >
                Join waitlist
              </Button>
            </form>

            <div className="flex items-center gap-6 text-xs text-sage">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-moss" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-moss" /> iOS & Android
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-moss" /> 5-minute setup
              </span>
            </div>
          </div>

          {/* Phone preview */}
          <PhonePreview />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-black/5 bg-mint/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {[
            { v: "50k", l: "tons CO₂ saved" },
            { v: "100k", l: "active users" },
            { v: "15%", l: "avg reduction" },
            { v: "4.8★", l: "App Store rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-3xl font-semibold tracking-tight text-ink">
                {s.v}
              </p>
              <p className="mt-1 text-xs text-sage">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-moss">
            Features
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Everything you need to lower your impact.
          </h2>
          <p className="mt-4 text-sage">
            Built around four pillars that cover 90% of your personal emissions.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Leaf className="size-5" />}
            title="Smart calculator"
            desc="Auto-detect commutes, sync utility data, and log meals in seconds. No spreadsheets."
          />
          <FeatureCard
            icon={<TrendingDown className="size-5" />}
            title="Personalized tips"
            desc="AI-ranked actions tailored to your habits, ordered by impact and effort."
          />
          <FeatureCard
            icon={<Users className="size-5" />}
            title="Community challenges"
            desc="Join friends, climb the leaderboard, and earn streaks for sustained change."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-mint/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-moss">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Three steps to a measurable footprint.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Quick baseline",
                d: "Answer 4 questions to estimate your starting footprint in under 5 minutes.",
              },
              {
                n: "02",
                t: "Track effortlessly",
                d: "We auto-detect commutes and sync utility data so you barely lift a finger.",
              },
              {
                n: "03",
                t: "Reduce together",
                d: "Get ranked recommendations and join challenges with friends.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-card p-6 ring-1 ring-black/5"
              >
                <span className="text-xs font-mono font-medium text-moss">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sage">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-moss">
            Pricing
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Free to start. Premium when you're ready.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <PriceCard
            name="Free"
            price="$0"
            features={[
              "Carbon tracking dashboard",
              "3 recommendations / month",
              "Join 1 community challenge",
            ]}
            cta="Get started"
          />
          <PriceCard
            featured
            name="Premium"
            price="$4.99/mo"
            features={[
              "Unlimited recommendations",
              "Advanced analytics & trends",
              "Unlimited challenges & teams",
              "Annual impact report",
            ]}
            cta="Try free for 14 days"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-3xl bg-moss px-8 py-16 text-center text-paper md:px-16">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Start the quiet revolution.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-paper/70">
            Join 100,000+ people lowering their footprint without burning out.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-paper text-moss hover:bg-paper/90"
          >
            <Link to="/app">
              Open the app
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-sage md:flex-row">
          <p>© 2026 Verdant Labs. Built for the long now.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl bg-card p-6 ring-1 ring-black/5 transition-all hover:shadow-sm hover:ring-moss/20">
      <span className="grid size-10 place-items-center rounded-xl bg-mint text-moss">
        {icon}
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sage">{desc}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  features,
  cta,
  featured,
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-8 ring-1 ${
        featured
          ? "bg-moss text-paper ring-moss"
          : "bg-card text-ink ring-black/5"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span
          className={`text-2xl font-semibold tracking-tight ${
            featured ? "text-paper" : "text-ink"
          }`}
        >
          {price}
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check
              className={`mt-0.5 size-4 shrink-0 ${
                featured ? "text-mint" : "text-moss"
              }`}
            />
            <span className={featured ? "text-paper/90" : "text-sage"}>
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`mt-8 w-full ${
          featured
            ? "bg-paper text-moss hover:bg-paper/90"
            : "bg-moss text-paper hover:bg-moss/90"
        }`}
      >
        <Link to="/app">{cta}</Link>
      </Button>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-8 rounded-[3rem] bg-mint/60 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-ink/90 bg-paper shadow-2xl">
        <div className="space-y-4 p-5 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-sage">
                Tuesday
              </p>
              <p className="text-sm font-semibold">Morning, Sarah</p>
            </div>
            <div className="grid size-8 place-items-center rounded-full bg-mint text-xs font-semibold text-moss">
              S
            </div>
          </div>

          <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5">
            <p className="text-xs text-sage">Sustainability Score</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">78</span>
              <span className="text-xs text-sage">/100</span>
            </div>
            <div className="mt-3 flex h-10 items-end gap-1">
              {[5, 7, 9, 6, 11].map((h, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-full ${i === 4 ? "bg-moss" : "bg-mint"}`}
                  style={{ height: `${h * 4}px` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-moss p-4 text-paper">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-paper/60">
              Active challenge
            </p>
            <p className="mt-1 text-sm font-medium">The 2-Mile Radius</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/15">
              <div className="h-full w-2/3 rounded-full bg-mint" />
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4 ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-300" />
              <div className="flex-1">
                <p className="text-xs font-medium">Skip the single-use cup</p>
                <p className="text-[10px] font-semibold text-moss">-4.2 kg CO₂ / mo</p>
              </div>
              <div className="grid size-6 place-items-center rounded-full bg-mint text-moss">
                <Check className="size-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
