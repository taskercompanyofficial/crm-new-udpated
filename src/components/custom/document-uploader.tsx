"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useSession } from "next-auth/react";
import { warrantyTypeOptions } from "@/lib/otpions";
import axios from "axios";
import { API_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import SubmitButton from "@/components/custom/submit-button";
import { Upload } from "lucide-react";

interface DocumentUploaderProps {
  onDone: (files: any) => void;
  errorMessage: string;
}

export default function DocumentUploader({
  onDone,
  errorMessage,
}: DocumentUploaderProps) {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    files: [] as File[],
    document_type: "",
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + U to trigger file upload
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        if (!isUploading && formData.document_type) {
          handleFileUpload();
        }
      }
      // Esc to cancel upload
      if (e.key === 'Escape' && formData.files.length > 0) {
        e.preventDefault();
        handleCancelUpload();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [formData, isUploading]);

  const handleFileUpload = async () => {
    setIsUploading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const uploadData = new FormData();
      formData.files.forEach((file) => {
        uploadData.append("files[]", file);
      });
      uploadData.append("document_type", formData.document_type);

      const response = await axios.post(API_URL + "/upload-image", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data && response.data.data[0]) {
        onDone(response.data.data);
        toast.success("File uploaded successfully");
        setFormData({
          files: [],
          document_type: "",
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during upload";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const validateFiles = (files: File[]) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      setError("Some files exceed the maximum size limit of 10MB");
      toast.error("Some files exceed the maximum size limit of 10MB");
      return false;
    }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (validateFiles(fileArray)) {
        setFormData((prev) => ({
          ...prev,
          files: fileArray,
        }));
        setError(null);
      }
      event.target.value = "";
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (validateFiles(droppedFiles)) {
      setFormData((prev) => ({
        ...prev,
        files: droppedFiles,
      }));
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleCancelUpload = () => {
    setFormData({
      files: [],
      document_type: "",
    });
    setError(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select
          value={formData.document_type}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              document_type: value,
            }))
          }
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
          className={`relative w-full flex-1 rounded border-2 border-dashed px-4 py-2 sm:py-1 min-h-[40px] sm:h-8 transition-colors ${isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            onChange={handleFileSelect}
            multiple
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Upload className="w-4 h-4" />
            <span className="text-center">
              {formData.files.length
                ? `${formData.files.length} file(s) selected`
                : "Drop files here or click to select (Ctrl+U to upload, Esc to cancel)"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <SubmitButton
            processing={isUploading}
            disabled={isUploading || !formData.document_type}
            onClick={handleFileUpload}
            className="flex-1 sm:flex-none"
          >
            Upload (Ctrl+U)
          </SubmitButton>

          {formData.files.length > 0 && (
            <Button
              variant="outline"
              onClick={handleCancelUpload}
              disabled={isUploading}
              className="flex-1 sm:flex-none"
            >
              Cancel (Esc)
            </Button>
          )}
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
