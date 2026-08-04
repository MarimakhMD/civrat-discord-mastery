import { useMemo, useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';
import { useDiscordOptions } from '@/hooks/use-discord-options';

const logCategories = [
  { key: 'log_moderation_channel_id', title: 'Modération', description: 'Bannissements, sanctions, AutoMod et vérifications.', requires: 'logs' },
  { key: 'log_message_delete_channel_id', title: 'Messages supprimés', description: 'Suppressions simples et groupées.', requires: 'logs' },
  { key: 'log_message_edit_channel_id', title: 'Messages modifiés', description: 'Modifications de messages.', requires: 'logs' },
  { key: 'log_member_join_channel_id', title: 'Arrivées', description: 'Nouveaux membres.', requires: 'logs' },
  { key: 'log_member_leave_channel_id', title: 'Départs', description: 'Membres quittant le serveur.', requires: 'logs' },
  { key: 'invitations_log_channel_id', title: 'Invitations', description: 'Créations, suppressions et utilisations d’invitations.', requires: 'invitations' },
  { key: 'ticket_log_channel_id', title: 'Tickets', description: 'Créations, fermetures et transcripts.', requires: 'tickets' },
  { key: 'bot_log_channel_id', title: 'Bot', description: 'Actions appliquées par CIVRAT.', requires: 'bot' },
  { key: 'log_role_update_channel_id', title: 'Rôles', description: 'Créations, suppressions et modifications de rôles.', requires: 'logs' },
  { key: 'log_channel_update_channel_id', title: 'Salons', description: 'Créations, suppressions et modifications de salons.', requires: 'logs' },
] as const;
type LogKey = typeof logCategories[number]['key'];
type LogSelections = Record<LogKey, string>;

function selectionsFromConfig(config: Record<LogKey, string | null>): LogSelections {
  return Object.fromEntries(logCategories.map(({ key }) => [key, config[key] ?? ''])) as LogSelections;
}

export default function Logs() {
  const { config, updateConfig } = useGuild();
  const { textChannels: channels } = useDiscordOptions();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(config.logs_enabled);
  const [selections, setSelections] = useState<LogSelections>(() => selectionsFromConfig(config));

  const configuredCount = useMemo(() => Object.values(selections).filter(Boolean).length, [selections]);
  const valid = !enabled || configuredCount > 0;
  const changeChannel = (key: LogKey, value: string) => {
    setSelections((current) => ({ ...current, [key]: value }));
    setIsDirty(true);
  };
  const reset = () => {
    setEnabled(config.logs_enabled);
    setSelections(selectionsFromConfig(config));
    setError(null);
    setIsDirty(false);
  };
  const save = async () => {
    if (!valid || isSaving) return;
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({ logs_enabled: enabled, ...Object.fromEntries(logCategories.map(({ key }) => [key, selections[key] || null])) });
      setIsDirty(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer la configuration des logs.');
    } finally {
      setIsSaving(false);
    }
  };

  return <div className="space-y-6">
    <ModuleHeader icon={FileText} title="Centre de journalisation" description="Configurez un salon texte indépendant pour chaque catégorie d’événement." toggleEnabled={enabled} onToggle={(value) => { setEnabled(value); setIsDirty(true); }} />
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat value={`${configuredCount}/10`} label="Catégories configurées" />
      <Stat value={enabled ? 'Actif' : 'Désactivé'} label="Journalisation" />
      <Stat value={valid ? 'Prêt' : 'À compléter'} label="État de la configuration" />
    </div>
    <div className="module-card !cursor-default">
      <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" /><div><h2 className="font-bold">Salons de journalisation</h2><p className="mt-1 text-sm text-dark-300">Les salons sont enregistrés séparément. Seuls les salons texte accessibles au bot sont proposés.</p></div></div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {logCategories.map(({ key, title, description, requires }) => <div key={key} className="rounded-xl border border-white/8 bg-dark-700/45 p-4">
          <FormField label={title}><Select options={channels} value={selections[key]} onChange={(value) => changeChannel(key, value)} placeholder="Choisir un salon texte" /></FormField>
          <p className="mt-2 text-xs leading-5 text-dark-300">{description}</p>
          {requires === 'invitations' && !config.invitations_enabled && <p className="mt-2 text-xs text-neon-yellow">Activez aussi les Invitations pour recevoir ces logs.</p>}
          {requires === 'tickets' && !config.tickets_enabled && <p className="mt-2 text-xs text-neon-yellow">Activez aussi les Tickets pour recevoir ces logs.</p>}
        </div>)}
      </div>
      {enabled && !valid && <p className="mt-5 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">Configurez au moins un salon de journalisation avant d’activer les logs.</p>}
    </div>
    <SaveBar isDirty={isDirty} isSaving={isSaving} saveDisabled={!valid} onSave={save} onReset={reset} error={error} />
  </div>;
}
function Stat({ value, label }: { value: string; label: string }) { return <div className="module-card !cursor-default"><strong className="text-2xl text-neon-green">{value}</strong><p className="mt-1 text-sm text-dark-300">{label}</p></div>; }
