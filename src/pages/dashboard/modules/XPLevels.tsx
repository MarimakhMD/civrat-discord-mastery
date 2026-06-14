import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
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

const roles = [
  { value: 'r-1', label: '@Admin' },
  { value: 'r-2', label: '@Moderator' },
  { value: 'r-3', label: '@Member' },
  { value: 'r-4', label: '@Muted' },
];

const mockLeaderboard = [
  { rank: 1, user: 'Alex#1234', xp: 45230, level: 42 },
  { rank: 2, user: 'Jordan#5678', xp: 38950, level: 38 },
  { rank: 3, user: 'Sam#9012', xp: 32100, level: 35 },
  { rank: 4, user: 'Casey#3456', xp: 28750, level: 32 },
  { rank: 5, user: 'Morgan#7890', xp: 24600, level: 29 },
];

export default function XPLevels() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.xp_enabled);
  const [xpRate, setXpRate] = useState(config.xp_rate);
  const [cooldown, setCooldown] = useState(config.xp_cooldown);
  const [announceChannel, setAnnounceChannel] = useState(config.xp_announce_channel ?? '');
  const [levelRoles, setLevelRoles] = useState(config.level_roles);
  const [newLevel, setNewLevel] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        xp_enabled: enabled,
        xp_rate: xpRate,
        xp_cooldown: cooldown,
        xp_announce_channel: announceChannel || null,
        level_roles: levelRoles,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save XP/Levels settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.xp_enabled);
    setXpRate(config.xp_rate);
    setCooldown(config.xp_cooldown);
    setAnnounceChannel(config.xp_announce_channel ?? '');
    setLevelRoles(config.level_roles);
    setIsDirty(false);
  };

  const addLevelRole = () => {
    if (newLevel && newRole) {
      setLevelRoles([...levelRoles, { level: parseInt(newLevel), role_id: newRole }]);
      setNewLevel('');
      setNewRole('');
      setIsDirty(true);
    }
  };

  const removeLevelRole = (idx: number) => {
    setLevelRoles(levelRoles.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={TrendingUp}
        title="XP & Levels"
        description="Configure experience points and leveling system"
        toggleEnabled={enabled}
        onToggle={(checked) => {
          setEnabled(checked);
          setIsDirty(true);
        }}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">XP Settings</h3>
            <div className="space-y-4">
              <FormField label="XP Per Message">
                <input
                  type="number"
                  value={xpRate}
                  onChange={(e) => {
                    setXpRate(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
              </FormField>

              <FormField label="XP Cooldown (seconds)">
                <input
                  type="number"
                  value={cooldown}
                  onChange={(e) => {
                    setCooldown(parseInt(e.target.value));
                    setIsDirty(true);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  min="10"
                />
              </FormField>

              <FormField label="Level Announcement Channel">
                <Select
                  options={channels}
                  value={announceChannel}
                  onChange={(val) => {
                    setAnnounceChannel(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select channel"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Level Roles</h3>
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  placeholder="Level"
                  className="w-20 rounded border border-slate-300 px-3 py-2"
                  min="1"
                />
                <Select
                  options={roles}
                  value={newRole}
                  onChange={setNewRole}
                  placeholder="Select role"
                />
                <button
                  onClick={addLevelRole}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {levelRoles.map((lr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded bg-slate-100 px-3 py-2"
                  >
                    <span className="text-sm">
                      Level {lr.level} → {lr.role_id}
                    </span>
                    <button
                      onClick={() => removeLevelRole(idx)}
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
            <h3 className="mb-4 text-lg font-semibold">Leaderboard Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left font-medium">Rank</th>
                    <th className="px-4 py-2 text-left font-medium">User</th>
                    <th className="px-4 py-2 text-left font-medium">XP</th>
                    <th className="px-4 py-2 text-left font-medium">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium">#{entry.rank}</td>
                      <td className="px-4 py-2">{entry.user}</td>
                      <td className="px-4 py-2">{entry.xp.toLocaleString()}</td>
                      <td className="px-4 py-2">{entry.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
