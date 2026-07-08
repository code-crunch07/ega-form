import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
  variant?: "default" | "dashed";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        variant === "dashed" &&
          "rounded-2xl border border-dashed border-neutral-200 bg-slate-50/50",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C315E]/6 text-[#2C315E] sm:h-14 sm:w-14 shadow-2xs">
        <Icon size={variant === "dashed" ? 28 : 24} />
      </div>
      <h3 className="text-base font-bold text-neutral-800 sm:text-lg">{title}</h3>
      <p className="mt-1.5 max-w-xs text-xs font-medium text-neutral-400 leading-relaxed">{description}</p>
      {action && (
        <Button asChild className="mt-5 h-10 rounded-xl bg-gradient-to-r from-[#2C315E] to-[#4F46E5] px-5 hover:opacity-95 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300 font-bold">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
      {children}
    </div>
  );
}
