import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { Toggle } from '@/components/ui/Toggle';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';

const roles = [
  { value: 'r-1', label: '@Admin' },
  { value: 'r-2', label: '@Moderator' },
  { value: 'r-3', label: '@Member' },
  { value: 'r-4', label: '@Muted' },
];

export default function AutoMod() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.automod_enabled);
  const [maxMentions, setMaxMentions] = useState(config.automod_max_mentions);
  const [maxEmojis, setMaxEmojis] = useState(config.automod_max_emojis);
  const [antiSpam, setAntiSpam] = useState(config.automod_anti_spam);
  const [antiInvite, setAntiInvite] = useState(config.automod_anti_invite);
  const [antiLink, setAntiLink] = useState(config.automod_anti_link);
  const [badWordsList, setBadWordsList] = useState<string[]>(config.automod_bad_words);
  const [newBadWord, setNewBadWord] = useState('');
  const [punishment, setPunishment] = useState('warn');
  const [exemptRoles, setExemptRoles] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        automod_enabled: enabled,
        automod_max_mentions: maxMentions,
        automod_max_emojis: maxEmojis,
        automod_anti_spam: antiSpam,
        automod_anti_invite: antiInvite,
        automod_anti_link: antiLink,
        automod_bad_words: badWordsList,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save automod settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.automod_enabled);
    setMaxMentions(config.automod_max_mentions);
    setMaxEmojis(config.automod_max_emojis);
    setAntiSpam(config.automod_anti_spam);
    setAntiInvite(config.automod_anti_invite);
    setAntiLink(config.automod_anti_link);
    setBadWordsList(config.automod_bad_words);
    setPunishment('warn');
    setExemptRoles([]);
    setIsDirty(false);
  };

  const addBadWord = () => {
    if (newBadWord.trim()) {
      setBadWordsList([...badWordsList, newBadWord.trim()]);
      setNewBadWord('');
      setIsDirty(true);
    }
  };

  const removeBadWord = (word: string) => {
    setBadWordsList(badWordsList.filter((w) => w !== word));
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={ShieldAlert}
        title="Auto Moderation"
        description="Automatic content moderation settings"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Limits</h3>
            <div className="space-y-4">
              <FormField label="Max Mentions per Message">
                <input
                  type="number"
                  value={maxMentions}
                  onChange={(e) => {
                    setMaxMentions(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <FormField label="Max Emojis per Message">
                <input
                  type="number"
                  value={maxEmojis}
                  onChange={(e) => {
                    setMaxEmojis(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <Toggle
                  checked={antiSpam}
                  onChange={(checked) => {
                    setAntiSpam(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Anti-Spam</span>
              </label>
              <label className="flex items-center gap-3">
                <Toggle
                  checked={antiInvite}
                  onChange={(checked) => {
                    setAntiInvite(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Anti-Invite</span>
              </label>
              <label className="flex items-center gap-3">
                <Toggle
                  checked={antiLink}
                  onChange={(checked) => {
                    setAntiLink(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Anti-Link</span>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Bad Words</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBadWord}
                  onChange={(e) => setNewBadWord(e.target.value)}
                  placeholder="Add a bad word..."
                  className="flex-1 rounded border border-slate-300 px-3 py-2"
                  onKeyDown={(e) => e.key === 'Enter' && addBadWord()}
                />
                <button
                  onClick={addBadWord}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {badWordsList.map((word) => (
                  <div
                    key={word}
                    className="flex items-center gap-2 rounded bg-slate-100 px-3 py-1"
                  >
                    <span className="text-sm">{word}</span>
                    <button
                      onClick={() => removeBadWord(word)}
                      className="text-red-600 hover:text-red-700"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Settings</h3>
            <div className="space-y-4">
              <FormField label="Punishment Action">
                <Select
                  options={[
                    { value: 'warn', label: 'Warning' },
                    { value: 'mute', label: 'Mute' },
                    { value: 'kick', label: 'Kick' },
                  ]}
                  value={punishment}
                  onChange={(val) => {
                    setPunishment(val);
                    setIsDirty(true);
                  }}
                />
              </FormField>

              <FormField label="Exempt Roles">
                <Select
                  options={roles}
                  value={exemptRoles.join(',')}
                  onChange={(val) => {
                    setExemptRoles(val ? [val] : []);
                    setIsDirty(true);
                  }}
                  placeholder="Select exempt roles"
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
        error={error}
      />
    </div>
  );
}
