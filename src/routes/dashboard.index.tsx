import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import {
  Users, Ticket, ScrollText, Shield, Sparkles, TrendingUp, ArrowUpRight, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview — CIVRAT" }] }),
  component: Overview,
});

function Overview() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Bienvenue, Admin 👋"
        description="Vue d'ensemble de l'activité et de la santé de votre serveur."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total membres" value="2,481" delta="+128" icon={Users} tone="neon" />
        <StatCard label="Tickets" value="14 actifs" delta="32 résolus" icon={Ticket} tone="gold" status="ok" />
        <StatCard label="Logs" value="Activé" delta="6 types actifs" icon={ScrollText} tone="neon" status="ok" />
        <StatCard label="Sécurité" value="Protégé" delta="Anti-raid ON" icon={Shield} tone="neon" status="ok" />
        <StatCard label="XP" value="38.2k / j" delta="+12%" icon={Sparkles} tone="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="glass col-span-2 rounded-2xl p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold">Activité 7 jours</h3>
              <p className="text-xs text-muted-foreground">Messages, commandes & événements modération</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
              <TrendingUp className="h-3.5 w-3.5" /> +18.4%
            </div>
          </div>
          <Chart />
        </section>

        <section className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Activité récente</h3>
          <ul className="mt-4 space-y-3">
            {[
              { c: "primary", t: "Ticket #248 ouvert", s: "il y a 2 min" },
              { c: "gold", t: "Anti-raid déclenché (3 comptes)", s: "il y a 12 min" },
              { c: "primary", t: "Nouveau membre: @Lyra", s: "il y a 22 min" },
              { c: "primary", t: "Level up: @Nox → 14", s: "il y a 41 min" },
              { c: "gold", t: "Invitation premium activée", s: "il y a 1 h" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-card/60">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.c === "gold" ? "bg-gold shadow-[0_0_8px_var(--gold)]" : "bg-primary shadow-[0_0_8px_var(--primary)]"}`} />
                <div className="min-w-0 text-sm">
                  <div className="truncate">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.s}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function StatCard({
  label, value, delta, icon: Icon, tone, status,
}: { label: string; value: string; delta: string; icon: LucideIcon; tone: "neon" | "gold"; status?: "ok" }) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl ${tone === "gold" ? "bg-gold/15" : "bg-primary/15"}`} />
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-lg border ${tone === "gold" ? "border-gold/30 bg-gold/10 text-gold" : "border-primary/30 bg-primary/10 text-primary"}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="relative mt-3 font-display text-2xl font-bold">{value}</div>
      <div className="relative mt-1 flex items-center gap-1.5 text-xs">
        {status === "ok" && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />}
        <span className="text-muted-foreground">{delta}</span>
        <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
}

function Chart() {
  const data = [12, 18, 14, 22, 28, 24, 34, 30, 38, 36, 44, 42, 50, 56];
  const max = Math.max(...data);
  return (
    <div className="mt-6 flex h-48 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="group relative flex-1">
          <div
            className="w-full rounded-md bg-gradient-to-t from-primary/70 to-gold/70 transition-all hover:from-primary hover:to-gold"
            style={{ height: `${(v / max) * 100}%` }}
          />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-card px-1.5 py-0.5 text-[10px] opacity-0 group-hover:opacity-100">{v}k</div>
        </div>
      ))}
    </div>
  );
}
