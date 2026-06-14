import type { LucideIcon } from '@/types/lucide';
import { Toggle } from './Toggle';
import { cn } from '@/lib/utils';

interface ModuleHeaderProps { icon: LucideIcon; title: string; description?: string; toggleEnabled?: boolean; onToggle?: (enabled: boolean) => void; className?: string; }

export function ModuleHeader({ icon: Icon, title, description, toggleEnabled, onToggle, className }: ModuleHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 border border-neon-green/30 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-neon-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-dark-300 text-sm">{description}</p>}
          </div>
        </div>
        {toggleEnabled !== undefined && onToggle && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-dark-300">{toggleEnabled ? 'Enabled' : 'Disabled'}</span>
            <Toggle checked={toggleEnabled} onChange={onToggle} />
          </div>
        )}
      </div>
    </div>
  );
}
