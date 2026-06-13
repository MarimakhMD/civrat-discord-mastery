import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/civrat/PageHeader";
import { SettingCard } from "@/components/civrat/SettingCard";
import { Button } from "@/components/ui/button";
import { Globe, Save } from "lucide-react";
import { useGuildConfig } from "@/lib/use-guild-config";

export const Route = createFileRoute("/dashboard/languages")({
  head: () => ({ meta: [{ title: "Langues — CIVRAT" }] }),
  component: LanguagesPage,
});

function LanguagesPage() {
  const { config, setConfig, saving, handleSave } = useGuildConfig();
  const selected = config.language ?? "en";

  const examples: Record<string, string[]> = {
    en: [
      "Welcome to the server!",
      "Your ticket has been created",
      "You have been warned",
      "Suggestion submitted successfully",
    ],
    fr: [
      "Bienvenue sur le serveur !",
      "Votre ticket a été créé",
      "Vous avez reçu un avertissement",
      "Suggestion soumise avec succès",
    ],
  };

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Langue"
        description="Choisissez la langue des réponses du bot."
        actions={<Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"><Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { code: "en" as const, flag: "\u{1F1EC}\u{1F1E7}", name: "English", desc: "Use English for bot messages" },
          { code: "fr" as const, flag: "\u{1F1EB}\u{1F1F7}", name: "Fran\u00e7ais", desc: "Utiliser le fran\u00e7ais pour les messages du bot" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => setConfig({ language: lang.code })}
            className={`rounded-2xl p-6 text-left transition-all ${selected === lang.code ? "glass border-primary/40 shadow-neon" : "glass hover:border-primary/20"}`}
          >
            <div className="text-4xl mb-3">{lang.flag}</div>
            <h3 className="font-display text-lg font-semibold">{lang.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{lang.desc}</p>
            {selected === lang.code && (
              <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                Active
              </div>
            )}
          </button>
        ))}
      </div>

      <SettingCard title="Aperçu des messages" description="Exemples de réponses du bot dans la langue sélectionnée." accent="neon" className="mt-5">
        <div className="space-y-2">
          {(examples[selected] ?? examples.en).map((msg, i) => (
            <div key={i} className="rounded-lg border border-border/40 bg-background/40 p-3 text-sm">
              {msg}
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}
