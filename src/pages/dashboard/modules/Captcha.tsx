import { useState } from 'react';
import { Lock } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';
import { useDiscordOptions } from '@/hooks/use-discord-options';


export default function Captcha() {
  const { config, updateConfig } = useGuild();
  const { textChannels: channels, roles } = useDiscordOptions();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.captcha_enabled);
  const [channel, setChannel] = useState(config.captcha_channel_id ?? '');
  const [role, setRole] = useState(config.captcha_role_id ?? '');
  const [type, setType] = useState(config.captcha_type);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeout, setTimeout_] = useState(300);
  const [failureAction, setFailureAction] = useState('kick');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        captcha_enabled: enabled,
        captcha_channel_id: channel || null,
        captcha_role_id: role || null,
        captcha_type: type,
      });
      setIsDirty(false);
    } catch {
      setError('Failed to save captcha settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.captcha_enabled);
    setChannel(config.captcha_channel_id ?? '');
    setRole(config.captcha_role_id ?? '');
    setType(config.captcha_type);
    setDifficulty('medium');
    setTimeout_(300);
    setFailureAction('kick');
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Lock}
        title="Captcha Verification"
        description="Require captcha verification for new members"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="module-card !cursor-default p-6">
            <h3 className="mb-4 text-lg font-semibold">Verification Settings</h3>
            <div className="space-y-4">
              <FormField label="Verification Channel">
                <Select
                  options={channels}
                  value={channel}
                  onChange={(val) => {
                    setChannel(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select channel"
                />
              </FormField>

              <FormField label="Verified Role">
                <Select
                  options={roles}
                  value={role}
                  onChange={(val) => {
                    setRole(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select role"
                />
              </FormField>

              <FormField label="Captcha Type">
                <Select
                  options={[
                    { value: 'image', label: 'Image' },
                    { value: 'math', label: 'Math' },
                    { value: 'button', label: 'Button' },
                  ]}
                  value={type}
                  onChange={(val) => {
                    setType(val);
                    setIsDirty(true);
                  }}
                />
              </FormField>

              <FormField label="Difficulty">
                <Select
                  options={[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                  ]}
                  value={difficulty}
                  onChange={(val) => {
                    setDifficulty(val);
                    setIsDirty(true);
                  }}
                />
              </FormField>

              <FormField label="Timeout (seconds)">
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => {
                    setTimeout_(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="30"
                  step="30"
                />
              </FormField>

              <FormField label="Failure Action">
                <Select
                  options={[
                    { value: 'kick', label: 'Kick' },
                    { value: 'ban', label: 'Ban' },
                    { value: 'mute', label: 'Mute' },
                  ]}
                  value={failureAction}
                  onChange={(val) => {
                    setFailureAction(val);
                    setIsDirty(true);
                  }}
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
