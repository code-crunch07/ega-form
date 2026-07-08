import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  linkText?: string;
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  linkText,
  iconClassName = "bg-neutral-50 text-neutral-400",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-2xs transition-all duration-300 hover:border-indigo-500/20 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight text-neutral-800 sm:text-4xl">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 sm:h-12 sm:w-12",
            iconClassName
          )}
        >
          <Icon size={20} />
        </div>
      </div>
      {href && linkText && (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#2C315E] hover:text-[#4F46E5] transition-colors"
        >
          {linkText} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
