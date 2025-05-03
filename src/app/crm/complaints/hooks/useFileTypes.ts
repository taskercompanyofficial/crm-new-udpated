export const useFileTypes = () => {
  const isVideo = (file: any) => {
    if (!file) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  const isAudio = (file: any) => {
    if (!file) return false;
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.aac'];
    return audioExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  const isImage = (file: any) => {
    if (!file) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext =>
      file.file_name?.toLowerCase().endsWith(ext) ||
      file.document_path?.toLowerCase().endsWith(ext)
    );
  };

  return {
    isVideo,
    isAudio,
    isImage
  };
}; 