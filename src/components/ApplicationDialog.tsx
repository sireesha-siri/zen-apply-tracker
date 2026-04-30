import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import type { Application, ApplicationInsert, Status } from "@/services/applications";
import { STATUSES } from "@/services/applications";

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Application | null;
  onSubmit: (data: Omit<ApplicationInsert, "user_id">) => Promise<void>;
};

export function ApplicationDialog({ open, onClose, initial, onSubmit }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [dateApplied, setDateApplied] = useState(() => new Date().toISOString().slice(0, 10));
  const [salary, setSalary] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCompanyName(initial?.company_name ?? "");
      setRole(initial?.role ?? "");
      setStatus((initial?.status as Status) ?? "Applied");
      setDateApplied(initial?.date_applied ?? new Date().toISOString().slice(0, 10));
      setSalary(initial?.salary ?? "");
      setJobLink(initial?.job_link ?? "");
      setNotes(initial?.notes ?? "");
    }
  }, [open, initial]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        company_name: companyName.trim(),
        role: role.trim(),
        status,
        date_applied: dateApplied,
        salary: salary.trim() || null,
        job_link: jobLink.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-elevated animate-slide-up"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit application" : "Add application"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company *">
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Linear"
                className={inputCls}
              />
            </Field>
            <Field label="Role *">
              <input
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Product Designer"
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Date applied">
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Salary">
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="$120k"
                className={inputCls}
              />
            </Field>
            <Field label="Job link">
              <input
                type="url"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Recruiter contact, interview prep, etc."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg gradient-emerald px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevated disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
