import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  LayoutDashboard,
  Briefcase,
  LogOut,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  Inbox,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import {
  type Application,
  STATUSES,
  type Status,
  createApplication,
  deleteApplication,
  getAllApplications,
  updateApplication,
} from "@/services/applications";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Dashboard — ApplyZen" },
      { name: "description", content: "Your job application dashboard." },
    ],
  }),
  component: Dashboard,
});

const statusBadge: Record<Status, string> = {
  Applied: "bg-info/10 text-info ring-info/20",
  Interview: "bg-warning/15 text-warning-foreground ring-warning/30",
  Offer: "bg-primary/10 text-primary ring-primary/20",
  Rejected: "bg-muted text-muted-foreground ring-border",
};

function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setApps(await getAllApplications());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const by = (s: Status) => apps.filter((a) => a.status === s).length;
    return {
      total: apps.length,
      interview: by("Interview"),
      offer: by("Offer"),
      rejected: by("Rejected"),
    };
  }, [apps]);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filter !== "All" && a.status !== filter) return false;
      if (query && !`${a.company_name} ${a.role}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [apps, filter, query]);

  async function handleSubmit(payload: Parameters<typeof createApplication>[0]) {
    try {
      if (editing) {
        const updated = await updateApplication(editing.id, payload);
        setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        toast.success("Application updated");
      } else {
        const created = await createApplication(payload);
        setApps((prev) => [created, ...prev]);
        toast.success("Application added");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
      toast.success("Application deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
          <div className="px-6 py-5">
            <Logo />
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Briefcase} label="Applications" active />
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <div className="rounded-lg px-3 py-2 text-xs">
              <div className="font-semibold text-sidebar-foreground truncate">{email || "Signed in"}</div>
              <button
                onClick={handleSignOut}
                className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
          {/* Mobile header */}
          <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo />
            <button onClick={handleSignOut} className="text-sm text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Title row */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                A calm overview of your job search.
              </p>
            </div>
            <button
              onClick={() => { setEditing(null); setDialogOpen(true); }}
              className="inline-flex items-center gap-1.5 rounded-lg gradient-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add application
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={Inbox} label="Total" value={stats.total} tone="text-foreground" delay={0} />
            <StatCard icon={TrendingUp} label="Interviews" value={stats.interview} tone="text-info" delay={60} />
            <StatCard icon={CheckCircle2} label="Offers" value={stats.offer} tone="text-primary" delay={120} />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} tone="text-muted-foreground" delay={180} />
          </div>

          {/* Filter bar */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-1 shadow-soft">
              {(["All", ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    filter === s
                      ? "gradient-emerald text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company or role"
                className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm shadow-soft outline-none transition-shadow focus:ring-2 focus:ring-ring/40 sm:w-72"
              />
            </div>
          </div>

          {/* List */}
          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground shadow-soft">
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onAdd={() => { setEditing(null); setDialogOpen(true); }} hasAny={apps.length > 0} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft animate-fade-in">
                <div className="hidden grid-cols-12 gap-3 border-b border-border bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                  <div className="col-span-3">Company</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <ul>
                  {filtered.map((a, i) => (
                    <li
                      key={a.id}
                      className="grid grid-cols-1 gap-3 border-b border-border px-5 py-4 transition-colors last:border-0 hover:bg-muted/40 md:grid-cols-12 md:items-center animate-slide-up"
                      style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                    >
                      <div className="md:col-span-3">
                        <div className="font-semibold">{a.company_name}</div>
                        {a.salary && (
                          <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3" />{a.salary}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <div className="text-sm text-foreground">{a.role}</div>
                        {a.notes && (
                          <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
                            <MessageSquare className="h-3 w-3 shrink-0" />{a.notes}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusBadge[a.status as Status] ?? statusBadge.Applied}`}>
                          {a.status}
                        </span>
                      </div>
                      <div className="md:col-span-2 text-sm text-muted-foreground inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(a.date_applied)}
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-1">
                        {a.job_link && (
                          <a
                            href={a.job_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Open job link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => { setEditing(a); setDialogOpen(true); }}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>

      <ApplicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  delay,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  tone: string;
  delay: number;
}) {
  return (
    <div
      className="animate-slide-up rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className={`mt-2 text-3xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function EmptyState({ onAdd, hasAny }: { onAdd: () => void; hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft animate-fade-in">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 animate-float">
          <Briefcase className="h-9 w-9 text-primary" strokeWidth={2} />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold">
        {hasAny ? "No matches" : "No applications yet"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {hasAny
          ? "Try a different filter or search term."
          : "Add your first job application to start tracking your search."}
      </p>
      {!hasAny && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg gradient-emerald px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add your first application
        </button>
      )}
    </div>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}
