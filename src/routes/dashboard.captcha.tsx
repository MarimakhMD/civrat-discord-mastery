import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, Save, ShieldCheck } from "lucide-react";
import { useGuildConfig } from "@/lib/use-guild-config";

export const Route = createFileRoute("/dashboard/captcha")({
  head: () => ({ meta: [{ title: "Captcha — CIVRAT" }] }),
  component: CaptchaPage,
});

function CaptchaPage() {
  const { config, setConfig, saving, handleSave } = useGuildConfig();

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Vérification Captcha"
        description="Protégez votre serveur contre les bots avec une vérification."
        actions={<Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</Button>}
      />

      <SettingCard title="Activer la vérification" description="Activez le système de captcha pour les nouveaux membres.">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Vérification Captcha</span>
          </div>
          <Switch checked={config.captcha_enabled ?? false} onCheckedChange={(v) => setConfig({ captcha_enabled: v })} />
        </div>
      </SettingCard>

      {(config.captcha_enabled ?? false) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <SettingCard title="Configuration" description="Définissez les paramètres de vérification.">
            <Field label="Salon de vérification">
              <Input placeholder="#vérification" value={config.captcha_channel_id ?? ""} onChange={(e) => setConfig({ captcha_channel_id: e.target.value })} className="bg-card/60" />
            </Field>
            <Field label="Rôle vérifié">
              <Input placeholder="@Vérifié" value={config.captcha_role_id ?? ""} onChange={(e) => setConfig({ captcha_role_id: e.target.value })} className="bg-card/60" />
            </Field>
            <Field label="Type de captcha">
              <select
                value={config.captcha_type ?? "button"}
                onChange={(e) => setConfig({ captcha_type: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-input bg-card/60 px-3 py-2 text-sm"
              >
                <option value="button">Bouton de vérification</option>
                <option value="image">Captcha image</option>
              </select>
            </Field>
            <Field label="Message de succès">
              <Input placeholder="Vous avez été vérifié !" value={config.captcha_success_message ?? ""} onChange={(e) => setConfig({ captcha_success_message: e.target.value })} className="bg-card/60" />
            </Field>
            <Field label="Message d'échec">
              <Input placeholder="Vérification échouée. Réessayez." value={config.captcha_failure_message ?? ""} onChange={(e) => setConfig({ captcha_failure_message: e.target.value })} className="bg-card/60" />
            </Field>
          </SettingCard>

          <SettingCard title="Aperçu" description="Aperçu du captcha." accent="neon">
            {config.captcha_type === "image" ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-background/40 p-8">
                <div className="grid h-16 w-48 place-items-center rounded-lg bg-card/80 text-muted-foreground text-sm border border-border/40">Image Captcha</div>
                <Input placeholder="Entrez le code…" className="bg-card/60 max-w-48" />
                <Button className="bg-primary text-primary-foreground">Vérifier</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/60 bg-background/40 p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                  <UserCheck className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">Cliquez pour vérifier que vous êtes humain</p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon w-full max-w-xs">Vérifier</Button>
              </div>
            )}
          </SettingCard>
        </div>
      )}
    </>
  );
}
