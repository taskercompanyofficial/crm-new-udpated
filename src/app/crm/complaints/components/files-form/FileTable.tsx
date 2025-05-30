import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2, Eye, Play, Volume2, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { useFileTypes } from "../../hooks/useFileTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileTableProps {
  files: any[];
  selectedFiles: number[];
  downloading: boolean;
  onFileSelect: (index: number) => void;
  onFileDownload: (file: any) => void;
  onFileRemove: (index: number) => void;
  onFilePreview: (file: any) => void;
  jobDone?: boolean;
}

export const FileTable = ({
  files,
  selectedFiles,
  downloading,
  onFileSelect,
  onFileDownload,
  onFileRemove,
  onFilePreview,
  jobDone
}: FileTableProps) => {
  const { isVideo, isAudio, isImage } = useFileTypes();

  const getFileTypeIcon = (file: any) => {
    if (isVideo(file)) return <Play className="w-5 h-5" />;
    if (isAudio(file)) return <Volume2 className="w-5 h-5" />;
    if (isImage(file)) return <Eye className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
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
                      onFileSelect(-1); // Clear all
                    } else {
                      files.forEach((_, i) => onFileSelect(i));
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
                    onChange={() => onFileSelect(index)}
                    className="rounded-sm"
                  />
                </td>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div
                    className="cursor-pointer relative group w-16 h-16 rounded-md overflow-hidden"
                    onClick={() => onFilePreview(file)}
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
                          onClick={() => onFilePreview(file)}
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
                          onClick={() => onFileDownload(file)}
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

                  {!jobDone && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => onFileRemove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Remove</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
};