"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationsFiltersProps {
  intakes?: { id: string; name: string }[];
  programmes?: { id: string; name: string; code?: string }[];
}

export function ApplicationsFilters({
  intakes = [],
  programmes = [],
}: ApplicationsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
  const currentStatus = searchParams?.get("status") || "";
  const currentIntake = searchParams?.get("intake") || "";
  const currentProgramme = searchParams?.get("programme") || "";

  const [search, setSearch] = useState(currentSearch);

  // Sync state if URL changes externally
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

  const hasActiveFilters = !!(currentSearch || currentStatus || currentIntake || currentProgramme);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 font-jost">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search Applications (ID, Name, Email)..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-slate-800 text-sm shadow-2xs focus:border-[#252D65] focus:ring-[#252D65]/10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <SelectTrigger className="w-[150px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Dynamic Intakes Filter */}
        <Select 
          value={currentIntake || "all"} 
          onValueChange={(val: string | null) => createQueryString("intake", val || "all")}
        >
          <SelectTrigger className="w-[150px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Intakes" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl max-h-60">
            <SelectItem value="all">All Intakes</SelectItem>
            {intakes.map((itk) => (
              <SelectItem key={itk.id} value={itk.name}>
                {itk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Dynamic Programmes Filter */}
        <Select 
          value={currentProgramme || "all"} 
          onValueChange={(val: string | null) => createQueryString("programme", val || "all")}
        >
          <SelectTrigger className="w-[180px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Programmes" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl max-h-64">
            <SelectItem value="all">All Programmes</SelectItem>
            {programmes.map((prog) => (
              <SelectItem key={prog.id} value={prog.name}>
                {prog.name} {prog.code ? `(${prog.code})` : ""}
              </SelectItem>
            ))}
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
