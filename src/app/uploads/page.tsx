"use client";

import { FileDropzone } from "@/components/upload/FileDropzone";
import { UploadHistory } from "@/components/upload/UploadHistory";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useFetch } from "@/hooks/useFetch";
import { getUploadHistory } from "@/services/api";

export default function UploadsPage() {
  const { data: uploads, loading, refetch } = useFetch(
    () => getUploadHistory(),
    []
  );

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <FileDropzone onUploadComplete={() => refetch()} />

      {/* Upload history */}
      {loading ? (
        <PageLoader />
      ) : uploads ? (
        <UploadHistory uploads={uploads} />
      ) : null}
    </div>
  );
}
