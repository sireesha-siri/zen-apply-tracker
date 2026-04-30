import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-emerald shadow-soft transition-transform group-hover:scale-105">
        <Briefcase className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Apply<span className="text-gradient">Zen</span>
      </span>
    </Link>
  );
}
