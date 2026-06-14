import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { Toggle } from '@/components/ui/Toggle';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';

const channels = [
  { value: 'ch-1', label: '#general' },
  { value: 'ch-2', label: '#welcome' },
  { value: 'ch-3', label: '#logs' },
  { value: 'ch-4', label: '#moderation' },
];

export default function Welcome() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [welcomeEnabled, setWelcomeEnabled] = useState(config.welcome_enabled);
  const [goodbyeEnabled, setGoodbyeEnabled] = useState(config.goodbye_enabled);
  const [welcomeChannel, setWelcomeChannel] = useState(config.welcome_channel_id ?? '');
  const [goodbyeChannel, setGoodbyeChannel] = useState(config.goodbye_channel_id ?? '');
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcome_message ?? '');
  const [goodbyeMessage, setGoodbyeMessage] = useState(config.goodbye_message ?? '');

  const handleWelcomeToggle = (checked: boolean) => {
    setWelcomeEnabled(checked);
    setIsDirty(true);
  };

  const handleGoodbyeToggle = (checked: boolean) => {
    setGoodbyeEnabled(checked);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        welcome_enabled: welcomeEnabled,
        welcome_channel_id: welcomeChannel || null,
        welcome_message: welcomeMessage || null,
        goodbye_enabled: goodbyeEnabled,
        goodbye_channel_id: goodbyeChannel || null,
        goodbye_message: goodbyeMessage || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save welcome settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setWelcomeEnabled(config.welcome_enabled);
    setGoodbyeEnabled(config.goodbye_enabled);
    setWelcomeChannel(config.welcome_channel_id ?? '');
    setGoodbyeChannel(config.goodbye_channel_id ?? '');
    setWelcomeMessage(config.welcome_message ?? '');
    setGoodbyeMessage(config.goodbye_message ?? '');
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={LogIn}
        title="Welcome & Goodbye"
        description="Configure welcome and goodbye messages for members"
        toggleEnabled={welcomeEnabled || goodbyeEnabled}
        onToggle={() => {}}
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Welcome Message</h3>
            <Toggle checked={welcomeEnabled} onChange={handleWelcomeToggle} />
          </div>

          {welcomeEnabled && (
            <div className="space-y-4">
              <FormField label="Welcome Channel">
                <Select
                  options={channels}
                  value={welcomeChannel}
                  onChange={(val) => {
                    setWelcomeChannel(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select channel"
                />
              </FormField>

              <FormField label="Welcome Message">
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => {
                    setWelcomeMessage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Welcome message text..."
                  className="h-24 w-full rounded border border-slate-300 p-2"
                />
              </FormField>

              <div className="rounded bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-700">Preview</p>
                <p className="mt-2 text-sm">{welcomeMessage || 'No message set'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Goodbye Message</h3>
            <Toggle checked={goodbyeEnabled} onChange={handleGoodbyeToggle} />
          </div>

          {goodbyeEnabled && (
            <div className="space-y-4">
              <FormField label="Goodbye Channel">
                <Select
                  options={channels}
                  value={goodbyeChannel}
                  onChange={(val) => {
                    setGoodbyeChannel(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select channel"
                />
              </FormField>

              <FormField label="Goodbye Message">
                <textarea
                  value={goodbyeMessage}
                  onChange={(e) => {
                    setGoodbyeMessage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Goodbye message text..."
                  className="h-24 w-full rounded border border-slate-300 p-2"
                />
              </FormField>

              <div className="rounded bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-700">Preview</p>
                <p className="mt-2 text-sm">{goodbyeMessage || 'No message set'}</p>
              </div>
            </div>
          )}
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
