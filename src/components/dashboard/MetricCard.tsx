import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  format?: "number" | "percentage" | "time";
  index?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  format = "number",
  index = 0,
}: MetricCardProps) {
  const formattedValue = (() => {
    if (typeof value === "string") return value;
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "time":
        return `${value}ms`;
      default:
        return value.toLocaleString();
    }
  })();

  const trendIcon = (() => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp size={14} />;
    if (change < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
  })();

  const trendColor = (() => {
    if (change === undefined) return "";
    if (change > 0) return "text-success";
    if (change < 0) return "text-error";
    return "text-text-muted";
  })();

  return (
    <Card
      hover
      className={`animate-fade-in delay-${index + 1} group relative overflow-hidden`}
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-primary/10 transition-colors duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm text-text-muted font-medium">{title}</p>
          <div className="p-2 rounded-[10px] bg-primary/10 text-primary">
            {icon}
          </div>
        </div>

        <p className="text-3xl font-bold text-text-primary tracking-tight animate-count-up">
          {formattedValue}
        </p>

        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            <span>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            {changeLabel && (
              <span className="text-text-muted ml-1">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
