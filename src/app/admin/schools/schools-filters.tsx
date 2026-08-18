"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SchoolsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
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
      if (value) {
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

  return (
    <div className="flex items-center gap-3 mb-6 font-jost">
      <div className="relative flex-1 sm:w-[280px]">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search school or faculty name..." 
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

      {search && (
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
  );
}
