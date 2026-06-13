import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard } from "@/components/civrat/SettingCard";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, MessageSquare, Shield, Users, UserCog, Hash, Link2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/logs")({
  head: () => ({ meta: [{ title: "Logs — CIVRAT" }] }),
  component: LogsPage,
});

const logs: { key: string; label: string; desc: string; icon: LucideIcon; on: boolean }[] = [
  { key: "msg", label: "Message Logs", desc: "Edition, suppression, pin / unpin", icon: MessageSquare, on: true },
  { key: "mod", label: "Moderation Logs", desc: "Bans, kicks, mutes, warns", icon: Shield, on: true },
  { key: "mem", label: "Member Logs", desc: "Arrivées, départs, changements", icon: Users, on: true },
  { key: "role", label: "Role Logs", desc: "Création, suppression, attribution", icon: UserCog, on: false },
  { key: "chan", label: "Channel Logs", desc: "Création, suppression, edition", icon: Hash, on: true },
  { key: "inv", label: "Invite Logs", desc: "Création, utilisation, expiration", icon: Link2, on: false },
];

function LogsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Logs"
        description="Activez les journaux dont vous avez besoin et définissez les salons cibles."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {logs.map((l) => {
          const Icon = l.icon;
          return (
            <SettingCard key={l.key} title={l.label} description={l.desc}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Activer</span>
                </div>
                <Switch defaultChecked={l.on} />
              </div>
              <Input placeholder="#logs-channel" defaultValue={l.on ? `#logs-${l.key}` : ""} className="bg-card/60" />
            </SettingCard>
          );
        })}
      </div>
    </>
  );
}
