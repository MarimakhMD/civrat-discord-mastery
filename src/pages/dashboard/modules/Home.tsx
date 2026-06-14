import { Activity, Users, MessageSquare, Ticket } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

const mockActivityFeed = [
  { id: 1, type: 'member_join', user: 'Alex#1234', time: '2 minutes ago' },
  { id: 2, type: 'message', user: 'Jordan#5678', time: '5 minutes ago' },
  { id: 3, type: 'ticket_created', user: 'Sam#9012', time: '10 minutes ago' },
  { id: 4, type: 'member_join', user: 'Casey#3456', time: '15 minutes ago' },
  { id: 5, type: 'role_added', user: 'Morgan#7890', time: '20 minutes ago' },
  { id: 6, type: 'message', user: 'Riley#2345', time: '25 minutes ago' },
  { id: 7, type: 'ticket_resolved', user: 'Bailey#6789', time: '30 minutes ago' },
  { id: 8, type: 'member_join', user: 'Avery#0123', time: '35 minutes ago' },
  { id: 9, type: 'warning', user: 'Quinn#4567', time: '40 minutes ago' },
  { id: 10, type: 'message', user: 'Taylor#8901', time: '45 minutes ago' },
];

const quickActions = [
  { label: 'Ban User', color: 'bg-red-600' },
  { label: 'Kick User', color: 'bg-orange-600' },
  { label: 'Add Role', color: 'bg-blue-600' },
  { label: 'Create Ticket', color: 'bg-green-600' },
];

const moduleStatus = [
  { name: 'Welcome', enabled: true },
  { name: 'Tickets', enabled: true },
  { name: 'Logs', enabled: false },
  { name: 'AutoMod', enabled: true },
  { name: 'XP Levels', enabled: true },
  { name: 'Captcha', enabled: false },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="mt-2 text-blue-100">Your server is running smoothly. Keep it up!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Members" value="2,543" trend={{ value: 12, isPositive: true }} />
        <StatCard icon={Activity} label="Online" value="348" trend={{ value: 8, isPositive: true }} />
        <StatCard icon={MessageSquare} label="Messages" value="12.5K" trend={{ value: 5.2, isPositive: true }} />
        <StatCard icon={Ticket} label="Tickets" value="24" trend={{ value: 3, isPositive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Activity Feed</h2>
            <div className="space-y-3">
              {mockActivityFeed.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {event.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500">{event.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className={`btn-primary w-full ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Module Status</h2>
            <div className="space-y-2">
              {moduleStatus.map((mod) => (
                <div
                  key={mod.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{mod.name}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      mod.enabled ? 'bg-green-600' : 'bg-slate-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
