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
      className={cn("mb-6 flex items-center gap-1.5 text-sm", className)}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-neutral-500 transition-colors hover:text-[#2C315E]"
      >
        <Home size={14} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="shrink-0 text-neutral-300" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="rounded-md px-1.5 py-0.5 font-medium text-neutral-500 transition-colors hover:text-[#2C315E]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5 font-semibold text-neutral-900">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
