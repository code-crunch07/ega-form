import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2 text-xs shadow-2xs backdrop-blur-md font-jost", className)}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-[#27295B]"
      >
        <Home size={14} className="text-[#27295B]" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            <ChevronRight size={13} className="shrink-0 text-slate-300" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-slate-500 transition-colors hover:text-[#27295B]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/60">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
