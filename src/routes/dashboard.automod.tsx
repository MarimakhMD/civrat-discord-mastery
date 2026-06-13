import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Link as LinkI, AtSign, Type, Ghost, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGuildConfig } from "@/lib/use-guild-config";

export const Route = createFileRoute("/dashboard/automod")({
  head: () => ({ meta: [{ title: "Auto Moderation — CIVRAT" }] }),
  component: AutoModPage,
});

const rules: { key: string; label: string; desc: string; icon: LucideIcon }[] = [
  { key: "automod_anti_spam", label: "Anti Spam", desc: "Détecte et sanctionne les messages répétés.", icon: Zap },
  { key: "automod_anti_links", label: "Anti Liens", desc: "Supprime les liens non autorisés.", icon: LinkI },
  { key: "automod_anti_invites", label: "Anti Invitations", desc: "Bloque les invitations Discord.", icon: Shield },
  { key: "automod_anti_ghost_ping", label: "Anti Ghost Ping", desc: "Détecte les mentions supprimées.", icon: Ghost },
  { key: "automod_anti_mention_spam", label: "Anti Mention Spam", desc: "Bloque les mentions massives.", icon: AtSign },
  { key: "automod_anti_caps", label: "Anti Majuscules", desc: "Limite l'usage excessif des majuscules.", icon: Type },
];

function AutoModPage() {
  const { config, setConfig, saving, handleSave } = useGuildConfig();

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Auto Modération"
        description="Protégez automatiquement votre serveur avec des règles intelligentes."
        actions={<Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</Button>}
      />

      <SettingCard title="Activer l'Auto Modération" description="Activez ou désactivez le système complet.">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
          <span className="text-sm font-medium">Auto Modération</span>
          <Switch checked={config.automod_enabled ?? false} onCheckedChange={(v) => setConfig({ automod_enabled: v })} />
        </div>
      </SettingCard>

      {(config.automod_enabled ?? false) && (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {rules.map((r) => {
              const Icon = r.icon;
              const on = config[r.key as keyof typeof config] as boolean ?? false;
              return (
                <SettingCard key={r.key} title={r.label} description={r.desc} accent={on ? "neon" : "gold"}>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${on ? "border-primary/30 bg-primary/10 text-primary" : "border-border/60 bg-card/60 text-muted-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">Activer</span>
                    </div>
                    <Switch checked={on} onCheckedChange={(v) => setConfig({ [r.key]: v })} />
                  </div>
                </SettingCard>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <SettingCard title="Punition" description="Action prise quand une règle est enfreinte.">
              <Field label="Type de punition">
                <select
                  value={config.automod_punishment ?? "warn"}
                  onChange={(e) => setConfig({ automod_punishment: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-card/60 px-3 py-2 text-sm"
                >
                  <option value="warn">Avertissement</option>
                  <option value="mute">Mute</option>
                  <option value="kick">Kick</option>
                  <option value="ban">Ban</option>
                </select>
              </Field>
            </SettingCard>
            <SettingCard title="Seuils" description="Configurez les seuils de détection.">
              <Field label="Seuil de mentions (max)">
                <Input type="number" min={1} max={50} value={config.automod_mention_threshold ?? 5} onChange={(e) => setConfig({ automod_mention_threshold: parseInt(e.target.value) || 5 })} className="bg-card/60" />
              </Field>
              <Field label="Seuil de majuscules (%)">
                <Input type="number" min={10} max={100} value={config.automod_caps_threshold ?? 70} onChange={(e) => setConfig({ automod_caps_threshold: parseInt(e.target.value) || 70 })} className="bg-card/60" />
              </Field>
            </SettingCard>
          </div>
        </>
      )}
    </>
  );
}
