"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentsFiltersProps {
  paymentsData?: {
    invoiceNumber: string;
    applicantName: string;
    applicantEmail: string;
    amount: number;
    gateway: string;
    date: string;
    status: string;
  }[];
}

export function PaymentsFilters({ paymentsData = [] }: PaymentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get("search") || "";
  const currentStatus = searchParams?.get("status") || "";
  const currentGateway = searchParams?.get("gateway") || "";

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

  const handleExportCSV = () => {
    if (paymentsData.length === 0) {
      alert("No payments data available to export.");
      return;
    }

    const headers = ["Invoice #", "Applicant Name", "Applicant Email", "Amount (USD)", "Gateway", "Date", "Status"];
    const csvRows = [
      headers.join(","),
      ...paymentsData.map((row) =>
        [
          `"${row.invoiceNumber}"`,
          `"${row.applicantName}"`,
          `"${row.applicantEmail}"`,
          `"${row.amount.toFixed(2)}"`,
          `"${row.gateway}"`,
          `"${row.date}"`,
          `"${row.status}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = !!(currentSearch || currentStatus || currentGateway);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 font-jost">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search invoice number, applicant name, or email..." 
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
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        {/* Gateway Filter */}
        <Select
          value={currentGateway || "all"}
          onValueChange={(val: string | null) => createQueryString("gateway", val || "all")}
        >
          <SelectTrigger className="w-[140px] h-11 bg-white border-slate-200 rounded-xl text-slate-700 font-medium text-xs shadow-2xs focus:border-[#252D65]">
            <SelectValue placeholder="All Gateways" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
            <SelectItem value="all">All Gateways</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="manual">Manual / Bank</SelectItem>
          </SelectContent>
        </Select>

        {/* Export CSV Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleExportCSV}
          className="h-11 px-4 border-slate-200 text-xs font-bold text-slate-700 hover:text-[#252D65] hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-2xs"
        >
          <Download size={15} className="text-slate-400" />
          <span>Export CSV</span>
        </Button>

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
