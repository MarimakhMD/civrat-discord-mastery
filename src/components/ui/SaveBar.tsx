import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Save, RotateCcw, CircleAlert as AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveBarProps { isDirty: boolean; isSaving?: boolean; saveDisabled?: boolean; onSave: () => void; onReset: () => void; error?: string | null; }

export function SaveBar({ isDirty, isSaving = false, saveDisabled = false, onSave, onReset, error }: SaveBarProps) {
  const previousSaving = useRef(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (previousSaving.current && !isSaving && !isDirty && !error) {
      setSuccess(true);
      const timer = window.setTimeout(() => setSuccess(false), 3_500);
      return () => window.clearTimeout(timer);
    }
    previousSaving.current = isSaving;
  }, [error, isDirty, isSaving]);

  if (!isDirty && !success) return null;
  return <div role={error ? 'alert' : 'status'} className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-white/20 glass p-3 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:p-4">
    {error ? <div className="flex min-w-0 items-center gap-2 text-error"><AlertCircle className="h-4 w-4 shrink-0" /><span className="text-xs">{error}</span></div>
      : success ? <div className="flex min-w-0 items-center gap-2 text-neon-green"><CheckCircle2 className="h-4 w-4 shrink-0" /><span className="text-sm">Configuration enregistrée.</span></div>
      : <p className="text-sm text-dark-300">Modifications non enregistrées</p>}
    {isDirty && <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <button type="button" onClick={onReset} disabled={isSaving} className={cn('flex items-center gap-1 rounded-lg px-2 py-2 text-sm sm:px-3', isSaving ? 'text-dark-400' : 'text-white hover:bg-white/10')}>
        <RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Réinitialiser</span>
      </button>
      <button type="button" onClick={onSave} disabled={isSaving || saveDisabled} className={cn('btn-primary flex items-center gap-1 px-3 py-2 text-sm', (isSaving || saveDisabled) && 'cursor-not-allowed opacity-75')}>
        <Save className="h-4 w-4" />{isSaving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>}
  </div>;
}
