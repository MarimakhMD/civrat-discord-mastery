import { useState } from 'react';
import { Gift } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
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

const mockGiveaways = [
  { id: 1, prize: 'Nitro Classic', winners: 3, participants: 145, endsIn: '2 hours' },
  { id: 2, prize: 'Server Boost', winners: 1, participants: 92, endsIn: '5 hours' },
  { id: 3, prize: 'Custom Role', winners: 2, participants: 234, endsIn: '1 day' },
];

const mockHistory = [
  { id: 1, prize: 'Nitro', winners: 2, participants: 567, completedAt: '2 days ago' },
  { id: 2, prize: 'Discord App', winners: 1, participants: 432, completedAt: '1 week ago' },
  { id: 3, prize: 'Emote Pack', winners: 3, participants: 289, completedAt: '2 weeks ago' },
];

export default function Giveaways() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prize, setPrize] = useState('');
  const [winners, setWinners] = useState('1');
  const [duration, setDuration] = useState('24');
  const [channel, setChannel] = useState('');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        giveaways_enabled: true,
      });
      setPrize('');
      setWinners('1');
      setDuration('24');
      setChannel('');
      setIsDirty(false);
    } catch (err) {
      setError('Failed to create giveaway');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrize('');
    setWinners('1');
    setDuration('24');
    setChannel('');
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Gift}
        title="Giveaways"
        description="Manage server giveaways and rewards"
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Create Giveaway</h3>
          <div className="space-y-4">
            <FormField label="Prize">
              <input
                type="text"
                value={prize}
                onChange={(e) => {
                  setPrize(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="What are you giving away?"
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </FormField>

            <FormField label="Number of Winners">
              <input
                type="number"
                value={winners}
                onChange={(e) => {
                  setWinners(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
                min="1"
              />
            </FormField>

            <FormField label="Duration (hours)">
              <input
                type="number"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
                min="1"
              />
            </FormField>

            <FormField label="Channel">
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
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Active Giveaways</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left font-medium">Prize</th>
                  <th className="px-4 py-2 text-left font-medium">Winners</th>
                  <th className="px-4 py-2 text-left font-medium">Participants</th>
                  <th className="px-4 py-2 text-left font-medium">Ends In</th>
                </tr>
              </thead>
              <tbody>
                {mockGiveaways.map((giveaway) => (
                  <tr key={giveaway.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{giveaway.prize}</td>
                    <td className="px-4 py-2">{giveaway.winners}</td>
                    <td className="px-4 py-2">{giveaway.participants}</td>
                    <td className="px-4 py-2 text-slate-600">{giveaway.endsIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Giveaway History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left font-medium">Prize</th>
                  <th className="px-4 py-2 text-left font-medium">Winners</th>
                  <th className="px-4 py-2 text-left font-medium">Participants</th>
                  <th className="px-4 py-2 text-left font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{item.prize}</td>
                    <td className="px-4 py-2">{item.winners}</td>
                    <td className="px-4 py-2">{item.participants}</td>
                    <td className="px-4 py-2 text-slate-500">{item.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
