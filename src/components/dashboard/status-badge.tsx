import { cn } from "@/lib/utils";
import { getStatusStyle } from "@/lib/dashboard-utils";

export function StatusBadge({ status }: { status: string }) {
  const { label, className } = getStatusStyle(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
    >
      {label}
    </span>
  );
}
