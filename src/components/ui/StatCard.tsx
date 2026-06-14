import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from '@/types/lucide';
import { cn } from '@/lib/utils';

interface StatCardProps { icon: LucideIcon; label: string; value: string | number; trend?: { value: number; isPositive: boolean }; className?: string; }

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
  return (
    <div className={cn('module-card', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 border border-neon-green/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-neon-green" />
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded', trend.isPositive ? 'text-neon-green bg-neon-green/10' : 'text-error bg-error/10')}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-dark-300 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
