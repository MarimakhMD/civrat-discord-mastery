import type { ReactNode } from "react";

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0 animate-fade-up">
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
            {eyebrow}
          </div>
        )}
        <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
