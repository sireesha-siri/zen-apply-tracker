import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Filter,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Building2,
  Calendar,
  Briefcase,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApplyZen — Track every application. Land your dream job." },
      { name: "description", content: "The clean, calm way to track job applications. Status, notes, salary, links — all in one dashboard." },
      { property: "og:title", content: "ApplyZen — Job Application Tracker" },
      { property: "og:description", content: "Track every application. Land your dream job." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <AuthNav />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-soft">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Built for job seekers in 2026
            </div>
            <h1 className="animate-slide-up mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Track every application.
              <br />
              <span className="text-gradient">Land your dream job.</span>
            </h1>
            <p className="animate-slide-up delay-100 mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              ApplyZen brings every job you've applied to into one calm, organized dashboard — so nothing slips through the cracks.
            </p>
            <div className="animate-slide-up delay-200 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="inline-flex items-center gap-2 rounded-xl gradient-emerald px-6 py-3 text-base font-semibold text-primary-foreground shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
              >
                Start tracking free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-soft transition-all hover:bg-muted"
              >
                Sign in
              </Link>
            </div>
            <div className="animate-fade-in delay-300 mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Free forever</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Private &amp; secure</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="animate-slide-up delay-400 mt-16">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything in one calm place</h2>
          <p className="mt-4 text-muted-foreground">No spreadsheets. No sticky notes. Just clarity.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: LayoutDashboard, title: "Beautiful dashboard", desc: "See every application, status, and stat at a glance." },
            { icon: Filter, title: "Smart filters", desc: "Filter by Applied, Interview, Offer, or Rejected in one click." },
            { icon: BarChart3, title: "Live stats", desc: "Track your funnel — applications, interviews, offers." },
            { icon: Building2, title: "Rich detail", desc: "Capture role, salary, link, and notes for every opportunity." },
            { icon: ShieldCheck, title: "Private by default", desc: "Your data is yours. Encrypted and protected by row-level security." },
            { icon: Sparkles, title: "Zero clutter", desc: "A focused interface designed to reduce job-search anxiety." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="animate-slide-up rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Three steps to clarity</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", title: "Sign up free", desc: "Create your account in seconds with email and password." },
              { n: "02", title: "Add applications", desc: "Log every role you apply for with company, salary, and notes." },
              { n: "03", title: "Stay on top", desc: "Update statuses as you move forward and never miss a follow-up." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-card p-8 shadow-soft">
                <div className="text-3xl font-extrabold text-gradient">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="overflow-hidden rounded-3xl gradient-emerald p-10 text-center shadow-elevated md:p-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Your next role is one tracker away.
          </h2>
          <p className="mt-4 text-primary-foreground/90">Join job seekers who replaced messy spreadsheets with calm.</p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-base font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5"
          >
            Get started for free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>© 2026 ApplyZen. Built with care.</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "Total", value: 24, color: "text-foreground" },
    { label: "Interviews", value: 6, color: "text-info" },
    { label: "Offers", value: 2, color: "text-primary" },
    { label: "Rejected", value: 5, color: "text-muted-foreground" },
  ];
  const apps = [
    { co: "Linear", role: "Product Designer", status: "Interview", date: "Apr 28" },
    { co: "Stripe", role: "Frontend Engineer", status: "Applied", date: "Apr 26" },
    { co: "Vercel", role: "Developer Advocate", status: "Offer", date: "Apr 22" },
    { co: "Notion", role: "Software Engineer", status: "Rejected", date: "Apr 18" },
  ];
  const badge: Record<string, string> = {
    Applied: "bg-info/10 text-info",
    Interview: "bg-warning/15 text-warning-foreground",
    Offer: "bg-primary/10 text-primary",
    Rejected: "bg-muted text-muted-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-elevated md:p-4">
      <div className="rounded-xl bg-background p-5 md:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-12 gap-2 bg-muted/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">Company</div>
            <div className="col-span-4">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Date</div>
          </div>
          {apps.map((a) => (
            <div key={a.co} className="grid grid-cols-12 gap-2 border-t border-border px-4 py-3 text-sm">
              <div className="col-span-4 flex items-center gap-2 font-medium">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {a.co}
              </div>
              <div className="col-span-4 text-muted-foreground">{a.role}</div>
              <div className="col-span-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {a.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
