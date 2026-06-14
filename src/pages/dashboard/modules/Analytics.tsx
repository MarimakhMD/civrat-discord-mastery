import { useState } from 'react';
import { ChartBar as BarChart3 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const memberGrowthData = [
  { month: 'Jan', members: 1200 },
  { month: 'Feb', members: 1450 },
  { month: 'Mar', members: 1680 },
  { month: 'Apr', members: 2100 },
  { month: 'May', members: 2543 },
];

const messageData = [
  { time: '00:00', messages: 45 },
  { time: '04:00', messages: 32 },
  { time: '08:00', messages: 120 },
  { time: '12:00', messages: 380 },
  { time: '16:00', messages: 290 },
  { time: '20:00', messages: 450 },
  { time: '24:00', messages: 210 },
];

const commandData = [
  { command: 'help', count: 342 },
  { command: 'info', count: 298 },
  { command: 'ping', count: 245 },
  { command: 'profile', count: 189 },
  { command: 'stats', count: 156 },
];

const moduleUsageData = [
  { name: 'Welcome', value: 35 },
  { name: 'Tickets', value: 25 },
  { name: 'XP Levels', value: 20 },
  { name: 'Logs', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={BarChart3}
        title="Analytics & Statistics"
        description="Server statistics and analytics dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Total Messages" value="142.5K" trend={{ value: 12.5, isPositive: true }} />
        <StatCard icon={BarChart3} label="Active Users" value="1,234" trend={{ value: 8.2, isPositive: true }} />
        <StatCard icon={BarChart3} label="Commands Used" value="8,932" trend={{ value: 15.3, isPositive: true }} />
        <StatCard icon={BarChart3} label="Module Usage" value="94.2%" trend={{ value: 2.1, isPositive: true }} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Member Growth</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1 text-sm"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={memberGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Messages (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={messageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="messages"
              fill="#3b82f6"
              stroke="#3b82f6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Top Commands</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={commandData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="command" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Module Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={moduleUsageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''}: ${value ?? 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {moduleUsageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
