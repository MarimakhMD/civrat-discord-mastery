import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard } from "@/components/civrat/SettingCard";
import { Button } from "@/components/ui/button";
import { Link2, Save, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/invitations")({
  head: () => ({ meta: [{ title: "Invitations — CIVRAT" }] }),
  component: InvitationsPage,
});

const inviters = [
  { name: "@Lyra", invites: 184, code: "civrat-lyra" },
  { name: "@Nox", invites: 142, code: "civrat-nox" },
  { name: "@Zen", invites: 98, code: "civrat-zen" },
  { name: "@Kira", invites: 71, code: "civrat-kira" },
];

function InvitationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Invitations"
        description="Suivez vos meilleurs ambassadeurs et récompensez-les."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid gap-5 lg:col-span-2">
          <SettingCard title="Top inviteurs" description="Classement sur les 30 derniers jours.">
            <ul className="space-y-2">
              {inviters.map((u, i) => (
                <li key={u.code} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold font-display text-sm font-bold text-primary-foreground">#{i + 1}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{u.name}</div>
                    <div className="truncate text-xs text-muted-foreground">discord.gg/{u.code}</div>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{u.invites}</span>
                </li>
              ))}
            </ul>
          </SettingCard>
        </div>

        <div className="grid gap-5">
          <SettingCard title="Vue d'ensemble" description="Activité globale." accent="gold">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Invitations 7j" value="312" />
              <Stat label="Conversions" value="78%" />
              <Stat label="Faux comptes" value="14" />
              <Stat label="Actifs" value="248" />
            </div>
          </SettingCard>
          <SettingCard title="Suivi en direct">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Link2 className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Tracking activé</div>
                <div className="text-xs text-muted-foreground">+12 invitations dans la dernière heure</div>
              </div>
              <TrendingUp className="ml-auto h-4 w-4 text-primary" />
            </div>
          </SettingCard>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </div>
  );
}
