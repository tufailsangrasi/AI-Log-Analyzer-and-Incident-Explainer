"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useFetch } from "@/hooks/useFetch";
import { getValidationSummary } from "@/services/api";
import {
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { ValidationResult } from "@/types";

export default function ValidationsPage() {
  const { data: summary, loading } = useFetch(
    () => getValidationSummary(),
    []
  );
  const [expandedField, setExpandedField] = useState<number | null>(null);

  if (loading || !summary) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Fields Checked"
          value={summary.totalFieldsChecked}
          icon={<ShieldCheck size={18} />}
          index={0}
        />
        <MetricCard
          title="Pass Rate"
          value={summary.passRate}
          format="percentage"
          change={2.1}
          changeLabel="vs last batch"
          icon={<CheckCircle2 size={18} />}
          index={1}
        />
        <MetricCard
          title="Failures"
          value={summary.failCount}
          icon={<ShieldX size={18} />}
          index={2}
        />
        <MetricCard
          title="Warnings"
          value={summary.warningCount}
          icon={<AlertTriangle size={18} />}
          index={3}
        />
      </div>

      {/* Validation Results Table */}
      <Card className="animate-fade-in delay-3">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Field Validation Results
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            ISO 8583 field-level validation against specification rules
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-8" />
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Field
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Field Name
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Value
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Message
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.results.map((result: ValidationResult, i: number) => {
                const isExpanded = expandedField === result.fieldNumber;

                return (
                  <>
                    <tr
                      key={result.fieldNumber}
                      className={`
                        border-b border-border-subtle cursor-pointer
                        hover:bg-surface-hover transition-colors duration-150
                        animate-fade-in
                        ${isExpanded ? "bg-surface-hover" : ""}
                      `}
                      style={{ animationDelay: `${i * 30}ms` }}
                      onClick={() =>
                        setExpandedField(isExpanded ? null : result.fieldNumber)
                      }
                    >
                      <td className="py-2.5 px-2 text-center">
                        <ChevronRight
                          size={14}
                          className={`text-text-muted transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-primary">
                          DE-{result.fieldNumber}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-sm text-text-secondary">
                        {result.fieldName}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-mono text-text-secondary">
                        {result.value || (
                          <span className="text-text-muted italic">empty</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-text-muted">
                        {result.message}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <StatusBadge status={result.status} />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${result.fieldNumber}-detail`}>
                        <td
                          colSpan={6}
                          className="bg-bg border-b border-border p-4"
                        >
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                                Validation Rule
                              </p>
                              <p className="text-sm text-text-primary font-mono">
                                {result.rule}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                                Actual Value
                              </p>
                              <p className="text-sm text-text-primary font-mono">
                                {result.value || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                                Result
                              </p>
                              <p className="text-sm text-text-primary">
                                {result.message}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
