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
          <span className="inline-flex items-center rounded-full bg-[#2C315E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#2C315E]">
            {badge}
          </span>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2C315E]/10 text-[#2C315E]">
              <Icon size={22} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
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
