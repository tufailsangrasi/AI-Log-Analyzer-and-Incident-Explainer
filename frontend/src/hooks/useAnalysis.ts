/* ============================================
   useAnalysis Hook — React Query + Zustand
   ============================================ */

import { useMutation } from '@tanstack/react-query';
import { uploadAndAnalyze } from '../services/api';
import { useAnalysisStore } from '../store/analysisStore';

export function useAnalysis() {
  const store = useAnalysisStore();

  const mutation = useMutation({
    mutationFn: uploadAndAnalyze,
    onMutate: () => {
      store.setUploading();
    },
    onSuccess: (data) => {
      store.setResult(data);
    },
    onError: (error: Error) => {
      store.setError(error.message || 'Analysis failed. Please try again.');
    },
  });

  const handleUpload = (file: File) => {
    store.setFile(file);
    mutation.mutate(file);
  };

  return {
    handleUpload,
    isLoading: mutation.isPending,
    ...store,
  };
}
