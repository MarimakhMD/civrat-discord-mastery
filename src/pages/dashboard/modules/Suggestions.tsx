import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
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

const mockSuggestions = [
  { id: 1, user: 'Alex#1234', text: 'Add a music bot', status: 'pending', votes: 24 },
  { id: 2, user: 'Jordan#5678', text: 'Weekly giveaways', status: 'pending', votes: 18 },
  { id: 3, user: 'Sam#9012', text: 'Movie nights', status: 'approved', votes: 42 },
  { id: 4, user: 'Casey#3456', text: 'Spam filter', status: 'denied', votes: 5 },
];

export default function Suggestions() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.suggestions_enabled);
  const [channel, setChannel] = useState(config.suggestions_channel_id ?? '');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSuggestions = mockSuggestions.filter(
    (s) => filterStatus === 'all' || s.status === filterStatus
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        suggestions_enabled: enabled,
        suggestions_channel_id: channel || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save suggestion settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.suggestions_enabled);
    setChannel(config.suggestions_channel_id ?? '');
    setIsDirty(false);
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Lightbulb}
        title="Suggestions System"
        description="Allow members to submit and vote on suggestions"
        toggleEnabled={enabled}
        onToggle={handleToggle}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Configuration</h3>
            <FormField label="Suggestions Channel">
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

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Suggestions</h3>

            <div className="mb-4 flex gap-2">
              {['all', 'pending', 'approved', 'denied'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded px-3 py-1 text-sm font-medium capitalize ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="rounded border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.text}</p>
                      <p className="mt-1 text-sm text-slate-500">by {suggestion.user}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium capitalize ${
                          suggestion.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : suggestion.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {suggestion.status}
                      </span>
                      <span className="text-sm font-medium">{suggestion.votes} votes</span>
                    </div>
                  </div>

                  {suggestion.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
                        Approve
                      </button>
                      <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                        Deny
                      </button>
                    </div>
                  )}
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
