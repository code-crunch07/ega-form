import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-[#27295B]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#27295B]">
            {badge}
          </span>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#27295B]/10 text-[#27295B]">
              <Icon size={22} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-neutral-900 sm:text-[32px] sm:leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-neutral-500 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
