import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Save, Clock, Users, Gift, X } from "lucide-react";
import { useGuildConfig } from "@/lib/use-guild-config";

export const Route = createFileRoute("/dashboard/giveaways")({
  head: () => ({ meta: [{ title: "Giveaways — CIVRAT" }] }),
  component: GiveawaysPage,
});

function GiveawaysPage() {
  const { config, setConfig, saving, handleSave } = useGuildConfig();

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Giveaways"
        description="Créez et gérez des giveaways pour votre communauté."
        actions={<Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</Button>}
      />

      <SettingCard title="Activer les Giveaways" description="Activez le système de giveaways.">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Gift className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Giveaways</span>
          </div>
          <Switch checked={config.giveaways_enabled ?? false} onCheckedChange={(v) => setConfig({ giveaways_enabled: v })} />
        </div>
      </SettingCard>

      {(config.giveaways_enabled ?? false) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <SettingCard title="Créer un Giveaway" description="Configurez un nouveau giveaway.">
            <Field label="Titre"><Input placeholder="Nitro Gift" className="bg-card/60" /></Field>
            <Field label="Description"><Textarea rows={2} placeholder="Gagnez un mois de Discord Nitro !" className="bg-card/60" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée (heures)"><Input type="number" min={1} max={720} defaultValue={24} className="bg-card/60" /></Field>
              <Field label="Nombre de gagnants"><Input type="number" min={1} max={20} defaultValue={1} className="bg-card/60" /></Field>
            </div>
            <Field label="Exigences"><Input placeholder="ex: Niveau 10+" className="bg-card/60" /></Field>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon">
              <Trophy className="h-4 w-4" /> Créer le Giveaway
            </Button>
          </SettingCard>

          <div className="grid gap-5">
            <SettingCard title="Giveaways actifs" accent="neon">
              <div className="space-y-3">
                {[
                  { title: "Nitro Gift", desc: "1 mois de Discord Nitro", time: "2h 15m", winners: 2 },
                  { title: "Gaming Headset", desc: "Casque gaming sans fil", time: "5h 30m", winners: 1 },
                ].map((g, i) => (
                  <div key={i} className="flex items-start justify-between rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold truncate">{g.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{g.time}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{g.winners} gagnant{g.winners > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 shrink-0"><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </SettingCard>

            <SettingCard title="Giveaways terminés" accent="gold">
              <div className="rounded-xl border border-border/40 bg-background/30 p-3 opacity-60">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Steam Gift Card</span>
                  <Badge variant="secondary" className="text-xs">Terminé</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Carte cadeau Steam de 50$</p>
              </div>
            </SettingCard>
          </div>
        </div>
      )}
    </>
  );
}
