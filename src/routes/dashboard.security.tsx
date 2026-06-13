import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Link as LinkI, AtSign, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/security")({
  head: () => ({ meta: [{ title: "Sécurité — CIVRAT" }] }),
  component: SecurityPage,
});

const modules: { key: string; label: string; desc: string; icon: LucideIcon; level: number; on: boolean }[] = [
  { key: "spam", label: "Anti Spam", desc: "Détecte et sanctionne les messages répétés.", icon: Zap, level: 3, on: true },
  { key: "raid", label: "Anti Raid", desc: "Bloque les vagues de comptes suspects.", icon: Shield, level: 4, on: true },
  { key: "link", label: "Anti Link", desc: "Supprime les liens non autorisés.", icon: LinkI, level: 2, on: false },
  { key: "mention", label: "Anti Mention", desc: "Bloque les mentions massives.", icon: AtSign, level: 3, on: true },
];

function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Sécurité & Modération"
        description="Verrouillez votre serveur contre les abus avec une protection en temps réel."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="mb-6 glass relative overflow-hidden rounded-2xl p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-neon">
            <Shield className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-xl font-bold">Score de sécurité : <span className="text-gradient-neon">87 / 100</span></div>
            <div className="mt-1 text-sm text-muted-foreground">3 protections actives · 1 recommandation</div>
          </div>
          <Button variant="ghost" className="border border-border bg-card/60">Audit complet</Button>
        </div>
        <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full bg-card/60">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: "87%" }} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <SettingCard key={m.key} title={m.label} description={m.desc} accent={m.key === "raid" ? "gold" : "neon"}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Activer la protection</span>
                </div>
                <Switch defaultChecked={m.on} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Niveau (1-5)"><Input type="number" min={1} max={5} defaultValue={m.level} className="bg-card/60" /></Field>
                <Field label="Action"><Input defaultValue="Mute 10m" className="bg-card/60" /></Field>
              </div>
            </SettingCard>
          );
        })}
      </div>
    </>
  );
}
