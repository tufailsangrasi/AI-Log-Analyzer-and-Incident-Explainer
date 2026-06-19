"use client";

import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { ResponseCodePie } from "@/components/dashboard/ResponseCodePie";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useFetch } from "@/hooks/useFetch";
import { getDashboardMetrics } from "@/services/api";

export default function DashboardPage() {
  const { data: metrics, loading } = useFetch(() => getDashboardMetrics(), []);

  if (loading || !metrics) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions}
          change={8.2}
          changeLabel="vs last period"
          icon={<Activity size={18} />}
          index={0}
        />
        <MetricCard
          title="Success Rate"
          value={metrics.successRate}
          format="percentage"
          change={1.5}
          changeLabel="vs last period"
          icon={<CheckCircle2 size={18} />}
          index={1}
        />
        <MetricCard
          title="Error Count"
          value={metrics.errorCount}
          change={-3.4}
          changeLabel="vs last period"
          icon={<AlertTriangle size={18} />}
          index={2}
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics.avgResponseTime}
          format="time"
          change={-12}
          changeLabel="vs last period"
          icon={<Clock size={18} />}
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionChart data={metrics.transactionsOverTime} />
        </div>
        <div>
          <ResponseCodePie data={metrics.responseCodeDistribution} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={metrics.recentTransactions} />
    </div>
  );
}
