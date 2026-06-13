import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/civrat/Logo";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Sélection du serveur — CIVRAT" }] }),
  component: ServersPage,
});

const servers = [
  { name: "Cyber Lounge", members: 12480, color: "from-primary to-gold", tag: "CL" },
  { name: "Crypto Devs", members: 3210, color: "from-gold to-primary", tag: "CD" },
  { name: "Neon Esport", members: 8902, color: "from-primary/80 to-primary", tag: "NE" },
  { name: "Bug Bounty FR", members: 1540, color: "from-gold/80 to-gold", tag: "BB" },
  { name: "AI Builders", members: 5621, color: "from-primary to-gold/70", tag: "AI" },
  { name: "Pixel Studio", members: 990, color: "from-gold to-primary/60", tag: "PS" },
];

function ServersPage() {
  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 -z-10" />
      <header className="border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Connecté
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="animate-fade-up mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">Étape 2 / 3</div>
            <h1 className="mt-3 font-display text-4xl font-bold">Sélectionnez un serveur</h1>
            <p className="mt-2 text-muted-foreground">Choisissez le serveur Discord à gérer avec CIVRAT. Seuls les serveurs où vous êtes administrateur sont affichés.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 bg-card/60" placeholder="Rechercher un serveur…" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servers.map((s, i) => (
            <article
              key={s.name}
              className="animate-fade-up glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-neon"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:bg-primary/20" />
              <div className="relative flex items-center gap-4">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.color} font-display text-lg font-bold text-primary-foreground shadow-neon`}>
                  {s.tag}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-semibold">{s.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {s.members.toLocaleString("fr-FR")} membres
                  </p>
                </div>
              </div>

              <Button asChild className="mt-5 w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/dashboard">
                  Gérer le serveur <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
