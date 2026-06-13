import type { ReactNode } from "react";

export function SettingCard({
  title, description, children, accent = "neon",
}: { title: string; description?: string; children?: ReactNode; accent?: "neon" | "gold" }) {
  return (
    <section className="glass relative overflow-hidden rounded-2xl p-6 transition-all hover:border-primary/40">
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl ${
          accent === "gold" ? "bg-gold/10" : "bg-primary/10"
        }`}
      />
      <div className="relative">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-5 space-y-4">{children}</div>
      </div>
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground/90">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
