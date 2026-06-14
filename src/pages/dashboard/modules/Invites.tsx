import { useState } from 'react';
import { Link } from 'lucide-react';
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

const mockLeaderboard = [
  { rank: 1, user: 'Alex#1234', invites: 45 },
  { rank: 2, user: 'Jordan#5678', invites: 32 },
  { rank: 3, user: 'Sam#9012', invites: 28 },
  { rank: 4, user: 'Casey#3456', invites: 19 },
  { rank: 5, user: 'Morgan#7890', invites: 12 },
];

const mockHistory = [
  { id: 1, user: 'Riley#2345', inviter: 'Alex#1234', time: '5 minutes ago', action: 'join' },
  { id: 2, user: 'Bailey#6789', inviter: 'Jordan#5678', time: '1 hour ago', action: 'join' },
  { id: 3, user: 'Avery#0123', inviter: 'Sam#9012', time: '3 hours ago', action: 'left' },
  { id: 4, user: 'Quinn#4567', inviter: 'Casey#3456', time: '1 day ago', action: 'join' },
];

export default function Invites() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.invtrack_enabled);
  const [logChannel, setLogChannel] = useState(config.invtrack_channel ?? '');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        invtrack_enabled: enabled,
        invtrack_channel: logChannel || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save invite settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.invtrack_enabled);
    setLogChannel(config.invtrack_channel ?? '');
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Link}
        title="Invite Tracking"
        description="Track and reward members for inviting others"
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
            <FormField label="Log Channel">
              <Select
                options={channels}
                value={logChannel}
                onChange={(val) => {
                  setLogChannel(val);
                  setIsDirty(true);
                }}
                placeholder="Select channel"
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Invite Leaderboard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left font-medium">Rank</th>
                    <th className="px-4 py-2 text-left font-medium">User</th>
                    <th className="px-4 py-2 text-left font-medium">Invites</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium">#{entry.rank}</td>
                      <td className="px-4 py-2">{entry.user}</td>
                      <td className="px-4 py-2 text-blue-600 font-medium">{entry.invites}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Reward Tiers</h3>
            <div className="space-y-2">
              {[
                { tier: 'Tier 1', invites: '5 invites', reward: '@Friend' },
                { tier: 'Tier 2', invites: '10 invites', reward: '@Helper' },
                { tier: 'Tier 3', invites: '25 invites', reward: '@Contributor' },
                { tier: 'Tier 4', invites: '50 invites', reward: '@Elite' },
              ].map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between rounded bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium">{tier.tier}</p>
                    <p className="text-sm text-slate-600">{tier.invites}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{tier.reward}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-2">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.user}</p>
                    <p className="text-xs text-slate-500">invited by {item.inviter}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{item.time}</p>
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      item.action === 'join' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.action}
                    </span>
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
