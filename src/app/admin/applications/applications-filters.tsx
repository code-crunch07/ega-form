"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ApplicationsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams?.get("search") || "");
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      createQueryString("search", search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

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

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
        <Input
          placeholder="Search Application (Name, ID, Email)..."
          className="pl-9 bg-white dark:bg-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap sm:flex-nowrap gap-2">
        <Select onValueChange={(val) => createQueryString("status", val === "all" ? "" : val)}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-black">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => createQueryString("intake", val === "all" ? "" : val)}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-black">
            <SelectValue placeholder="Intake" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intakes</SelectItem>
            <SelectItem value="Sep 2026">Sep 2026</SelectItem>
            <SelectItem value="Jan 2026">Jan 2026</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => createQueryString("programme", val === "all" ? "" : val)}>
          <SelectTrigger className="w-[160px] bg-white dark:bg-black">
            <SelectValue placeholder="Programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programmes</SelectItem>
            <SelectItem value="bsc-it">BSc IT</SelectItem>
            <SelectItem value="mba">MBA</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={(val) => createQueryString("officer", val === "all" ? "" : val)}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-black">
            <SelectValue placeholder="Officer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Officers</SelectItem>
            <SelectItem value="sarah">Sarah</SelectItem>
            <SelectItem value="mike">Mike</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
