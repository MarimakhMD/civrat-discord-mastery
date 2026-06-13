import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard, Field } from "@/components/civrat/SettingCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, UserPlus } from "lucide-react";

export const Route = createFileRoute("/dashboard/welcome")({
  head: () => ({ meta: [{ title: "Welcome — CIVRAT" }] }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Bienvenue"
        description="Personnalisez l'expérience d'arrivée et de départ."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingCard title="Salons & rôles" description="Configurez où et comment accueillir vos membres.">
          <Field label="Salon de bienvenue"><Input defaultValue="#bienvenue" className="bg-card/60" /></Field>
          <Field label="Rôle auto (membre)"><Input defaultValue="@Membre" className="bg-card/60" /></Field>
          <Field label="Rôle auto (bot)"><Input defaultValue="@Bots" className="bg-card/60" /></Field>
        </SettingCard>

        <SettingCard title="Messages" description="Utilisez {user}, {server}, {count} comme variables." accent="gold">
          <Field label="Message de bienvenue">
            <Textarea rows={3} defaultValue="👋 Bienvenue {user} sur {server} ! Tu es notre {count}ᵉ membre." className="bg-card/60" />
          </Field>
          <Field label="Message de départ">
            <Textarea rows={3} defaultValue="😢 {user} vient de quitter le serveur." className="bg-card/60" />
          </Field>
        </SettingCard>

        <SettingCard title="Aperçu — bienvenue" description="Rendu live du message." accent="neon">
          <Preview kind="welcome" />
        </SettingCard>
        <SettingCard title="Aperçu — départ" description="Rendu live du message." accent="gold">
          <Preview kind="leave" />
        </SettingCard>
      </div>
    </>
  );
}

function Preview({ kind }: { kind: "welcome" | "leave" }) {
  return (
    <div className={`rounded-xl border ${kind === "welcome" ? "border-primary/30" : "border-gold/30"} bg-background/60 p-5`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${kind === "welcome" ? "bg-gradient-to-br from-primary to-gold" : "bg-gradient-to-br from-gold to-primary"} text-primary-foreground`}>
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">CIVRAT</div>
          <div className="text-xs text-muted-foreground">{kind === "welcome" ? "Nouveau membre" : "Membre parti"} · à l'instant</div>
        </div>
      </div>
      <p className="mt-4 text-sm">
        {kind === "welcome"
          ? <>👋 Bienvenue <span className="text-primary">@Lyra</span> sur <span className="text-primary">Cyber Lounge</span> ! Tu es notre <span className="text-gold">2,482ᵉ</span> membre.</>
          : <>😢 <span className="text-gold">@Nox</span> vient de quitter le serveur.</>}
      </p>
    </div>
  );
}
