import { Button } from "@/components/ui/button";
import { Trash2, Eye, Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import DocumentUploader from "@/components/custom/document-uploader";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import myAxios from "@/lib/axios.config";
import { toast } from "react-toastify";

export default function FilesForm({
  data,
  setData,
  errors,
}: {
  data: any;
  setData: (data: any) => void;
  errors: any;
}) {
  const session = useSession();
  const token = session?.data?.user?.token;
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [downloading, setDownloading] = useState(false);

  const handleDocumentUpload = (files: any) => {
    if (files && files.length > 0) {
      // Parse files if they are JSON strings
      const existingFiles = Array.isArray(data.files)
        ? data.files
        : typeof data.files === "string"
          ? JSON.parse(data.files)
          : [];

      const updatedFiles = [...existingFiles, ...files];
      setData({ ...data, files: updatedFiles });
    }
  };

  const handleRemoveFile = (index: number) => {
    let currentFiles = data.files;
    if (typeof currentFiles === "string") {
      currentFiles = JSON.parse(currentFiles);
    }

    if (!Array.isArray(currentFiles)) return;

    const updatedFiles = currentFiles.filter(
      (_: any, i: number) => i !== index,
    );
    setData({ ...data, files: updatedFiles });
    setSelectedFiles(selectedFiles.filter(i => i !== index));
  };

  // Parse files if they are a JSON string
  const files =
    typeof data.files === "string" ? JSON.parse(data.files) : data.files || [];

  const handleDownloadFile = async (file: any) => {
    try {
      setDownloading(true);

      // Use axios with responseType blob to handle CORS
      const response = await myAxios.get(getImageUrl(file.document_path), {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Failed to download file. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSelected = async () => {
    try {
      setDownloading(true);
      for (const index of selectedFiles) {
        await handleDownloadFile(files[index]);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setDownloading(true);
      for (const file of files) {
        await handleDownloadFile(file);
      }
    } finally {
      setDownloading(false);
    }
  };

  const toggleFileSelection = (index: number) => {
    setSelectedFiles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      <DocumentUploader
        onDone={handleDocumentUpload}
        errorMessage={errors.files}
      />
      {Array.isArray(files) && files.length > 0 && (
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-1.5 text-left font-medium">Select</th>
                  <th className="p-1.5 text-left font-medium">ID</th>
                  <th className="p-1.5 text-left font-medium">Document Type</th>
                  <th className="p-1.5 text-left font-medium">File Name</th>
                  <th className="p-1.5 text-left font-medium">Preview</th>
                  <th className="p-1.5 text-left font-medium">Size</th>
                  <th className="p-1.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {files.map((file: any, index: number) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-1.5">
                      <input 
                        type="checkbox"
                        checked={selectedFiles.includes(index)}
                        onChange={() => toggleFileSelection(index)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-1.5">{index + 1}</td>
                    <td className="p-1.5">{file?.document_type || "N/A"}</td>
                    <td className="p-1.5 text-gray-600">
                      {file?.file_name || "N/A"}
                    </td>
                    <td className="p-1.5 text-gray-600">
                      {file?.document_path && (
                        <Link
                          href={getImageUrl(file.document_path)}
                          target="_blank"
                          className="flex items-center gap-1 p-1 rounded-lg w-fit bg-muted"
                        >
                          Preview <Eye className="w-4 h-4" />
                        </Link>
                      )}
                    </td>
                    <td className="p-1.5">
                      {file?.file_size
                        ? `${(file.file_size / 1024).toFixed(1)} KB`
                        : "N/A"}
                    </td>
                    <td className="space-x-1 p-1.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6"
                        onClick={() => handleDownloadFile(file)}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {Array.isArray(files) && files.length > 0 && (
          <>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={() => {
                setData({ ...data, files: [] });
                setSelectedFiles([]);
              }}
            >
              Clear All Files
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleDownloadAll}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download All
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleDownloadSelected}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Selected ({selectedFiles.length})
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
