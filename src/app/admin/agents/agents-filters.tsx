"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AgentsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
  const currentCountry = searchParams?.get("country") || "";
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

  const hasActiveFilters = !!(currentSearch || currentCountry || currentStatus);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 font-jost">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search agency name, counsellor, email, city..." 
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
        {/* Country Filter */}
        <Select
          value={currentCountry || "all"}
          onValueChange={(val: string | null) => createQueryString("country", val || "all")}
        >
          <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <div className="flex items-center gap-1.5 truncate">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <SelectValue placeholder="All Countries" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl max-h-60">
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Vietnam">Vietnam</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Thailand">Thailand</SelectItem>
            <SelectItem value="Myanmar">Myanmar</SelectItem>
            <SelectItem value="Philippines">Philippines</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={currentStatus || "all"}
          onValueChange={(val: string | null) => createQueryString("status", val || "all")}
        >
          <SelectTrigger className="w-[140px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFilters}
            className="h-11 px-3 text-slate-500 hover:text-slate-900 rounded-xl text-xs"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
