import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { Toggle } from '@/components/ui/Toggle';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

export default function Settings() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prefix, setPrefix] = useState(config.prefix);
  const [language, setLanguage] = useState(config.language);
  const [embedColor, setEmbedColor] = useState('#3b82f6');
  const [dmOnJoin, setDmOnJoin] = useState(false);
  const [botStatus, setBotStatus] = useState('online');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        prefix,
        language,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save global settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrefix(config.prefix);
    setLanguage(config.language);
    setEmbedColor('#3b82f6');
    setDmOnJoin(false);
    setBotStatus('online');
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={SettingsIcon}
        title="Global Settings"
        description="Configure core bot settings and preferences"
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Bot Configuration</h3>
          <div className="space-y-4">
            <FormField label="Command Prefix">
              <input
                type="text"
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="!"
                className="w-20 rounded border border-slate-300 px-3 py-2"
                maxLength={3}
              />
            </FormField>

            <FormField label="Language">
              <Select
                options={languages}
                value={language}
                onChange={(val) => {
                  setLanguage(val);
                  setIsDirty(true);
                }}
              />
            </FormField>

            <FormField label="Embed Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={embedColor}
                  onChange={(e) => {
                    setEmbedColor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 w-20 rounded border border-slate-300"
                />
                <code className="text-sm text-slate-600">{embedColor}</code>
              </div>
            </FormField>

            <FormField label="Bot Status">
              <Select
                options={[
                  { value: 'online', label: 'Online' },
                  { value: 'idle', label: 'Idle' },
                  { value: 'dnd', label: 'Do Not Disturb' },
                  { value: 'invisible', label: 'Invisible' },
                ]}
                value={botStatus}
                onChange={(val) => {
                  setBotStatus(val);
                  setIsDirty(true);
                }}
              />
            </FormField>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Features</h3>
          <label className="flex items-center gap-3">
            <Toggle
              checked={dmOnJoin}
              onChange={(checked) => {
                setDmOnJoin(checked);
                setIsDirty(true);
              }}
            />
            <span className="text-sm">Send DM when members join</span>
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Preview</h3>
          <div
            className="rounded p-4 text-white"
            style={{ backgroundColor: embedColor }}
          >
            <p className="font-bold">Example Embed</p>
            <p className="mt-2 text-sm">This is how embeds will appear in your server</p>
          </div>
        </div>
      </div>

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
