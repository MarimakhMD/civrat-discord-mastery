import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ticket, ScrollText, Shield, UserPlus, Sparkles, Link2,
  ArrowRight, Zap, CheckCircle2, BarChart3, Activity, Users,
} from "lucide-react";
import { SiteHeader } from "@/components/civrat/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CIVRAT — Dashboard Discord premium" },
      { name: "description", content: "Le bot Discord ultime pour la gestion, la sécurité et l'automatisation de vos serveurs." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Ticket, emoji: "🎫", title: "Tickets", desc: "Système de support modulaire avec panels, rôles et logs intégrés." },
  { icon: ScrollText, emoji: "📜", title: "Logs", desc: "Suivi complet des messages, rôles, salons et modération." },
  { icon: Shield, emoji: "🛡️", title: "Sécurité & Modération", desc: "Anti-raid, anti-spam, anti-lien et anti-mention en temps réel." },
  { icon: UserPlus, emoji: "👋", title: "Bienvenue", desc: "Messages et rôles automatiques pour chaque nouveau membre." },
  { icon: Sparkles, emoji: "⭐", title: "XP & Niveaux", desc: "Système d'expérience configurable avec rewards et leaderboard." },
  { icon: Link2, emoji: "🔗", title: "Invitations", desc: "Traque les invitations et récompense vos ambassadeurs." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="grid-bg absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="h-3.5 w-3.5" /> Phase 1 — Public beta
            </div>

            <h1 className="animate-fade-up mt-6 font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl" style={{ animationDelay: "60ms" }}>
              CIV<span className="text-gradient-neon">RAT</span>
            </h1>

            <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground/90 sm:text-xl" style={{ animationDelay: "120ms" }}>
              Le bot Discord ultime pour la gestion, la sécurité et l'automatisation de vos serveurs.
            </p>
            <p className="animate-fade-up mx-auto mt-3 max-w-xl text-sm text-muted-foreground" style={{ animationDelay: "180ms" }}>
              Tickets, logs, modération anti-raid, XP & niveaux, suivi d'invitations — pilotez tout depuis un dashboard moderne.
            </p>

            <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
              <Button asChild size="lg" className="animate-glow h-12 gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                <Link to="/login">
                  <DiscordMark className="h-5 w-5" />
                  Connexion Discord
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 border border-border bg-card/40 px-6 text-base">
                <a href="#features">Découvrir les modules</a>
              </Button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="animate-fade-up relative mx-auto mt-20 max-w-5xl" style={{ animationDelay: "320ms" }}>
            <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10 bg-gradient-to-tr from-primary/20 via-transparent to-gold/20 blur-3xl" />
            <div className="glass-strong overflow-hidden rounded-2xl shadow-elegant">
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-card/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="ml-3 text-xs text-muted-foreground">civrat.app/dashboard</span>
              </div>
              <div className="grid grid-cols-12 gap-4 p-4 sm:p-6">
                <div className="col-span-12 grid grid-cols-2 gap-3 sm:col-span-3">
                  {["Overview","Tickets","Logs","Welcome","Security","XP"].map((n,i) => (
                    <div key={n} className={`rounded-lg border border-border/60 px-3 py-2 text-xs ${i===0 ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>{n}</div>
                  ))}
                </div>
                <div className="col-span-12 grid grid-cols-3 gap-3 sm:col-span-9">
                  <PreviewStat icon={Users} label="Membres" value="2,481" tone="neon" />
                  <PreviewStat icon={Activity} label="Tickets actifs" value="14" tone="gold" />
                  <PreviewStat icon={BarChart3} label="XP gagnés / 24h" value="38.2k" tone="neon" />
                  <div className="col-span-3 mt-1 h-40 rounded-xl border border-border/60 bg-gradient-to-tr from-primary/10 via-transparent to-gold/10 p-3">
                    <div className="text-xs text-muted-foreground">Activité 7 jours</div>
                    <Sparkline />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">Modules</div>
          <h2 className="mt-4 text-balance text-3xl font-bold sm:text-4xl">Tout ce qu'il faut pour gérer un serveur premium</h2>
          <p className="mt-3 text-muted-foreground">Des modules pensés pour les communautés exigeantes, configurables en un clic.</p>
        </div>

        <div id="modules" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="animate-fade-up glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-neon"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:bg-primary/20" />
                <div className="relative flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{f.emoji}</span>
                      <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Configurer <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="glass-strong grid grid-cols-2 gap-6 rounded-2xl p-8 sm:grid-cols-4">
          {[
            { v: "12k+", l: "Serveurs équipés" },
            { v: "3.4M", l: "Membres protégés" },
            { v: "99.99%", l: "Uptime" },
            { v: "<40ms", l: "Latence moyenne" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-gradient-neon font-display text-3xl font-bold sm:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h3 className="font-display text-3xl font-bold sm:text-4xl">Prêt à protéger votre serveur ?</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Connectez votre compte Discord et configurez CIVRAT en moins de 60 secondes.</p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" className="h-12 gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-neon">
              <Link to="/login">
                <DiscordMark className="h-5 w-5" /> Connexion Discord
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {["Aucune carte requise","Setup instantané","Support 24/7"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} CIVRAT. Tous droits réservés.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Confidentialité</a>
            <a href="#" className="hover:text-foreground">CGU</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewStat({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: string; tone: "neon" | "gold" }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${tone === "gold" ? "text-gold" : "text-primary"}`} /> {label}
      </div>
      <div className="mt-1.5 font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function Sparkline() {
  const points = "0,30 20,22 40,26 60,14 80,18 100,8 120,12 140,6 160,10 180,4 200,8";
  return (
    <svg viewBox="0 0 200 40" className="mt-2 h-28 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="var(--primary)" strokeWidth="1.5" points={points} />
      <polygon fill="url(#g)" points={`${points} 200,40 0,40`} />
    </svg>
  );
}

function DiscordMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.196.357-.42.83-.577 1.207a18.27 18.27 0 0 0-5.962 0A12.86 12.86 0 0 0 9.43 3 19.74 19.74 0 0 0 5.67 4.371C2.39 9.255 1.494 14.02 1.942 18.717a19.94 19.94 0 0 0 6.013 3.058c.486-.66.92-1.36 1.293-2.094-.71-.27-1.39-.6-2.03-.99.17-.126.337-.258.498-.394 3.927 1.83 8.18 1.83 12.062 0 .163.136.33.268.5.394-.64.39-1.323.72-2.034.99.374.734.808 1.435 1.293 2.094a19.9 19.9 0 0 0 6.017-3.058c.5-5.444-.838-10.165-3.237-14.348ZM9.34 15.804c-1.183 0-2.157-1.085-2.157-2.42 0-1.337.953-2.422 2.157-2.422 1.21 0 2.18 1.094 2.157 2.422 0 1.335-.953 2.42-2.157 2.42Zm5.32 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.337.953-2.422 2.157-2.422 1.21 0 2.18 1.094 2.157 2.422 0 1.335-.946 2.42-2.157 2.42Z" />
    </svg>
  );
}
