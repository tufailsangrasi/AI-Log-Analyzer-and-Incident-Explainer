"use client";

import { useState } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useFetch } from "@/hooks/useFetch";
import { getTransactions } from "@/services/api";
import { Search } from "lucide-react";
import type { Transaction, TransactionStatus } from "@/types";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [mtiFilter, setMtiFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result, loading } = useFetch(
    () =>
      getTransactions({
        page,
        pageSize: 10,
        status: statusFilter as TransactionStatus | undefined || undefined,
        mti: mtiFilter || undefined,
        search: searchQuery || undefined,
      }),
    [page, statusFilter, mtiFilter, searchQuery]
  );

  const columns = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (txn: Transaction) => (
        <span className="text-text-secondary font-mono text-xs">
          {new Date(txn.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </span>
      ),
    },
    {
      key: "mti",
      label: "MTI",
      sortable: true,
      width: "80px",
      render: (txn: Transaction) => (
        <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text-secondary">
          {txn.mti}
        </span>
      ),
    },
    {
      key: "pan",
      label: "PAN",
      render: (txn: Transaction) => (
        <span className="text-sm font-mono text-text-secondary">{txn.pan}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right" as const,
      sortable: true,
      render: (txn: Transaction) => (
        <span className="text-sm font-semibold text-text-primary">
          ${txn.amount}
        </span>
      ),
    },
    {
      key: "responseCode",
      label: "Response",
      render: (txn: Transaction) => (
        <div>
          <span className="text-xs font-mono text-primary">{txn.responseCode}</span>
          <span className="text-xs text-text-muted ml-1.5">
            {txn.responseDescription}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (txn: Transaction) => <StatusBadge status={txn.status} />,
    },
  ];

  const expandedRowContent = (txn: Transaction) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Processing Code
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.processingCode}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          STAN
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.stan}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          RRN
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.rrn}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Terminal ID
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.terminalId}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Merchant ID
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.merchantId}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Acquirer Code
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.acquirerCode}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Currency
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.currencyCode}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Transaction ID
        </p>
        <p className="text-sm font-mono text-text-primary">{txn.id}</p>
      </div>

      {/* Raw fields */}
      {Object.keys(txn.fields).length > 0 && (
        <div className="col-span-full mt-2 border-t border-border pt-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            Raw ISO 8583 Fields
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(txn.fields).map(([key, val]) => (
              <span
                key={key}
                className="text-xs bg-secondary px-2 py-1 rounded font-mono"
              >
                <span className="text-primary">DE-{key}</span>
                <span className="text-text-muted mx-1">:</span>
                <span className="text-text-secondary">{val}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search PAN, ID, description..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
          <Select
            placeholder="All Statuses"
            options={[
              { value: "approved", label: "Approved" },
              { value: "declined", label: "Declined" },
              { value: "error", label: "Error" },
              { value: "timeout", label: "Timeout" },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          />
          <Select
            placeholder="All MTI Types"
            options={[
              { value: "0100", label: "0100 — Authorization" },
              { value: "0200", label: "0200 — Financial" },
              { value: "0400", label: "0400 — Reversal" },
              { value: "0420", label: "0420 — Reversal Advice" },
              { value: "0800", label: "0800 — Network Mgmt" },
            ]}
            value={mtiFilter}
            onChange={(e) => {
              setMtiFilter(e.target.value);
              setPage(1);
            }}
          />
          <div className="flex items-end">
            <button
              className="text-xs text-primary hover:text-primary-light transition-colors"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setMtiFilter("");
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : result ? (
        <DataTable
          columns={columns}
          data={result.data}
          keyExtractor={(txn) => txn.id}
          page={result.page}
          totalPages={result.totalPages}
          onPageChange={setPage}
          expandableRow={expandedRowContent}
          emptyMessage="No transactions match your filters"
        />
      ) : null}
    </div>
  );
}
