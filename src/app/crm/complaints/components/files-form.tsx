import { Button } from "@/components/ui/button";
import { Trash2, Eye, Download, Loader2, Play, Volume2, File } from "lucide-react";
import React, { useState } from "react";
import DocumentUploader from "@/components/custom/document-uploader";
import { getImageUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import JSZip from 'jszip';
import Image from "next/image";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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

  const isVideo = (file: any) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  const isAudio = (file: any) => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.aac'];
    return audioExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  const isImage = (file: any) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  const getFileTypeIcon = (file: any) => {
    if (isVideo(file)) return <Play className="w-5 h-5" />;
    if (isAudio(file)) return <Volume2 className="w-5 h-5" />;
    if (isImage(file)) return <Eye className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const renderMediaThumbnail = (file: any) => {
    if (isVideo(file)) {
      return (
        <div className="relative h-32 bg-slate-100 rounded-md group">
          <video
            className="w-full h-full object-cover rounded-md"
          >
            <source src={getImageUrl(file.document_path)} />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
      );
    } else if (isAudio(file)) {
      return (
        <div className="relative h-32 bg-slate-100 rounded-md flex items-center justify-center group">
          <Volume2 className="w-16 h-16 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      );
    } else if (isImage(file)) {
      return (
        <div className="relative h-32 overflow-hidden rounded-md">
          <Image
            src={getImageUrl(file.document_path)}
            alt={file.file_name || "Image"}
            width={200}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            unoptimized={true}
          />
        </div>
      );
    } else {
      return (
        <div className="relative h-32 bg-slate-100 rounded-md flex items-center justify-center group">
          <File className="w-16 h-16 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      );
    }
  };

  const renderMediaPreview = (file: any) => {
    if (isVideo(file)) {
      return (
        <video
          controls
          className="w-full max-h-[70vh]"
        >
          <source src={getImageUrl(file.document_path)} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (isAudio(file)) {
      return (
        <div className="w-full p-8 bg-slate-50 rounded-lg">
          <audio
            controls
            className="w-full"
          >
            <source src={getImageUrl(file.document_path)} />
            Your browser does not support the audio tag.
          </audio>
          <div className="mt-4 flex justify-center">
            <Volume2 className="w-24 h-24 text-slate-400" />
          </div>
        </div>
      );
    } else if (isImage(file)) {
      return (
        <Image
          src={getImageUrl(file.document_path)}
          alt={file.file_name || "Image"}
          width={800}
          height={600}
          className="object-contain w-full max-h-[70vh]"
          unoptimized={true}
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
          <File className="w-24 h-24 text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium text-center">
            {file.file_name || "File"}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <DocumentUploader
        onDone={handleDocumentUpload}
        errorMessage={errors.files}
      />

      {Array.isArray(files) && files.length > 0 && (
        <Card className="border rounded-md shadow-sm">
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

            {viewMode === "grid" && (
              <ScrollArea className="h-96 w-full rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                  {files.map((file: any, index: number) => (
                    <Card key={index} className="border rounded-md overflow-hidden group relative">
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(index)}
                          onChange={() => toggleFileSelection(index)}
                          className="rounded-sm h-4 w-4"
                        />
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => setSelectedMedia(file)}
                      >
                        {renderMediaThumbnail(file)}
                      </div>

                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="truncate">
                            <p className="text-xs font-medium truncate max-w-[130px]" title={file.file_name}>
                              {file.file_name || `File ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file?.file_size
                                ? `${(file.file_size / 1024).toFixed(1)} KB`
                                : "N/A"}
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadFile(file);
                                    }}
                                    disabled={downloading}
                                  >
                                    {downloading ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Download className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFile(index);
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Remove</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            )}

            {viewMode === "table" && (
              <div className="rounded-md border">
                <ScrollArea className="h-96 w-full">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">
                          <input
                            type="checkbox"
                            checked={selectedFiles.length === files.length}
                            onChange={() => {
                              if (selectedFiles.length === files.length) {
                                setSelectedFiles([]);
                              } else {
                                setSelectedFiles(files.map((_, i) => i));
                              }
                            }}
                            className="rounded-sm"
                          />
                        </th>
                        <th className="p-2 text-left font-medium">ID</th>
                        <th className="p-2 text-left font-medium">Preview</th>
                        <th className="p-2 text-left font-medium">File Name</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Size</th>
                        <th className="p-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {files.map((file: any, index: number) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(index)}
                              onChange={() => toggleFileSelection(index)}
                              className="rounded-sm"
                            />
                          </td>
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">
                            <div
                              className="cursor-pointer relative group w-16 h-16 rounded-md overflow-hidden"
                              onClick={() => setSelectedMedia(file)}
                            >
                              {isImage(file) ? (
                                <Image
                                  src={getImageUrl(file.document_path)}
                                  alt={file.file_name || "Image"}
                                  width={64}
                                  height={64}
                                  unoptimized={true}
                                  className="object-cover w-full h-full hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full bg-slate-100">
                                  {getFileTypeIcon(file)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <p className="truncate max-w-[200px]" title={file.file_name}>
                              {file.file_name || `File ${index + 1}`}
                            </p>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1.5">
                              {getFileTypeIcon(file)}
                              <span>{file?.document_type || "N/A"}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            {file?.file_size
                              ? `${(file.file_size / 1024).toFixed(1)} KB`
                              : "N/A"}
                          </td>
                          <td className="flex gap-1 p-2 justify-end">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8"
                                    onClick={() => setSelectedMedia(file)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Preview</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8"
                                    onClick={() => handleDownloadFile(file)}
                                    disabled={downloading}
                                  >
                                    {downloading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8"
                                    onClick={() => handleRemoveFile(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Remove</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
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

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileTypeIcon(selectedMedia || {})}
              <span>{selectedMedia?.file_name || 'Media Preview'}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {selectedMedia && (
              <div className="relative w-full overflow-auto">
                {renderMediaPreview(selectedMedia)}
              </div>
            )}
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedMedia?.file_size
                ? `Size: ${(selectedMedia.file_size / 1024).toFixed(1)} KB`
                : ""}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(getImageUrl(selectedMedia?.document_path), '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="default"
                onClick={() => handleDownloadFile(selectedMedia)}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}