import { useState } from 'react';
import { Ticket } from 'lucide-react';
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

const mockTickets = [
  { id: 1, user: 'Alex#1234', subject: 'Unable to verify', status: 'open', created: '2 hours ago' },
  { id: 2, user: 'Jordan#5678', subject: 'Role request', status: 'open', created: '1 day ago' },
  { id: 3, user: 'Sam#9012', subject: 'Ban appeal', status: 'pending', created: '3 days ago' },
  { id: 4, user: 'Casey#3456', subject: 'Question about rules', status: 'resolved', created: '1 week ago' },
];

export default function Tickets() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(config.tickets_enabled);
  const [category, setCategory] = useState(config.tickets_category_id ?? '');
  const [supportRole, setSupportRole] = useState(config.tickets_support_role_id ?? '');
  const [transcriptChannel, setTranscriptChannel] = useState(config.tickets_transcript_channel ?? '');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({
        tickets_enabled: enabled,
        tickets_category_id: category || null,
        tickets_support_role_id: supportRole || null,
        tickets_transcript_channel: transcriptChannel || null,
      });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save ticket settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(config.tickets_enabled);
    setCategory(config.tickets_category_id ?? '');
    setSupportRole(config.tickets_support_role_id ?? '');
    setTranscriptChannel(config.tickets_transcript_channel ?? '');
    setIsDirty(false);
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Ticket}
        title="Tickets System"
        description="Configure support ticket system"
        toggleEnabled={enabled}
        onToggle={handleToggle}
      />

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Configuration</h3>
            <div className="space-y-4">
              <FormField label="Ticket Category">
                <Select
                  options={[
                    { value: 'cat-1', label: 'Support' },
                    { value: 'cat-2', label: 'Reports' },
                    { value: 'cat-3', label: 'Appeals' },
                  ]}
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select category"
                />
              </FormField>

              <FormField label="Support Role">
                <Select
                  options={roles}
                  value={supportRole}
                  onChange={(val) => {
                    setSupportRole(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select role"
                />
              </FormField>

              <FormField label="Transcript Channel">
                <Select
                  options={channels}
                  value={transcriptChannel}
                  onChange={(val) => {
                    setTranscriptChannel(val);
                    setIsDirty(true);
                  }}
                  placeholder="Select channel"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Active Tickets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left font-medium">User</th>
                    <th className="px-4 py-2 text-left font-medium">Subject</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">{ticket.user}</td>
                      <td className="px-4 py-2">{ticket.subject}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                            ticket.status === 'open'
                              ? 'bg-blue-100 text-blue-800'
                              : ticket.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-500">{ticket.created}</td>
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
