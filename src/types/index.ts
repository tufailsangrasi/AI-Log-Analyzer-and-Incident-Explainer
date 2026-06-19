/* ============================================
   ISO 8583 Log Analyzer — TypeScript Interfaces
   ============================================ */

/** Dashboard KPI metrics */
export interface DashboardMetrics {
  totalTransactions: number;
  successRate: number;
  errorCount: number;
  avgResponseTime: number;
  transactionsOverTime: TimeSeriesPoint[];
  responseCodeDistribution: ResponseCodeEntry[];
  recentTransactions: Transaction[];
}

/** A single time-series data point for charts */
export interface TimeSeriesPoint {
  timestamp: string;
  label: string;
  value: number;
  successCount?: number;
  errorCount?: number;
}

/** Response code distribution entry */
export interface ResponseCodeEntry {
  code: string;
  label: string;
  count: number;
  percentage: number;
  color?: string;
}

/** A parsed ISO 8583 transaction */
export interface Transaction {
  id: string;
  timestamp: string;
  mti: string;
  pan: string;
  amount: string;
  currencyCode: string;
  responseCode: string;
  responseDescription: string;
  status: TransactionStatus;
  processingCode: string;
  stan: string;
  rrn: string;
  terminalId: string;
  merchantId: string;
  acquirerCode: string;
  fields: Record<string, string>;
}

export type TransactionStatus = "approved" | "declined" | "error" | "timeout" | "pending";

/** File upload response */
export interface UploadResponse {
  success: boolean;
  fileName: string;
  fileSize: number;
  transactionsParsed: number;
  errorsFound: number;
  uploadId: string;
  timestamp: string;
}

/** Upload history entry */
export interface UploadEntry {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: "completed" | "processing" | "failed";
  transactionsParsed: number;
  errorsFound: number;
}

/** Missing elements report */
export interface MissingElementsReport {
  totalTransactionsAnalyzed: number;
  missingElements: MissingElement[];
  fieldFrequency: FieldFrequencyEntry[];
  errorPatterns: ErrorPattern[];
}

export interface MissingElement {
  fieldNumber: number;
  fieldName: string;
  occurrences: number;
  severity: "critical" | "warning" | "info";
  description: string;
}

export interface FieldFrequencyEntry {
  fieldNumber: number;
  fieldName: string;
  presenceCount: number;
  presencePercentage: number;
}

export interface ErrorPattern {
  pattern: string;
  count: number;
  affectedTransactions: number;
  severity: "critical" | "warning" | "info";
}

/** Validation results */
export interface ValidationResult {
  fieldNumber: number;
  fieldName: string;
  value: string;
  rule: string;
  status: "pass" | "fail" | "warning";
  message: string;
}

export interface ValidationSummary {
  totalFieldsChecked: number;
  passCount: number;
  failCount: number;
  warningCount: number;
  passRate: number;
  results: ValidationResult[];
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/** Pagination */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Transaction filters */
export interface TransactionFilters {
  status?: TransactionStatus;
  mti?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
