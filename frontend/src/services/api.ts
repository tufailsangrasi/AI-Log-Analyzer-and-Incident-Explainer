/* ============================================
   API Service Layer
   ============================================ */

import axios from 'axios';
import type { AnalysisResult } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 120_000, // 2 minutes for large files
});

export async function uploadAndAnalyze(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<AnalysisResult>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function healthCheck(): Promise<{ status: string; database: string }> {
  const response = await api.get('/health');
  return response.data;
}
