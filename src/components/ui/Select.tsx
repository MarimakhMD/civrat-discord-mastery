import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption { value: string; label: string; }
interface SelectProps { value: string; onChange: (value: string) => void; options: SelectOption[]; placeholder?: string; disabled?: boolean; className?: string; }

export function Select({ value, onChange, options, placeholder = 'Select an option', disabled = false, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled}
        className={cn('input-field flex items-center justify-between', disabled && 'opacity-50 cursor-not-allowed')}>
        <span className={cn(selectedOption ? 'text-white' : 'text-dark-300')}>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 rounded-lg border border-white/10 shadow-xl z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {options.map(option => (
              <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={cn('w-full text-left px-4 py-3 text-sm transition-colors', value === option.value ? 'bg-neon-green/20 text-neon-green font-medium' : 'text-white hover:bg-white/5')}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
