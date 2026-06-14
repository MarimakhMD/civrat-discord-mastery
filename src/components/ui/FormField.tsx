import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps { label: string; description?: string; error?: string; required?: boolean; children: ReactNode; className?: string; }

export function FormField({ label, description, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-semibold text-white flex items-center gap-2">
        {label}{required && <span className="text-error">*</span>}
      </label>
      {description && <p className="text-xs text-dark-300">{description}</p>}
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
