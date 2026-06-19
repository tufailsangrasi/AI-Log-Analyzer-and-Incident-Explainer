"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { theme } from "@/styles/theme";
import type { TimeSeriesPoint } from "@/types";

interface TransactionChartProps {
  data: TimeSeriesPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3 shadow-elevated">
      <p className="text-xs text-text-muted mb-2">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-text-secondary capitalize">
            {item.dataKey === "successCount"
              ? "Success"
              : item.dataKey === "errorCount"
              ? "Errors"
              : "Total"}
            :
          </span>
          <span className="font-semibold text-text-primary">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TransactionChart({ data }: TransactionChartProps) {
  return (
    <Card className="animate-fade-in delay-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            Transaction Volume
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Daily transaction count over time
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.colors.success }} />
            <span className="text-text-muted">Success</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.colors.error }} />
            <span className="text-text-muted">Errors</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors.success} stopOpacity={0.3} />
                <stop offset="100%" stopColor={theme.colors.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.colors.textMuted, fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.colors.textMuted, fontSize: 11 }}
              dx={-8}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="successCount"
              fill="url(#successGradient)"
              stroke={theme.colors.success}
              strokeWidth={2}
            />
            <Bar
              dataKey="errorCount"
              fill={theme.colors.error}
              radius={[4, 4, 0, 0]}
              barSize={16}
              opacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
