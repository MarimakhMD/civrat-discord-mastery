import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Sparkles, Crown, Medal, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard/xp")({
  head: () => ({ meta: [{ title: "XP System — CIVRAT" }] }),
  component: XpPage,
});

const leaderboard = [
  { rank: 1, name: "@Lyra", lvl: 42, xp: 128_400, icon: Crown, tone: "gold" as const },
  { rank: 2, name: "@Nox", lvl: 39, xp: 112_900, icon: Trophy, tone: "neon" as const },
  { rank: 3, name: "@Zen", lvl: 36, xp: 98_220, icon: Medal, tone: "gold" as const },
  { rank: 4, name: "@Kira", lvl: 31, xp: 74_180, icon: Sparkles, tone: "neon" as const },
  { rank: 5, name: "@Vex", lvl: 28, xp: 62_010, icon: Sparkles, tone: "neon" as const },
];

function XpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="XP & Niveaux"
        description="Récompensez l'activité de votre communauté."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid gap-5 lg:col-span-2">
          <SettingCard title="Configuration" description="Réglages globaux du système d'XP.">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
              <div>
                <div className="text-sm font-medium">Activer l'XP</div>
                <div className="text-xs text-muted-foreground">Active le gain d'XP par message.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="XP par message"><Input type="number" defaultValue={15} className="bg-card/60" /></Field>
              <Field label="Cooldown (secondes)"><Input type="number" defaultValue={60} className="bg-card/60" /></Field>
            </div>
          </SettingCard>

          <SettingCard title="Récompenses de niveau" description="Attribuez un rôle à chaque palier." accent="gold">
            <div className="space-y-2">
              {[5, 10, 25, 50].map((lvl) => (
                <div key={lvl} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-gold font-display text-sm font-bold text-primary-foreground">{lvl}</div>
                  <Input defaultValue={`@Niveau ${lvl}`} className="bg-card/60" />
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">Retirer</Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full border border-dashed border-border bg-card/40">+ Ajouter une récompense</Button>
            </div>
          </SettingCard>
        </div>

        <SettingCard title="Leaderboard" description="Top des membres les plus actifs.">
          <ol className="space-y-2">
            {leaderboard.map((u) => {
              const Icon = u.icon;
              return (
                <li key={u.rank} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${u.tone === "gold" ? "bg-gold/15 text-gold border border-gold/30" : "bg-primary/10 text-primary border border-primary/30"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{u.name}</div>
                    <div className="text-xs text-muted-foreground">Lvl {u.lvl} · {u.xp.toLocaleString("fr-FR")} XP</div>
                  </div>
                  <span className="font-display text-sm font-bold text-muted-foreground">#{u.rank}</span>
                </li>
              );
            })}
          </ol>
        </SettingCard>
      </div>
    </>
  );
}
