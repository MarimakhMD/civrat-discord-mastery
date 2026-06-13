import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-neon transition-transform group-hover:scale-105">
        <span className="font-display text-lg font-bold">C</span>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/40" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        CIV<span className="text-gradient-neon">RAT</span>
      </span>
    </Link>
  );
}
