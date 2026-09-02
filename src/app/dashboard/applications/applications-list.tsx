"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, FileText, PlusCircle } from "lucide-react";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ApplicationItem = {
  id: string;
  appNumber: string;
  status: string;
  intake?: string | null;
  studyMode?: string | null;
  currentStep: number;
  updatedAt: string;
  submittedAt?: string | null;
  programmeName?: string;
  programmeCode?: string;
};

type FilterMode = "all" | "saved" | "unpaid" | "completed";

export function ApplicationsList({
  applications,
}: {
  applications: ApplicationItem[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((app) => {
      const isSaved = app.status === "Draft" || app.status === "Incomplete";
      const isUnpaid = app.status === "Pending Payment" || app.status === "PendingPayment";
      const isCompleted = !isSaved && !isUnpaid;

      const matchesFilter =
        filter === "all" ||
        (filter === "saved" && isSaved) ||
        (filter === "unpaid" && isUnpaid) ||
        (filter === "completed" && isCompleted);

      if (!matchesFilter) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        app.appNumber,
        app.programmeName,
        app.programmeCode,
        app.intake,
        app.studyMode,
        app.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [applications, filter, query]);

  const savedApps = filtered.filter((a) => a.status === "Draft" || a.status === "Incomplete");
  const unpaidApps = filtered.filter((a) => a.status === "Pending Payment" || a.status === "PendingPayment");
  const completedApps = filtered.filter((a) => a.status !== "Draft" && a.status !== "Incomplete" && a.status !== "Pending Payment" && a.status !== "PendingPayment");

  const filterOptions: { id: FilterMode; label: string; count: number }[] = [
    { id: "all", label: "All", count: applications.length },
    {
      id: "saved",
      label: "Saved Applications",
      count: applications.filter((a) => a.status === "Draft" || a.status === "Incomplete").length,
    },
    {
      id: "unpaid",
      label: "Unpaid / Payment-In-Progress",
      count: applications.filter((a) => a.status === "Pending Payment" || a.status === "PendingPayment").length,
    },
    {
      id: "completed",
      label: "Completed Applications",
      count: applications.filter((a) => a.status !== "Draft" && a.status !== "Incomplete" && a.status !== "Pending Payment" && a.status !== "PendingPayment").length,
    },
  ];

  if (applications.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        icon={FileText}
        title="No applications yet"
        description="When you start an application, it will appear here. You can save drafts and return anytime."
        action={{
          label: "Start Your First Application",
          href: "/dashboard/applications/new",
        }}
      />
    );
  }

  // Spec-approved empty-state text per bucket (F-006)
  const getEmptyStateCopy = () => {
    if (filter === "saved") {
      return {
        title: "You have no saved applications.",
        desc: "Start a new application and you can save your progress anytime.",
      };
    }
    if (filter === "unpaid") {
      return {
        title: "You have no unpaid / payment-in-progress applications.",
        desc: "All submitted applications have their fees settled or are in review.",
      };
    }
    if (filter === "completed") {
      return {
        title: "You have no completed applications.",
        desc: "Once an application is finalized and assessed, it will appear here.",
      };
    }
    return {
      title: "No matching applications",
      desc: "Try a different search term or clear your filters.",
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by application number or programme..."
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 pl-10 pr-4 text-sm focus:border-[#27295B]/40 focus:outline-none focus:ring-2 focus:ring-[#27295B]/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
                filter === option.id
                  ? "border-[#27295B] bg-[#27295B] text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              <Filter size={14} />
              {option.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  filter === option.id ? "bg-white/20" : "bg-neutral-100"
                )}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={getEmptyStateCopy().title}
          description={getEmptyStateCopy().desc}
        >
          <Button
            variant="outline"
            className="mt-4 rounded-xl border-neutral-200"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-8">
          {/* Bucket 1: Saved Applications (Drafts) */}
          {savedApps.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
                Saved Applications ({savedApps.length})
              </h2>
              <div className="grid gap-4">
                {savedApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} isDraft />
                ))}
              </div>
            </section>
          )}

          {/* Bucket 2: Unpaid / Payment-In-Progress Applications (F-005, F-008) */}
          {unpaidApps.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-600">
                Unpaid / Payment-In-Progress Applications ({unpaidApps.length})
              </h2>
              <div className="grid gap-4">
                {unpaidApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} isUnpaid />
                ))}
              </div>
            </section>
          )}

          {/* Bucket 3: Completed Applications */}
          {completedApps.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-700">
                Completed Applications ({completedApps.length})
              </h2>
              <div className="grid gap-4">
                {completedApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({
  app,
  isDraft,
  isUnpaid,
}: {
  app: ApplicationItem;
  isDraft?: boolean;
  isUnpaid?: boolean;
}) {
  const progress = isDraft
    ? Math.min(Math.round((app.currentStep / 5) * 100), 95)
    : 100;

  return (
    <div className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#27295B]/20 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">
              {app.programmeName ?? "Untitled Application"}
            </h3>
            <StatusBadge status={app.status} />
          </div>
          {app.programmeCode && (
            <p className="text-sm font-medium text-neutral-500">{app.programmeCode}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
            <span>{app.appNumber}</span>
            {app.intake && <span>Intake: {app.intake}</span>}
            {app.studyMode && <span>{app.studyMode}</span>}
            <span>Updated {formatRelativeDate(new Date(app.updatedAt))}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isDraft ? (
            <Button asChild className="rounded-xl bg-[#27295B] hover:bg-[#1E2045]">
              <Link href="/dashboard/applications/new">
                <PlusCircle size={16} />
                Continue
              </Link>
            </Button>
          ) : isUnpaid ? (
            <Button asChild className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold">
              <Link href="/dashboard/payments">
                Complete Payment &rarr;
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-xl border-neutral-200">
              <Link href={`/dashboard/applications/${app.id}`}>View Details</Link>
            </Button>
          )}
        </div>
      </div>

      {isDraft && (
        <div className="mt-5 border-t border-neutral-100 pt-4">
          <div className="mb-2 flex justify-between text-xs font-semibold">
            <span className="text-neutral-600">Progress</span>
            <span className="text-[#27295B]">
              {progress}% · Step {app.currentStep} of 5
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-[#27295B] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
