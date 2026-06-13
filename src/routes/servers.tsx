import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/civrat/Logo";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth, getGuildIconUrl, getUserAvatarUrl } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Sélection du serveur — CIVRAT" }] }),
  component: ServersPage,
});

function ServersPage() {
  const { user, guilds, setSelectedGuild, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const handleSelect = (guild: typeof guilds[0]) => {
    setSelectedGuild(guild);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 -z-10" />
      <header className="border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Connecté
            </div>
            <div className="flex items-center gap-2">
              <img
                src={getUserAvatarUrl(user.id, user.avatar)}
                alt=""
                className="h-7 w-7 rounded-full"
              />
              <span className="text-sm font-medium hidden sm:block">{user.global_name ?? user.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }}>
              Déconnexion
            </Button>
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

        {guilds.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted-foreground">Vous n'avez aucun serveur avec les permissions Administrateur ou Gérer le Serveur.</p>
            <Button variant="ghost" className="mt-4" onClick={() => window.open("https://discord.com/channels/@me", "_blank")}>
              Ouvrir Discord
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guilds.map((guild, i) => {
              const iconUrl = getGuildIconUrl(guild.id, guild.icon);
              return (
                <article
                  key={guild.id}
                  className="animate-fade-up glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-neon cursor-pointer"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => handleSelect(guild)}
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:bg-primary/20" />
                  <div className="relative flex items-center gap-4">
                    {iconUrl ? (
                      <img src={iconUrl} alt="" className="h-14 w-14 rounded-2xl" />
                    ) : (
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold font-display text-lg font-bold text-primary-foreground shadow-neon">
                        {guild.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold">{guild.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" /> {guild.owner ? "Propriétaire" : "Administrateur"}
                      </p>
                    </div>
                  </div>

                  <Button className="mt-5 w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground" onClick={(e) => { e.stopPropagation(); handleSelect(guild); }}>
                    Gérer le serveur <ArrowRight className="h-4 w-4" />
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
