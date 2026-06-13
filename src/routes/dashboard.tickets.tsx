import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ticket, Save } from "lucide-react";

export const Route = createFileRoute("/dashboard/tickets")({
  head: () => ({ meta: [{ title: "Tickets — CIVRAT" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Tickets"
        description="Configurez le système de support de votre serveur."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingCard title="Activation" description="Activez ou désactivez le module Tickets.">
          <Toggle label="Activer les tickets" defaultChecked hint="Permet aux membres d'ouvrir des tickets de support." />
          <Toggle label="Autoriser plusieurs tickets" hint="Un même utilisateur peut ouvrir plusieurs tickets simultanément." />
          <Field label="Tickets max par utilisateur" hint="0 = illimité"><Input type="number" defaultValue={3} className="bg-card/60" /></Field>
        </SettingCard>

        <SettingCard title="Configuration" description="Paramètres principaux du module." accent="gold">
          <Field label="Catégorie des tickets"><Input defaultValue="📂 tickets" className="bg-card/60" /></Field>
          <Field label="Rôle support"><Input defaultValue="@Support" className="bg-card/60" /></Field>
          <Field label="Rôle admin"><Input defaultValue="@Admin" className="bg-card/60" /></Field>
          <Field label="Salon des logs"><Input defaultValue="#tickets-logs" className="bg-card/60" /></Field>
        </SettingCard>

        <SettingCard title="Panel de ticket" description="Message qui sera publié dans le panel.">
          <Field label="Message du panel">
            <Textarea
              rows={5}
              defaultValue="🎫 Besoin d'aide ?\nCliquez sur le bouton ci-dessous pour ouvrir un ticket. Notre équipe vous répondra rapidement."
              className="bg-card/60"
            />
          </Field>
          <Button variant="ghost" className="border border-border bg-card/60">Publier le panel</Button>
        </SettingCard>

        <SettingCard title="Aperçu" description="Prévisualisation du panel de ticket." accent="gold">
          <div className="rounded-xl border border-border bg-background/60 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Support CIVRAT</div>
                <div className="text-xs text-muted-foreground">Bot · aujourd'hui</div>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm text-foreground/90">🎫 Besoin d'aide ?{"\n"}Cliquez sur le bouton ci-dessous pour ouvrir un ticket.</p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">🎫 Ouvrir un ticket</Button>
          </div>
        </SettingCard>
      </div>
    </>
  );
}

function Toggle({ label, hint, defaultChecked }: { label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
