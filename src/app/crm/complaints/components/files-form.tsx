import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import DocumentUploader from "@/components/custom/document-uploader";
import { useSession } from "next-auth/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FileGrid } from "./files-form/FileGrid";
import { FileTable } from "./files-form/FileTable";
import { FilePreviewDialog } from "./files-form/FilePreviewDialog";
import { useFileOperations } from "../hooks/useFileOperations";

export default function FilesForm({
  data,
  setData,
  errors,
  jobDone
}: {
  data: any;
  setData: (data: any) => void;
  errors: any;
  jobDone?: boolean;
}) {
  const session = useSession();
  const token = session?.data?.user?.token;
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const { downloading, handleDownloadFile, downloadFilesAsZip, downloadFilesAsZipFallback } = useFileOperations(token);

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
    if (jobDone) return;
    
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

  const handleDownloadSelected = async () => {
    const selectedFilesToDownload = selectedFiles.map(index => files[index]);
    if (selectedFilesToDownload.length > 1) {
      try {
        await downloadFilesAsZip(selectedFilesToDownload, data.complain_num);
      } catch (error) {
        await downloadFilesAsZipFallback(selectedFilesToDownload, data.complain_num);
      }
    } else if (selectedFilesToDownload.length === 1) {
      await handleDownloadFile(selectedFilesToDownload[0]);
    }
  };

  const handleDownloadAll = async () => {
    if (files.length > 1) {
      try {
        await downloadFilesAsZip(files, data.complain_num);
      } catch (error) {
        await downloadFilesAsZipFallback(files, data.complain_num);
      }
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
    <div className="space-y-6">
      {!jobDone && (
        <DocumentUploader
          onDone={handleDocumentUpload}
          errorMessage={errors.files}
        />
      )}

      {Array.isArray(files) && files.length > 0 && (
        <Card className="border rounded-md shadow-sm bg-background">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-sm">
                Uploaded Files ({files.length})
              </h3>
              <div className="flex items-center gap-2">
                <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as "grid" | "table")}>
                  <TabsList className="h-8">
                    <TabsTrigger value="grid" className="text-xs h-6">Grid</TabsTrigger>
                    <TabsTrigger value="table" className="text-xs h-6">Table</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {viewMode === "grid" ? (
              <FileGrid
                files={files}
                selectedFiles={selectedFiles}
                downloading={downloading}
                onFileSelect={toggleFileSelection}
                onFileDownload={handleDownloadFile}
                onFileRemove={handleRemoveFile}
                onFilePreview={setSelectedMedia}
                jobDone={jobDone}
              />
            ) : (
              <FileTable
                files={files}
                selectedFiles={selectedFiles}
                downloading={downloading}
                onFileSelect={toggleFileSelection}
                onFileDownload={handleDownloadFile}
                onFileRemove={handleRemoveFile}
                onFilePreview={setSelectedMedia}
                jobDone={jobDone}
              />
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {!jobDone && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setData({ ...data, files: [] });
                    setSelectedFiles([]);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear All Files
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleDownloadAll}
                disabled={downloading || files.length === 0}
              >
                {downloading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
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
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Download Selected ({selectedFiles.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <FilePreviewDialog
        file={selectedMedia}
        downloading={downloading}
        onClose={() => setSelectedMedia(null)}
        onDownload={handleDownloadFile}
      />
    </div>
  );
}