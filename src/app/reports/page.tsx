"use client";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { getMissingElementsReport } from "@/services/api";
import { theme } from "@/styles/theme";
import {
  FileBarChart,
  AlertTriangle,
  SearchX,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3 shadow-elevated">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0].value.toFixed(1)}% presence
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const { data: report, loading } = useFetch(
    () => getMissingElementsReport(),
    []
  );

  if (loading || !report) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Transactions Analyzed"
          value={report.totalTransactionsAnalyzed}
          icon={<FileBarChart size={18} />}
          index={0}
        />
        <MetricCard
          title="Missing Elements Found"
          value={report.missingElements.length}
          icon={<SearchX size={18} />}
          index={1}
        />
        <MetricCard
          title="Error Patterns Detected"
          value={report.errorPatterns.length}
          icon={<AlertTriangle size={18} />}
          index={2}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Missing Elements */}
        <Card className="animate-fade-in delay-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Missing Mandatory Elements
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Fields missing from parsed transactions
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Download size={14} />
              Export
            </Button>
          </div>

          <div className="space-y-2">
            {report.missingElements.map((el, i) => (
              <div
                key={el.fieldNumber}
                className="flex items-center gap-4 p-3 rounded-[10px] border border-border-subtle hover:bg-surface-hover transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-primary flex-shrink-0">
                  DE-{el.fieldNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {el.fieldName}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {el.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm font-semibold text-text-primary">
                    {el.occurrences.toLocaleString()}
                  </span>
                  <StatusBadge status={el.severity} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Field Frequency Chart */}
        <Card className="animate-fade-in delay-3">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Field Presence Rate
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Percentage of transactions containing each ISO 8583 field
            </p>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.fieldFrequency}
                layout="vertical"
                margin={{ left: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.colors.textMuted, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="fieldName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.colors.textSecondary, fontSize: 10 }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="presencePercentage"
                  fill={theme.colors.primary}
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Error Patterns */}
      <Card className="animate-fade-in delay-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Error Patterns
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Common issues detected across analyzed transactions
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <Download size={14} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Pattern
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Occurrences
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Affected TXNs
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2.5 px-3">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody>
              {report.errorPatterns.map((pattern, i) => (
                <tr
                  key={pattern.pattern}
                  className="border-b border-border-subtle hover:bg-surface-hover transition-colors duration-150 animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="py-3 px-3 text-sm text-text-secondary">
                    {pattern.pattern}
                  </td>
                  <td className="py-3 px-3 text-sm text-text-primary text-right font-semibold">
                    {pattern.count.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-sm text-text-muted text-right">
                    {pattern.affectedTransactions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={pattern.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
