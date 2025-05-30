import { Play, Volume2, File } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useFileTypes } from "../../hooks/useFileTypes";
import { Image } from "antd";

interface FilePreviewProps {
  file: any;
  className?: string;
}

export const FilePreview = ({ file, className = "" }: FilePreviewProps) => {
  const { isVideo, isAudio, isImage } = useFileTypes();

  if (isVideo(file)) {
    return (
      <div className={`relative h-32 bg-slate-100 rounded-md group ${className}`}>
        <video className="w-full h-full object-cover rounded-md">
          <source src={getImageUrl(file.document_path)} />
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
          <Play className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  if (isAudio(file)) {
    return (
      <div className={`relative h-32 bg-slate-100 rounded-md flex items-center justify-center group ${className}`}>
        <Volume2 className="w-16 h-16 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    );
  }

  if (isImage(file)) {
    return (
      <div className={`relative h-32 overflow-hidden rounded-md ${className}`}>
        <Image
          src={getImageUrl(file.document_path)}
          alt={file.file_name || "Image"}
          width={200}
          height={200}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  return (
    <div className={`relative h-32 bg-slate-100 rounded-md flex items-center justify-center group ${className}`}>
      <File className="w-16 h-16 text-slate-400 group-hover:text-slate-600 transition-colors" />
    </div>
  );
}; 