/* ============================================
   Zustand Store — Analysis State Management
   ============================================ */

import { create } from 'zustand';
import type { AnalysisResult, UploadStatus } from '../types';

interface AnalysisState {
  // Upload state
  uploadStatus: UploadStatus;
  selectedFile: File | null;
  uploadTimestamp: string | null;

  // Analysis result
  result: AnalysisResult | null;
  error: string | null;

  // Actions
  setFile: (file: File) => void;
  setUploading: () => void;
  setResult: (result: AnalysisResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  uploadStatus: 'idle',
  selectedFile: null,
  uploadTimestamp: null,
  result: null,
  error: null,

  setFile: (file: File) =>
    set({
      selectedFile: file,
      uploadStatus: 'idle',
      result: null,
      error: null,
    }),

  setUploading: () =>
    set({
      uploadStatus: 'uploading',
      uploadTimestamp: new Date().toISOString(),
      error: null,
    }),

  setResult: (result: AnalysisResult) =>
    set({
      result,
      uploadStatus: 'completed',
      error: result.success ? null : result.error,
    }),

  setError: (error: string) =>
    set({
      uploadStatus: 'error',
      error,
    }),

  reset: () =>
    set({
      uploadStatus: 'idle',
      selectedFile: null,
      uploadTimestamp: null,
      result: null,
      error: null,
    }),
}));
