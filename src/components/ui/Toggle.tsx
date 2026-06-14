import { cn } from '@/lib/utils';

interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; className?: string; }

export function Toggle({ checked, onChange, disabled = false, className }: ToggleProps) {
  return (
    <button type="button" onClick={() => !disabled && onChange(!checked)} disabled={disabled}
      className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300', checked ? 'bg-neon-green shadow-lg shadow-neon-green/50' : 'bg-dark-400 hover:bg-dark-500', disabled && 'opacity-50 cursor-not-allowed', !disabled && 'cursor-pointer', className)}>
      <span className={cn('inline-block h-5 w-5 transform rounded-full bg-white transition duration-300', checked ? 'translate-x-5' : 'translate-x-1')} />
    </button>
  );
}
