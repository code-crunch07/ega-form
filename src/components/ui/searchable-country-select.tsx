"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface SearchableCountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  id?: string;
}

export function SearchableCountrySelect({
  value = "",
  onChange,
  placeholder = "Select a country / Search...",
  disabled = false,
  className,
  error = false,
  id,
}: SearchableCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return COUNTRIES;
    const query = searchTerm.toLowerCase().trim();
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (country: string) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-left text-sm font-medium transition-all flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#252D65]/20 focus:border-[#252D65]",
          disabled && "bg-slate-100 text-slate-400 cursor-not-allowed",
          error && "border-red-500 ring-2 ring-red-500/10",
          isOpen && "border-[#252D65] ring-2 ring-[#252D65]/20",
          className
        )}
      >
        <span
          className={cn(
            "truncate block",
            !value ? "text-slate-400 font-normal" : "text-slate-900 font-semibold"
          )}
        >
          {value || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-1 hover:text-slate-600 rounded-md transition-colors"
              title="Clear selection"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180 text-[#252D65]"
            )}
          />
        </div>
      </button>

      {/* Floating Dropdown Popover */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 font-jost">
          {/* Search Box Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-[#252D65] focus:ring-1 focus:ring-[#252D65]"
              />
            </div>
          </div>

          {/* List of Countries */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = value === country;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "w-full px-3 py-2 text-xs font-medium rounded-lg text-left flex items-center justify-between transition-colors",
                      isSelected
                        ? "bg-[#252D65] text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span className="truncate">{country}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No countries matching &ldquo;{searchTerm}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
