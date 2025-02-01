"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  label?: string;
  description?: string;
  isMulti?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = "image/svg+xml,image/png,image/jpeg,image/gif,video/mp4,video/webm",
  maxSize,
  maxFiles,
  label,
  description,
  isMulti 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [previews, setPreviews] = React.useState<
    Array<{ url: string; type: string }>
  >([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = React.useCallback(
    (files: File[]) => {
      if (!isMulti && files.length > 1) {
        alert('Only one file can be selected');
        return;
      }

      if (maxFiles && previews.length + files.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles = files.filter((file) => {
        if (maxSize && file.size > maxSize) {
          alert(`File ${file.name} exceeds ${maxSize / (1024 * 1024)}MB`);
          return false;
        }
        if (!accept.split(",").some((type) => file.type.match(type.trim()))) {
          alert(`File ${file.name} has invalid type`);
          return false;
        }
        return true;
      });

      const newPreviews = newFiles.map((file) => {
        return new Promise<{ url: string; type: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              url: e.target?.result as string,
              type: file.type.startsWith("video") ? "video" : "image",
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then((results) => {
        if (!isMulti) {
          setPreviews(results.slice(0, 1));
          if (onFileSelect) {
            onFileSelect(newFiles.slice(0, 1));
          }
        } else {
          setPreviews((prev) => [...prev, ...results]);
          if (onFileSelect) {
            onFileSelect(newFiles);
          }
        }
      });
    },
    [maxSize, maxFiles, accept, onFileSelect, previews.length, isMulti],
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (onFileSelect && fileInputRef.current?.files) {
      const dt = new DataTransfer();
      const files = Array.from(fileInputRef.current.files);
      files.splice(index, 1);
      files.forEach((file) => dt.items.add(file));
      fileInputRef.current.files = dt.files;
      onFileSelect(files);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        className={`relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-50 p-4 text-slate-300 transition-colors duration-200 dark:bg-slate-800 ${isDragging ? "border-2 border-slate-600 bg-slate-700" : ""} `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          multiple={isMulti}
        />

        {previews.length > 0 ? (
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square w-full">
                {preview.type === "image" ? (
                  <Image
                    src={preview.url}
                    alt={`Uploaded file preview ${index + 1}`}
                    fill
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="h-full w-full rounded-xl object-cover"
                    controls
                  />
                )}
                <button
                  onClick={handleRemove(index)}
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                  aria-label="Remove uploaded file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Upload className="mb-3 h-8 w-8 text-slate-400" />
            <p className="mb-1 text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500">
              SVG, PNG, JPG, GIF, MP4 or WEBM
              {maxSize && ` (MAX. ${maxSize / (1024 * 1024)}MB)`}
            </p>
            {maxFiles && (
              <p className="text-xs text-slate-500">
                Maximum {maxFiles} files allowed
              </p>
            )}
          </>
        )}
      </div>
      {description && <p className="text-xs text-slate-500">{description}</p>}

    </div>
  );
}
