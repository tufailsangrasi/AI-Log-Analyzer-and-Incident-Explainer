"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { theme } from "@/styles/theme";
import type { ResponseCodeEntry } from "@/types";

interface ResponseCodePieProps {
  data: ResponseCodeEntry[];
}

const CHART_COLORS = [
  theme.colors.success,
  theme.colors.error,
  theme.colors.warning,
  theme.colors.info,
  theme.colors.primary,
  "#8b5cf6",
  "#06b6d4",
  "#6b7280",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ResponseCodeEntry }>;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3 shadow-elevated">
      <p className="text-sm font-semibold text-text-primary">
        RC {entry.code}: {entry.label}
      </p>
      <p className="text-xs text-text-muted mt-1">
        {entry.count.toLocaleString()} transactions ({entry.percentage}%)
      </p>
    </div>
  );
}

export function ResponseCodePie({ data }: ResponseCodePieProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="animate-fade-in delay-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">
          Response Codes
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Distribution by ISO 8583 response code
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="h-[200px] w-[200px] relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-text-primary">
              {(total / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-text-muted">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.slice(0, 6).map((entry, index) => (
            <div
              key={entry.code}
              className="flex items-center justify-between text-sm group"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span className="text-text-secondary group-hover:text-text-primary transition-colors truncate">
                  {entry.code} — {entry.label}
                </span>
              </div>
              <span className="text-text-muted text-xs font-medium ml-2">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
