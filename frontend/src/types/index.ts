/* ============================================
   ISO 8583 AI Analyzer — TypeScript Types
   ============================================ */

export interface FileInfo {
  name: string;
  size: number;
  size_display: string;
}

export interface AgentStage {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error: string;
}

export interface ValidationData {
  is_valid: boolean;
  file_type: string;
  encoding: string;
  has_iso_fields: boolean;
  line_count: number;
  errors: string[];
}

export interface ParseData {
  mti: string;
  bitmap: string;
  field_count: number;
  parse_errors: string[];
  is_parsed: boolean;
}

export interface IsoField {
  field_number: string;
  field_name: string;
  value: string;
  present: boolean;
}

export interface ExtractionData {
  fields: IsoField[];
  field_count: number;
  errors: string[];
}

export interface IdentificationData {
  transaction_type: string;
  confidence: string;
  identification_method: string;
  details: Record<string, string>;
}

export interface ExplanationData {
  transaction_type: string;
  response_code: string;
  response_meaning: string;
  status: string;
  stan: string;
  rrn: string;
  explanation_text: string;
}

export interface StorageData {
  record_id: string;
  fields_stored: number;
  storage_timestamp: string;
  database_status: string;
  is_stored: boolean;
  errors: string[];
}

export interface AnalysisResult {
  success: boolean;
  error: string;
  file_info: FileInfo;
  agents: AgentStage[];
  validation: ValidationData | null;
  parse: ParseData | null;
  extraction: ExtractionData | null;
  identification: IdentificationData | null;
  explanation: ExplanationData | null;
  storage: StorageData | null;
  raw_log: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
