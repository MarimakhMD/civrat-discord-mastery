import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Paramètres — CIVRAT" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Préférences générales du bot et du dashboard."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingCard title="Général">
          <Field label="Nom du bot"><Input defaultValue="CIVRAT" className="bg-card/60" /></Field>
          <Field label="Préfixe"><Input defaultValue="!" className="bg-card/60" /></Field>
          <Field label="Langue"><Input defaultValue="Français" className="bg-card/60" /></Field>
        </SettingCard>

        <SettingCard title="Notifications" accent="gold">
          <Toggle label="Email d'alerte sécurité" defaultChecked />
          <Toggle label="Résumé hebdomadaire" defaultChecked />
          <Toggle label="Mises à jour produit" />
        </SettingCard>

        <SettingCard title="Zone de danger" description="Actions irréversibles.">
          <Button variant="ghost" className="w-full justify-start border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10">
            Réinitialiser la configuration
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 border border-border bg-card/60">
            <LogOut className="h-4 w-4" /> Déconnecter ce serveur
          </Button>
        </SettingCard>
      </div>
    </>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
