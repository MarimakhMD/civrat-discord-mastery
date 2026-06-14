import { useState } from 'react';
import { Mic } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { Toggle } from '@/components/ui/Toggle';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';

const mockChannels = [
  { id: 1, name: 'Temp Voice #1', users: 3, createdBy: 'Alex#1234' },
  { id: 2, name: 'Temp Voice #2', users: 5, createdBy: 'Jordan#5678' },
  { id: 3, name: 'Temp Voice #3', users: 2, createdBy: 'Sam#9012' },
];

export default function TempVoice() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.temp_voice_enabled);
  const [category, setCategory] = useState(config.temp_voice_category ?? '');
  const [nameTemplate, setNameTemplate] = useState('{user}\'s Voice');
  const [maxChannels, setMaxChannels] = useState(10);
  const [autoDelete, setAutoDelete] = useState(true);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        temp_voice_enabled: enabled,
        temp_voice_category: category || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save temp voice settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.temp_voice_enabled);
    setCategory(config.temp_voice_category ?? '');
    setNameTemplate('{user}\'s Voice');
    setMaxChannels(10);
    setAutoDelete(true);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Mic}
        title="Temporary Voice Channels"
        description="Allow members to create temporary voice channels"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Configuration</h3>
            <div className="space-y-4">
              <FormField label="Voice Category">
                <Select
                  options={[
                    { value: 'cat-1', label: 'Voice Channels' },
                    { value: 'cat-2', label: 'Temporary' },
                    { value: 'cat-3', label: 'General' },
                  ]}
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select category"
                />
              </FormField>

              <FormField label="Channel Name Template">
                <input
                  type="text"
                  value={nameTemplate}
                  onChange={(e) => {
                    setNameTemplate(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="{user}'s Voice"
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-xs text-slate-500">Use {'{user}'} for username</p>
              </FormField>

              <FormField label="Max Channels">
                <input
                  type="number"
                  value={maxChannels}
                  onChange={(e) => {
                    setMaxChannels(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <label className="flex items-center gap-3">
                <Toggle
                  checked={autoDelete}
                  onChange={(checked) => {
                    setAutoDelete(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Auto-delete empty channels</span>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Active Channels</h3>
            <div className="space-y-2">
              {mockChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between rounded border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    <p className="text-sm text-slate-600">Created by {channel.createdBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{channel.users} users</p>
                  </div>
                </div>
              ))}
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
