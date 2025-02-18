import { Button } from "@/components/ui/button";
import { Trash2, Eye, Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import DocumentUploader from "@/components/custom/document-uploader";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import JSZip from 'jszip';
import Image from "next/image";

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

  const files =
    typeof data.files === "string" ? JSON.parse(data.files) : data.files || [];

  const handleDownloadFile = async (file: any) => {
    try {
      setDownloading(true);

      const response = await fetch(getImageUrl(file.document_path), {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      saveAs(blob, file.file_name || "download");

    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Failed to download file. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadFilesAsZip = async (filesToDownload: any[]) => {
    try {
      setDownloading(true);
      const zip = new JSZip();

      for (const file of filesToDownload) {
        const response = await fetch(getImageUrl(file.document_path), {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        });

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        zip.file(file.file_name || `file_${Date.now()}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipName = data.complain_num ? `${data.complain_num}_files.zip` : 'files.zip';
      saveAs(zipBlob, zipName);

    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Failed to download files. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSelected = async () => {
    const selectedFilesToDownload = selectedFiles.map(index => files[index]);
    if (selectedFilesToDownload.length > 1) {
      await downloadFilesAsZip(selectedFilesToDownload);
    } else if (selectedFilesToDownload.length === 1) {
      await handleDownloadFile(selectedFilesToDownload[0]);
    }
  };

  const handleDownloadAll = async () => {
    if (files.length > 1) {
      await downloadFilesAsZip(files);
    } else if (files.length === 1) {
      await handleDownloadFile(files[0]);
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
                  <th className="p-1.5 text-left font-medium">File</th>
                  <th className="p-1.5 text-left font-medium">Document Type</th>
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
                    <td className="p-1.5">
                      <Image
                        src={getImageUrl(file.document_path)}
                        alt={file.file_name}
                        width={100}
                        height={100}
                        unoptimized={true}
                      />
                    </td>
                    <td className="p-1.5">{file?.document_type || "N/A"}</td>
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
