import { Button } from "@/components/ui/button";
import { Eye, Download, Loader2, Play, Volume2, File } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { useFileTypes } from "../../hooks/useFileTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FilePreviewDialogProps {
  file: any;
  downloading: boolean;
  onClose: () => void;
  onDownload: (file: any) => void;
}

export const FilePreviewDialog = ({
  file,
  downloading,
  onClose,
  onDownload,
}: FilePreviewDialogProps) => {
  const { isVideo, isAudio, isImage } = useFileTypes();

  const getFileTypeIcon = (file: any) => {
    if (isVideo(file)) return <Play className="w-5 h-5" />;
    if (isAudio(file)) return <Volume2 className="w-5 h-5" />;
    if (isImage(file)) return <Eye className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
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
    }

    if (isAudio(file)) {
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
    }

    if (isImage(file)) {
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
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
        <File className="w-24 h-24 text-slate-400 mb-4" />
        <p className="text-slate-600 font-medium text-center">
          {file.file_name || "File"}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileTypeIcon(file)}
            <span>{file?.file_name || 'Media Preview'}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {file && (
            <div className="relative w-full overflow-auto">
              {renderMediaPreview(file)}
            </div>
          )}
        </div>
        <DialogFooter className="flex sm:justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {file?.file_size
              ? `Size: ${(file.file_size / 1024).toFixed(1)} KB`
              : ""}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(getImageUrl(file?.document_path), '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="default"
              onClick={() => onDownload(file)}
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
  );
}; 