import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePreview } from "./FilePreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileGridProps {
  files: any[];
  selectedFiles: number[];
  downloading: boolean;
  onFileSelect: (index: number) => void;
  onFileDownload: (file: any) => void;
  onFileRemove: (index: number) => void;
  onFilePreview: (file: any) => void;
}

export const FileGrid = ({
  files,
  selectedFiles,
  downloading,
  onFileSelect,
  onFileDownload,
  onFileRemove,
  onFilePreview,
}: FileGridProps) => {
  return (
    <ScrollArea className="h-96 w-full rounded-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
        {files.map((file: any, index: number) => (
          <Card key={index} className="border rounded-md overflow-hidden group relative">
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedFiles.includes(index)}
                onChange={() => onFileSelect(index)}
                className="rounded-sm h-4 w-4"
              />
            </div>

            <div
              className="cursor-pointer"
              onClick={() => onFilePreview(file)}
            >
              <FilePreview file={file} />
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
                            onFileDownload(file);
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
                            onFileRemove(index);
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
  );
}; 