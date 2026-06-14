import { useState } from 'react';
import { TriangleAlert as AlertTriangle } from 'lucide-react';
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

const mockAttempts = [
  { id: 1, type: 'Channel Delete', count: 12, user: 'Hacker#0001', timestamp: '2 hours ago' },
  { id: 2, type: 'Role Delete', count: 8, user: 'Malicious#1234', timestamp: '5 hours ago' },
  { id: 3, type: 'Ban Spam', count: 45, user: 'Bot#5678', timestamp: '1 day ago' },
];

export default function AntiNuke() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.security_anti_nuke);
  const [channelThreshold, setChannelThreshold] = useState(5);
  const [roleThreshold, setRoleThreshold] = useState(5);
  const [banThreshold, setBanThreshold] = useState(10);
  const [webhookThreshold, setWebhookThreshold] = useState(3);
  const [punishment, setPunishment] = useState('ban');
  const [trustedRoles, setTrustedRoles] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        security_anti_nuke: enabled,
        security_enabled: true,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save anti-nuke settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.security_anti_nuke);
    setChannelThreshold(5);
    setRoleThreshold(5);
    setBanThreshold(10);
    setWebhookThreshold(3);
    setPunishment('ban');
    setTrustedRoles([]);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={AlertTriangle}
        title="Anti-Nuke"
        description="Protect your server from nuke attempts"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Action Thresholds</h3>
            <div className="space-y-4">
              <FormField label="Channel Delete Threshold">
                <input
                  type="number"
                  value={channelThreshold}
                  onChange={(e) => {
                    setChannelThreshold(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <FormField label="Role Delete Threshold">
                <input
                  type="number"
                  value={roleThreshold}
                  onChange={(e) => {
                    setRoleThreshold(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <FormField label="Ban Spam Threshold">
                <input
                  type="number"
                  value={banThreshold}
                  onChange={(e) => {
                    setBanThreshold(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <FormField label="Webhook Threshold">
                <input
                  type="number"
                  value={webhookThreshold}
                  onChange={(e) => {
                    setWebhookThreshold(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Punishment</h3>
            <FormField label="Action on Threshold">
              <Select
                options={[
                  { value: 'warn', label: 'Warning' },
                  { value: 'kick', label: 'Kick' },
                  { value: 'ban', label: 'Ban' },
                  { value: 'mute', label: 'Mute' },
                ]}
                value={punishment}
                onChange={(val) => {
                  setPunishment(val);
                  setIsDirty(true);
                }}
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Trusted Roles</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role.value} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={trustedRoles.includes(role.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTrustedRoles([...trustedRoles, role.value]);
                      } else {
                        setTrustedRoles(trustedRoles.filter((r) => r !== role.value));
                      }
                      setIsDirty(true);
                    }}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Recent Attempts</h3>
            <div className="space-y-2">
              {mockAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded border-l-4 border-red-600 bg-red-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{attempt.type}</p>
                    <p className="text-sm text-slate-600">{attempt.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{attempt.count}</p>
                    <p className="text-xs text-slate-500">{attempt.timestamp}</p>
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
