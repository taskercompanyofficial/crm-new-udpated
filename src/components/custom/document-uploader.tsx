"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { warrantyTypeOptions } from "@/lib/otpions";
import SubmitButton from "@/components/custom/submit-button";
import { Upload, Loader2, X, FilePlus, AlertCircle } from "lucide-react";
import { useUploadContext } from "@/providers/UploadContext";

interface ImageUploaderProps {
  onDone: (files: any) => void;
  errorMessage?: string;
  showFileList?: boolean;
}

export default function DocumentUploader({
  onDone,
  errorMessage = "",
  showFileList = true,
}: ImageUploaderProps) {
  const {
    status,
    progress,
    error: contextError,
    uploadFiles,
    cancelUpload,
    resetUploadState,
    uploadConfig,
  } = useUploadContext();

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isUploading = status === "uploading";

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Upload shortcut (Ctrl+Q or Command+Q)
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        if (status !== "uploading" && documentType && files.length > 0) {
          handleUpload();
        }
      }
      // Select files shortcut (Ctrl+U or Command+U)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      // Cancel shortcut (Escape)
      else if (e.key === 'Escape' && files.length > 0) {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [files, documentType, status]);

  // Reset state when upload is successful
  useEffect(() => {
    if (status === "success") {
      setFiles([]);
      setDocumentType("");
      setLocalError(null);
    }
  }, [status]);

  // Handle drag and drop events for the drop zone
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev + 1);
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev - 1);
      if (dragCounter - 1 === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      if (e.dataTransfer) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (validateFiles(droppedFiles)) {
          setFiles(droppedFiles);
          setLocalError(null);
        }
      }
    };

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, [dragCounter, uploadConfig]);

  // Handle global drop events (overlay)
  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter(prev => prev + 1);
      setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter(prev => prev - 1);
      if (dragCounter - 1 === 0) {
        setIsDragging(false);
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setDragCounter(0);

      if (e.dataTransfer) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (validateFiles(droppedFiles)) {
          setFiles(droppedFiles);
          setLocalError(null);
        }
      }
    };

    window.addEventListener('dragenter', handleGlobalDragEnter);
    window.addEventListener('dragleave', handleGlobalDragLeave);
    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragenter', handleGlobalDragEnter);
      window.removeEventListener('dragleave', handleGlobalDragLeave);
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, [dragCounter, uploadConfig]);

  const validateFiles = (filesToValidate: File[]) => {
    const maxSizeBytes = uploadConfig.maxFileSize * 1024 * 1024;

    // Check file size
    const oversizedFiles = filesToValidate.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(", ");
      const errorMsg = `Files exceeding ${uploadConfig.maxFileSize}MB: ${fileNames}`;
      setLocalError(errorMsg);
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      if (validateFiles(fileArray)) {
        setFiles(fileArray);
        setLocalError(null);
      }
      // Reset the input value to allow selecting the same file again
      event.target.value = "";
    }
  };

  const handleUpload = async () => {
    const result = await uploadFiles(files, documentType);
    if (result) {
      onDone(result);
    }
  };

  const handleCancel = () => {
    if (status === "uploading") {
      cancelUpload();
    }
    setFiles([]);
    setLocalError(null);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const displayError = localError || contextError || errorMessage;

  return (
    <>
      {isDragging && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
            <div className="mb-4 bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Upload className="w-10 h-10 text-primary mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Release to upload your documents
            </p>
            <div className="text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded p-2">
              Supported formats: {uploadConfig.allowedTypes.join(", ")}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Select
            value={documentType}
            onValueChange={setDocumentType}
            disabled={isUploading}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Warranty Documents</SelectLabel>
                {warrantyTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Other Documents</SelectLabel>
                <SelectItem value="other">Other Document</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div
            ref={dropZoneRef}
            className={`relative w-full flex-1 rounded border-2 border-dashed px-4 py-3 min-h-[45px] transition-all duration-200 ease-in-out ${isDragging
                ? "border-primary bg-primary/10 dark:bg-primary/20"
                : files.length > 0
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              multiple
              accept={uploadConfig.allowedTypes.join(",")}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              {files.length > 0 ? (
                <div className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4 text-green-500" />
                  <span>
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="text-center">
                    Drop files or click to select (Ctrl+U)
                  </span>
                </>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{progress}% Uploading...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <SubmitButton
              processing={isUploading}
              disabled={isUploading || !documentType || files.length === 0}
              onClick={handleUpload}
              className="flex-1 sm:flex-none"
            >
              Upload {files.length > 0 && `(${files.length})`}
            </SubmitButton>

            {files.length > 0 && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
                className="flex-1 sm:flex-none"
              >
                Cancel (Esc)
              </Button>
            )}
          </div>
        </div>

        {/* File list display */}
        {showFileList && files.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Selected files:
            </div>
            <div className="max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded text-sm"
                  >
                    <div className="flex items-center gap-2 truncate max-w-[80%]">
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Error display */}
        {displayError && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <p>{displayError}</p>
          </div>
        )}

        {/* Keyboard shortcuts help */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span className="font-medium">Shortcuts:</span> Upload (Ctrl+Q) · Select files (Ctrl+U) · Cancel (Esc)
        </div>
      </div>
    </>
  );
}