import { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption { value: string; label: string; }
interface SelectProps { value: string; onChange: (value: string) => void; options: SelectOption[]; placeholder?: string; disabled?: boolean; className?: string; }

function compareOptions(a: SelectOption, b: SelectOption) {
  return a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' });
}

export function Select({ value, onChange, options, placeholder = 'Select an option', disabled = false, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => options
    .filter((option) => option.label.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')))
    .sort(compareOptions), [options, query]);

  useEffect(() => {
    const handler = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const close = () => { setIsOpen(false); setQuery(''); };
  return <div ref={ref} className={cn('relative isolate w-full', className)}>
    <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => !disabled && setIsOpen((open) => !open)} onKeyDown={(event) => { if (event.key === 'Escape') close(); }} disabled={disabled} className={cn('input-field flex items-center justify-between', disabled && 'cursor-not-allowed opacity-50')}>
      <span className={cn('min-w-0 truncate', selectedOption ? 'text-white' : 'text-dark-300')}>{selectedOption?.label || placeholder}</span>
      <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
    </button>
    {isOpen && !disabled && <div className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-lg border border-white/10 bg-dark-800 shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 p-2"><label className="sr-only" htmlFor={`select-search-${value || 'empty'}`}>Rechercher</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" /><input id={`select-search-${value || 'empty'}`} autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') close(); }} className="input-field !h-9 !py-1 pl-9 text-sm" placeholder="Rechercher…" /></div></div>
      <div role="listbox" className="max-h-60 overflow-y-auto overscroll-contain p-1">
        {filteredOptions.length ? filteredOptions.map((option) => <button key={option.value} type="button" role="option" aria-selected={value === option.value} onClick={() => { onChange(option.value); close(); }} className={cn('w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors', value === option.value ? 'bg-neon-green/20 font-medium text-neon-green' : 'text-white hover:bg-white/5')}>{option.label}</button>) : <p className="px-3 py-6 text-center text-sm text-dark-300">Aucun résultat</p>}
      </div>
    </div>}
  </div>;
}
