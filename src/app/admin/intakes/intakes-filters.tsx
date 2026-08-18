"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function IntakesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
  const currentStatus = searchParams?.get("status") || "";

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentSearch) {
        createQueryString("search", search);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, currentSearch]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, pathname, router]
  );

  const clearAllFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters = !!(currentSearch || currentStatus);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 font-jost">
      {/* Search Input Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search intake name or year..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-8 h-11 bg-white border-slate-200 rounded-xl text-slate-800 text-sm shadow-2xs focus:border-[#252D65] focus:ring-[#252D65]/10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center">
        {/* Status Filter */}
        <Select
          value={currentStatus || "all"}
          onValueChange={(val: string | null) => createQueryString("status", val || "all")}
        >
          <SelectTrigger className="w-[140px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <div className="flex items-center gap-1.5 truncate">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <SelectValue placeholder="All Status" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearAllFilters}
            className="h-11 px-3 text-xs font-bold text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-xl shrink-0"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
