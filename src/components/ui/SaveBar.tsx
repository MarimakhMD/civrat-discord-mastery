import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveBarProps { isDirty: boolean; isSaving?: boolean; onSave: () => void; onReset: () => void; error?: string | null; }

export function SaveBar({ isDirty, isSaving = false, onSave, onReset, error }: SaveBarProps) {
  if (!isDirty) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass border border-white/20 rounded-lg p-4 flex items-center justify-between gap-4 max-w-md">
      {error ? (
        <div className="flex items-center gap-2 text-error"><AlertCircle className="w-4 h-4" /><span className="text-xs">{error}</span></div>
      ) : (
        <p className="text-sm text-dark-300">You have unsaved changes</p>
      )}
      <div className="flex items-center gap-2">
        <button onClick={onReset} disabled={isSaving} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm', isSaving ? 'text-dark-400' : 'text-white hover:bg-white/10')}>
          <RotateCcw className="w-4 h-4" />Reset
        </button>
        <button onClick={onSave} disabled={isSaving} className={cn('btn-primary flex items-center gap-2 px-4 py-2 text-sm', isSaving && 'opacity-75')}>
          <Save className="w-4 h-4" />{isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
