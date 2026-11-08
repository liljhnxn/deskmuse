"use client";

import React from "react";
import { CATEGORIES } from "@/lib/contract";
import { Filter, Search, UserCheck, Sparkles, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showOnlyMine: boolean;
  onToggleMine: (val: boolean) => void;
  sortBy: "newest" | "likes";
  onSortChange: (sort: "newest" | "likes") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isConnected: boolean;
  mySetupsCount: number;
}

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  showOnlyMine,
  onToggleMine,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  isConnected,
  mySetupsCount,
}: FilterBarProps) {
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Search and Secondary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, gear, setup type, or creator address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-card-border focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-muted transition-all"
          />
        </div>

        {/* View Toggle: All vs My Setups & Sorting */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {isConnected && (
            <button
              onClick={() => onToggleMine(!showOnlyMine)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                showOnlyMine
                  ? "bg-accent text-background border-accent shadow-accent"
                  : "bg-card text-text-secondary hover:text-text-primary border-card-border hover:border-surface-tertiary"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>My Setups</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  showOnlyMine ? "bg-background text-accent" : "bg-surface-tertiary text-text-primary"
                }`}
              >
                {mySetupsCount}
              </span>
            </button>
          )}

          {/* Sort Selector */}
          <div className="flex items-center rounded-xl bg-card border border-card-border p-1">
            <button
              onClick={() => onSortChange("newest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === "newest"
                  ? "bg-surface-tertiary text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => onSortChange("likes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === "likes"
                  ? "bg-surface-tertiary text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Most Liked
            </button>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll / Wrap */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
        <button
          onClick={() => {
            onSelectCategory("All");
            if (showOnlyMine) onToggleMine(false);
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
            selectedCategory === "All" && !showOnlyMine
              ? "bg-card border-accent text-accent font-semibold shadow-[0_0_15px_rgba(224,164,88,0.15)]"
              : "bg-surface-primary border-surface-tertiary text-text-secondary hover:text-text-primary hover:border-card-border"
          }`}
        >
          All Setups
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => {
              onSelectCategory(category);
              if (showOnlyMine) onToggleMine(false);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
              selectedCategory === category && !showOnlyMine
                ? "bg-card border-accent text-accent font-semibold shadow-[0_0_15px_rgba(224,164,88,0.15)]"
                : "bg-surface-primary border-surface-tertiary text-text-secondary hover:text-text-primary hover:border-card-border"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

