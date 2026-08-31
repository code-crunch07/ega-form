"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X, BookOpen } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

export interface ProgrammeItem {
  id: string;
  name: string;
  code: string;
  level?: string | null;
  modeOfStudy?: string | null;
  duration?: string | null;
}

interface SearchableProgrammeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  programmes: ProgrammeItem[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  id?: string;
}

export function SearchableProgrammeSelect({
  value = "",
  onChange,
  programmes = [],
  placeholder = "Search and select a programme...",
  disabled = false,
  className,
  error = false,
  id,
}: SearchableProgrammeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedProgramme = useMemo(() => {
    return programmes.find((p) => p.id === value);
  }, [programmes, value]);

  const filteredProgrammes = useMemo(() => {
    if (!searchTerm.trim()) return programmes;
    const query = searchTerm.toLowerCase().trim();
    return programmes.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(query);
      const matchCode = p.code?.toLowerCase().includes(query);
      const matchLevel = p.level?.toLowerCase().includes(query);
      return matchName || matchCode || matchLevel;
    });
  }, [programmes, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSelect = (programmeId: string) => {
    onChange(programmeId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const displayText = selectedProgramme
    ? `${selectedProgramme.name} (${selectedProgramme.code})`
    : "";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <Popover.Trigger
        type="button"
        id={id}
        disabled={disabled}
        className={cn(
          "w-full min-h-[48px] h-auto py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#252D65]/20 focus:border-[#252D65]",
          disabled && "bg-slate-100 text-slate-400 cursor-not-allowed",
          error && "border-red-500 ring-2 ring-red-500/10",
          isOpen && "border-[#252D65] ring-2 ring-[#252D65]/20",
          className
        )}
      >
        <div className="flex-1 min-w-0 pr-1">
          {displayText ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 truncate block">
                {selectedProgramme?.name}
              </span>
              {selectedProgramme?.code && (
                <span className="text-[11px] font-mono font-bold text-[#252D65] bg-[#252D65]/10 px-2 py-0.5 rounded-md shrink-0">
                  {selectedProgramme.code}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </div>

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
      </Popover.Trigger>

      {/* Dropdown Popover mounted via Portal */}
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={6}
          className="isolate z-50 w-[var(--anchor-width)] min-w-[320px] max-w-[95vw] md:max-w-xl outline-none"
        >
          <Popover.Popup className="relative isolate z-50 max-h-80 w-full overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200/90 p-1.5 duration-100 font-jost outline-none animate-in fade-in-0 zoom-in-95 flex flex-col">
            {/* Search Box Header */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1 shrink-0 space-y-1.5">
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
                  placeholder="Search by programme title or course code..."
                  className="w-full h-9 pl-9 pr-8 text-xs bg-white border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-[#252D65] focus:ring-1 focus:ring-[#252D65]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>
                  {filteredProgrammes.length} {filteredProgrammes.length === 1 ? "programme" : "programmes"} available
                </span>
                {searchTerm && (
                  <span className="font-medium text-[#252D65]">
                    Filtered by &ldquo;{searchTerm}&rdquo;
                  </span>
                )}
              </div>
            </div>

            {/* List of Programmes */}
            <div className="overflow-y-auto p-1 space-y-1 custom-scrollbar max-h-64 flex-1">
              {filteredProgrammes.length > 0 ? (
                filteredProgrammes.map((p) => {
                  const isSelected = value === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className={cn(
                        "w-full px-3 py-2.5 text-left rounded-xl transition-all flex items-start justify-between gap-3 border",
                        isSelected
                          ? "bg-[#252D65] text-white border-[#252D65] shadow-xs"
                          : "bg-white text-slate-800 border-transparent hover:bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "text-xs font-bold leading-tight",
                              isSelected ? "text-white" : "text-slate-900"
                            )}
                          >
                            {p.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span
                            className={cn(
                              "font-mono font-bold px-1.5 py-0.5 rounded text-[10px]",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-600 border border-slate-200/60"
                            )}
                          >
                            {p.code}
                          </span>
                          {p.level && (
                            <span
                              className={cn(
                                "text-[10px]",
                                isSelected ? "text-slate-200" : "text-slate-400"
                              )}
                            >
                              • {p.level}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <Check size={13} />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-2">
                  <BookOpen size={24} className="mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500 font-medium">
                    No programmes matching &ldquo;{searchTerm}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Try searching with another keyword or course code
                  </p>
                </div>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
