import { Card } from "@/components/ui/Card";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpRight } from "lucide-react";
import type { Transaction } from "@/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <Card className="animate-fade-in delay-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            Recent Transactions
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Latest processed records
          </p>
        </div>
        <a
          href="/transactions"
          className="text-xs text-primary hover:text-primary-light flex items-center gap-1 transition-colors"
        >
          View All <ArrowUpRight size={12} />
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                Time
              </th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                MTI
              </th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                PAN
              </th>
              <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                Amount
              </th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                RC
              </th>
              <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2 px-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr
                key={txn.id}
                className={`
                  border-b border-border-subtle hover:bg-surface-hover transition-colors duration-150
                  animate-fade-in delay-${i + 1}
                `}
              >
                <td className="py-2.5 px-3 text-sm text-text-secondary font-mono">
                  {formatTime(txn.timestamp)}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text-secondary">
                    {txn.mti}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-sm text-text-secondary font-mono">
                  {txn.pan}
                </td>
                <td className="py-2.5 px-3 text-sm text-text-primary text-right font-semibold">
                  ${txn.amount}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs font-mono text-text-muted">
                    {txn.responseCode}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <StatusBadge status={txn.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
