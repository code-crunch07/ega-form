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

interface School {
  id: string;
  name: string;
}

interface ProgrammesFiltersProps {
  schools?: School[];
  studyLevels?: string[];
}

export function ProgrammesFilters({ 
  schools = [],
  studyLevels = [
    "Foundation / Certificate",
    "Diploma",
    "Advanced / Higher Diploma",
    "Undergraduate / Bachelor's Degree",
    "Postgraduate / Master's Degree",
    "Doctorate / PhD"
  ]
}: ProgrammesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
  const currentSchool = searchParams?.get("school") || "";
  const currentLevel = searchParams?.get("level") || "";
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

  const hasActiveFilters = !!(currentSearch || currentSchool || currentLevel || currentStatus);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 font-jost">
      {/* Search Input Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search by programme code, title, school..." 
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
        {/* School Filter */}
        <Select
          value={currentSchool || "all"}
          onValueChange={(val: string | null) => createQueryString("school", val || "all")}
        >
          <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <div className="flex items-center gap-1.5 truncate">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <SelectValue placeholder="All Schools" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl max-h-60">
            <SelectItem value="all">All Schools</SelectItem>
            {schools.map((sch) => (
              <SelectItem key={sch.id} value={sch.id}>
                {sch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select
          value={currentLevel || "all"}
          onValueChange={(val: string | null) => createQueryString("level", val || "all")}
        >
          <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl max-h-60">
            <SelectItem value="all">All Levels</SelectItem>
            {studyLevels.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={currentStatus || "all"}
          onValueChange={(val: string | null) => createQueryString("status", val || "all")}
        >
          <SelectTrigger className="w-[130px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
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
