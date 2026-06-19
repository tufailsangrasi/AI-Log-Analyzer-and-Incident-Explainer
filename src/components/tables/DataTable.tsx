"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  expandableRow?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  page = 1,
  totalPages = 1,
  onPageChange,
  expandableRow,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal === bVal) return 0;
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleRow = (key: string) => {
    setExpandedRow((prev) => (prev === key ? null : key));
  };

  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-[12px] p-12 text-center">
        <p className="text-text-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-[12px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              {expandableRow && <th className="w-8" />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    text-[11px] font-semibold text-text-muted uppercase tracking-wider
                    py-3 px-4
                    ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                    ${col.sortable ? "cursor-pointer select-none hover:text-text-secondary transition-colors" : ""}
                  `}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, i) => {
              const key = keyExtractor(item);
              const isExpanded = expandedRow === key;

              return (
                <>
                  <tr
                    key={key}
                    className={`
                      border-b border-border-subtle hover:bg-surface-hover
                      transition-colors duration-150 animate-fade-in
                      ${expandableRow ? "cursor-pointer" : ""}
                      ${isExpanded ? "bg-surface-hover" : ""}
                    `}
                    style={{ animationDelay: `${i * 30}ms` }}
                    onClick={expandableRow ? () => toggleRow(key) : undefined}
                  >
                    {expandableRow && (
                      <td className="py-2.5 px-2 text-center">
                        <ChevronRight
                          size={14}
                          className={`text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`
                          py-2.5 px-4 text-sm
                          ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                        `}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                  {expandableRow && isExpanded && (
                    <tr key={`${key}-expanded`}>
                      <td
                        colSpan={columns.length + 1}
                        className="bg-bg border-b border-border p-4"
                      >
                        {expandableRow(item)}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
