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

export function ApplicantsFilters() {
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
    <div className="flex items-center gap-3 font-jost">
      {/* Search Input Bar */}
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#252D65] transition-colors" size={16} />
        <Input 
          placeholder="Search applicants..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-8 h-10 w-full sm:w-[260px] md:w-[280px] rounded-full border-slate-200 bg-white text-slate-800 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-[#252D65] focus-visible:border-[#252D65] transition-all" 
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status Filter Dropdown */}
      <Select
        value={currentStatus || "all"}
        onValueChange={(val: string | null) => createQueryString("status", val || "all")}
      >
        <SelectTrigger className="h-10 rounded-full px-4 border-slate-200 bg-white text-slate-700 font-medium text-xs shadow-2xs w-[140px] focus:ring-1 focus:ring-[#252D65]">
          <div className="flex items-center gap-1.5 truncate">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Verified">Verified</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={clearAllFilters}
          className="h-10 px-3 text-xs font-bold text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-full"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
