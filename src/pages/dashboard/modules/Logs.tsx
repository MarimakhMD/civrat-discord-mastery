import { useState } from 'react';
import { FileText } from 'lucide-react';
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

const logEvents = [
  { id: 'member_join', label: 'Member Join' },
  { id: 'member_leave', label: 'Member Leave' },
  { id: 'message_delete', label: 'Message Delete' },
  { id: 'message_edit', label: 'Message Edit' },
  { id: 'role_add', label: 'Role Added' },
  { id: 'role_remove', label: 'Role Removed' },
  { id: 'channel_create', label: 'Channel Create' },
  { id: 'channel_delete', label: 'Channel Delete' },
  { id: 'ban_add', label: 'Ban Added' },
  { id: 'ban_remove', label: 'Ban Removed' },
];

export default function Logs() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.logs_enabled);
  const [logChannel, setLogChannel] = useState(config.logs_channel_id ?? '');
  const [enabledEvents, setEnabledEvents] = useState<string[]>(config.log_events);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        logs_enabled: enabled,
        logs_channel_id: logChannel || null,
        log_events: enabledEvents,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save logging settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.logs_enabled);
    setLogChannel(config.logs_channel_id ?? '');
    setEnabledEvents(config.log_events);
    setIsDirty(false);
  };

  const handleToggleEvent = (eventId: string) => {
    const updated = enabledEvents.includes(eventId)
      ? enabledEvents.filter((id) => id !== eventId)
      : [...enabledEvents, eventId];
    setEnabledEvents(updated);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={FileText}
        title="Logging System"
        description="Configure event logging and auditing"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Log Channel</h3>
            <FormField label="Channel">
              <Select
                options={channels}
                value={logChannel}
                onChange={(val) => {
                  setLogChannel(val);
                  setIsDirty(true);
                }}
                placeholder="Select log channel"
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Log Events</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {logEvents.map((event) => (
                <label key={event.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={enabledEvents.includes(event.id)}
                    onChange={() => handleToggleEvent(event.id)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm">{event.label}</span>
                </label>
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
