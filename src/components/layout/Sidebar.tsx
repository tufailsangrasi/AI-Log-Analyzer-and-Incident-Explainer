"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  ArrowLeftRight,
  ShieldCheck,
  FileBarChart,
  Terminal,
  Zap,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/uploads", label: "Upload Logs", icon: Upload },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/validations", label: "Validations", icon: ShieldCheck },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside className={`
        fixed left-0 top-0 bottom-0 w-[260px] bg-secondary border-r border-border flex flex-col z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center shadow-glow">
              <Terminal size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">
                ISO 8583
              </h1>
              <p className="text-[11px] text-text-muted font-medium -mt-0.5">
                Log Analyzer
              </p>
            </div>
          </div>
          {setIsOpen && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-[10px] text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              title="Close Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium
                transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-text-muted group-hover:text-text-secondary"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-text-muted">System Online</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 mt-2">
          <Zap size={12} className="text-primary" />
          <span className="text-[10px] text-text-muted">
            v1.0.0 — FinTech Edition
          </span>
        </div>
      </div>
    </aside>
    </>
  );
}
