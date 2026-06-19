"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, RefreshCcw, Menu } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Transaction monitoring & analytics overview",
  },
  "/uploads": {
    title: "Upload Logs",
    subtitle: "Import ISO 8583 log files for analysis",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Browse and inspect parsed transaction records",
  },
  "/validations": {
    title: "Validations",
    subtitle: "ISO 8583 field validation results",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Analytics, missing elements & error patterns",
  },
};

export function Header({ onMenuClick, isSidebarOpen }: { onMenuClick?: () => void, isSidebarOpen?: boolean }) {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || {
    title: "ISO 8583 Analyzer",
    subtitle: "Log analysis platform",
  };

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
      {/* Changed flex to a 3-column grid to maintain perfect centering while keeping natural height */}
      <div className="grid grid-cols-3 items-center px-4 lg:px-8 py-4">

        {/* 1. Left Side: Menu button */}
        <div className="flex items-center justify-start">
          {!isSidebarOpen && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-[10px] bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover hover:border-primary/30 transition-all duration-200"
              title="Open Sidebar"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* 2. Center: Title & Subtitle (No longer absolute, so it pushes the header height correctly) */}
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            {pageInfo.title}
          </h2>
          <p className="text-sm text-text-muted mt-0.5 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* 3. Right Side Controls */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className="
                bg-surface border border-border rounded-[10px] !pl-10 pr-4 py-2
                text-sm text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20
                transition-colors duration-200 w-[150px] lg:w-[200px]
              "
            />
          </div>

          {/* Refresh */}
          <button
            className="
              p-2 rounded-[10px] bg-surface border border-border
              text-text-muted hover:text-text-primary hover:border-primary/30
              transition-all duration-200
            "
            title="Refresh data"
          >
            <RefreshCcw size={16} />
          </button>

          {/* Notifications */}
          <button
            className="
              relative p-2 rounded-[10px] bg-surface border border-border
              text-text-muted hover:text-text-primary hover:border-primary/30
              transition-all duration-200
            "
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">SA</span>
          </div>
        </div>

      </div>
    </header>
  );
}
