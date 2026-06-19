import type {
  DashboardMetrics,
  Transaction,
  UploadResponse,
  MissingElementsReport,
  ValidationSummary,
  TransactionFilters,
  PaginatedResponse,
  UploadEntry,
} from "@/types";

/* ============================================
   API SERVICE — Centralized backend calls
   Connected to Python FastAPI Backend
   ============================================ */

const BASE_URL = "http://localhost:8000/api/v1";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Fetch dashboard metrics */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return fetchApi<DashboardMetrics>("/dashboard");
}

/** Fetch paginated transaction list */
export async function getTransactions(
  filters?: TransactionFilters
): Promise<PaginatedResponse<Transaction>> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.mti) params.set("mti", filters.mti);
  if (filters?.dateFrom) params.set("date_from", filters.dateFrom);
  if (filters?.dateTo) params.set("date_to", filters.dateTo);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.pageSize) params.set("page_size", String(filters.pageSize));

  const query = params.toString();
  return fetchApi<PaginatedResponse<Transaction>>(
    `/transactions${query ? `?${query}` : ""}`
  );
}

/** Upload a log file */
export async function uploadLogFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json();
}

/** Get upload history */
export async function getUploadHistory(): Promise<UploadEntry[]> {
  return fetchApi<UploadEntry[]>("/upload/history");
}

/** Get missing elements report */
export async function getMissingElementsReport(): Promise<MissingElementsReport> {
  return fetchApi<MissingElementsReport>("/reports/missing-elements");
}

/** Get validation summary */
export async function getValidationSummary(): Promise<ValidationSummary> {
  return fetchApi<ValidationSummary>("/validations/summary");
}
