import { useState } from 'react';
import { Shield } from 'lucide-react';
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

const mockSecurityEvents = [
  { id: 1, type: 'Raid Detected', user: 'Unknown', time: '2 minutes ago', severity: 'high' },
  { id: 2, type: 'Mass Ban Attempt', user: 'Hacker#0001', time: '1 hour ago', severity: 'critical' },
  { id: 3, type: 'Token Leak', time: '3 hours ago', severity: 'high' },
];

export default function Security() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.security_enabled);
  const [antiRaid, setAntiRaid] = useState(config.security_anti_raid);
  const [antiNuke, setAntiNuke] = useState(config.security_anti_nuke);
  const [quarantineRole, setQuarantineRole] = useState(config.security_quarantine_role ?? '');
  const [whitelistRoles, setWhitelistRoles] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        security_enabled: enabled,
        security_anti_raid: antiRaid,
        security_anti_nuke: antiNuke,
        security_quarantine_role: quarantineRole || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.security_enabled);
    setAntiRaid(config.security_anti_raid);
    setAntiNuke(config.security_anti_nuke);
    setQuarantineRole(config.security_quarantine_role ?? '');
    setWhitelistRoles([]);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Shield}
        title="Security Settings"
        description="Configure server security and threat protection"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Threat Protection</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <Toggle
                  checked={antiRaid}
                  onChange={(checked) => {
                    setAntiRaid(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Anti-Raid</span>
              </label>
              <label className="flex items-center gap-3">
                <Toggle
                  checked={antiNuke}
                  onChange={(checked) => {
                    setAntiNuke(checked);
                    setIsDirty(true);
                  }}
                />
                <span className="text-sm">Anti-Nuke</span>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Quarantine</h3>
            <FormField label="Quarantine Role">
              <Select
                options={roles}
                value={quarantineRole}
                onChange={(val) => {
                  setQuarantineRole(val);
                  setIsDirty(true);
                }}
                placeholder="Select role"
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Whitelist Roles</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role.value} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={whitelistRoles.includes(role.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWhitelistRoles([...whitelistRoles, role.value]);
                      } else {
                        setWhitelistRoles(whitelistRoles.filter((r) => r !== role.value));
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
            <h3 className="mb-4 text-lg font-semibold">Recent Security Events</h3>
            <div className="space-y-2">
              {mockSecurityEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded border-l-4 border-red-600 bg-red-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{event.type}</p>
                    <p className="text-sm text-slate-600">{event.time}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      event.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-orange-200 text-orange-800'
                    }`}
                  >
                    {event.severity}
                  </span>
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
