import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Save } from "lucide-react";
import { useGuildConfig } from "@/lib/use-guild-config";

export const Route = createFileRoute("/dashboard/suggestions")({
  head: () => ({ meta: [{ title: "Suggestions — CIVRAT" }] }),
  component: SuggestionsPage,
});

function SuggestionsPage() {
  const { config, setConfig, saving, handleSave } = useGuildConfig();

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Suggestions"
        description="Configurez le système de suggestions pour votre communauté."
        actions={<Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</Button>}
      />

      <SettingCard title="Activer les Suggestions" description="Activez le système de suggestions communautaires.">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <ThumbsUp className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Suggestions</span>
          </div>
          <Switch checked={config.suggestions_enabled ?? false} onCheckedChange={(v) => setConfig({ suggestions_enabled: v })} />
        </div>
      </SettingCard>

      {(config.suggestions_enabled ?? false) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <SettingCard title="Configuration" description="Définissez les salons et fonctionnalités.">
            <Field label="Salon des suggestions">
              <Input placeholder="#suggestions" value={config.suggestions_channel_id ?? ""} onChange={(e) => setConfig({ suggestions_channel_id: e.target.value })} className="bg-card/60" />
            </Field>
            <Field label="Salon d'approbation (staff)">
              <Input placeholder="#approbation" value={config.suggestions_approval_channel_id ?? ""} onChange={(e) => setConfig({ suggestions_approval_channel_id: e.target.value })} className="bg-card/60" />
            </Field>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="text-sm font-medium">Système Pour/Contre</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="text-sm font-medium">Approbation du staff</span>
                <Switch defaultChecked />
              </div>
            </div>
          </SettingCard>

          <SettingCard title="Aperçu" description="Aperçu d'une suggestion." accent="neon">
            <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card/80 text-xs font-bold">U</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Utilisateur</div>
                  <p className="mt-2 text-sm">Ajouter un bot de musique au serveur</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                  <ThumbsUp className="h-3.5 w-3.5" /> 5
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
                  <ThumbsDown className="h-3.5 w-3.5" /> 1
                </div>
                <span className="ml-auto rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">En attente</span>
              </div>
              <div className="flex gap-2 border-t border-border/40 pt-3">
                <Button size="sm" className="bg-primary text-primary-foreground">Approuver</Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">Rejeter</Button>
              </div>
            </div>
          </SettingCard>
        </div>
      )}
    </>
  );
}
