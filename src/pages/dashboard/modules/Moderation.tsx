import { useState } from 'react';
import { Gavel } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { FormField } from '@/components/ui/FormField';
import { useGuild } from '@/context/GuildContext';

const mockActions = [
  {
    id: 1,
    user: 'Spammer#1234',
    action: 'mute',
    moderator: 'Mod#5678',
    reason: 'Spam in general',
    timestamp: '1 hour ago',
  },
  {
    id: 2,
    user: 'Rude#9012',
    action: 'warn',
    moderator: 'Mod#5678',
    reason: 'Disrespectful behavior',
    timestamp: '3 hours ago',
  },
  {
    id: 3,
    user: 'BadActor#3456',
    action: 'ban',
    moderator: 'Admin#7890',
    reason: 'Repeated violations',
    timestamp: '1 day ago',
  },
  {
    id: 4,
    user: 'Warning#2345',
    action: 'warn',
    moderator: 'Mod#5678',
    reason: 'First offense',
    timestamp: '2 days ago',
  },
  {
    id: 5,
    user: 'Kicked#6789',
    action: 'kick',
    moderator: 'Mod#5678',
    reason: 'Trolling',
    timestamp: '3 days ago',
  },
];

const getActionColor = (action: string) => {
  switch (action) {
    case 'ban':
      return 'bg-red-100 text-red-800';
    case 'kick':
      return 'bg-orange-100 text-orange-800';
    case 'mute':
      return 'bg-yellow-100 text-yellow-800';
    case 'warn':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export default function Moderation() {
  const { config } = useGuild();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredActions = mockActions.filter((action) => {
    const matchesSearch =
      action.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || action.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Gavel}
        title="Moderation History"
        description="View and manage moderation actions"
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Search & Filter</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Search User or Reason">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </FormField>

            <FormField label="Action Type">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="all">All Actions</option>
                <option value="warn">Warn</option>
                <option value="mute">Mute</option>
                <option value="kick">Kick</option>
                <option value="ban">Ban</option>
              </select>
            </FormField>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Moderation History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left font-medium">User</th>
                  <th className="px-4 py-2 text-left font-medium">Action</th>
                  <th className="px-4 py-2 text-left font-medium">Moderator</th>
                  <th className="px-4 py-2 text-left font-medium">Reason</th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map((action) => (
                  <tr key={action.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{action.user}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium capitalize ${getActionColor(action.action)}`}
                      >
                        {action.action}
                      </span>
                    </td>
                    <td className="px-4 py-2">{action.moderator}</td>
                    <td className="px-4 py-2 text-slate-600">{action.reason}</td>
                    <td className="px-4 py-2 text-slate-500">{action.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredActions.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              No moderation actions found matching your search.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-200 p-4">
              <label className="block text-sm font-medium mb-2">Lookup User</label>
              <input
                type="text"
                placeholder="Username#0000"
                className="w-full rounded border border-slate-300 px-3 py-2 mb-2"
              />
              <button className="w-full rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                Search
              </button>
            </div>

            <div className="rounded border border-slate-200 p-4">
              <label className="block text-sm font-medium mb-2">Mass Action</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2 mb-2">
                <option>Select action</option>
                <option>Warn All</option>
                <option>Mute All</option>
                <option>Kick All</option>
              </select>
              <button className="w-full rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">
                Execute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
