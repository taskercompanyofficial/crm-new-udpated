import React from "react";
import { Modal, Typography, Space, Divider, Button, Image } from "antd";
import { EyeOutlined, DownloadOutlined, LoadingOutlined, PlayCircleOutlined, SoundOutlined, FileOutlined } from "@ant-design/icons";
import { getImageUrl } from "@/lib/utils";
import { useFileTypes } from "../../hooks/useFileTypes";

const { Text } = Typography;

interface FilePreviewDialogProps {
  file: any;
  downloading: boolean;
  onClose: () => void;
  onDownload: (file: any) => void;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  file,
  downloading,
  onClose,
  onDownload,
}) => {
  const { isVideo, isAudio, isImage } = useFileTypes();

  const getFileTypeIcon = (file: any) => {
    if (isVideo(file)) return <PlayCircleOutlined style={{ fontSize: '16px' }} />;
    if (isAudio(file)) return <SoundOutlined style={{ fontSize: '16px' }} />;
    if (isImage(file)) return <EyeOutlined style={{ fontSize: '16px' }} />;
    return <FileOutlined style={{ fontSize: '16px' }} />;
  };

  // For images, use Ant Design's PreviewGroup with the "items" prop
  if (file && isImage(file)) {
    return (
      <Image.PreviewGroup
        items={[getImageUrl(file.document_path)]}
        preview={{
          visible: !!file,
          onVisibleChange: (visible) => {
            if (!visible) onClose();
          },
          destroyOnClose: true,
        }}
      >
        <Image
          width={400}
          src={getImageUrl(file.document_path)}
          alt={file.file_name || "Image"}
          style={{ maxHeight: '70vh', objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {file?.file_size
              ? `Size: ${(file.file_size / 1024).toFixed(1)} KB`
              : ""}
          </Text>
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => window.open(getImageUrl(file?.document_path), '_blank')}
            >
              Open in New Tab
            </Button>
            <Button
              type="primary"
              icon={downloading ? <LoadingOutlined /> : <DownloadOutlined />}
              onClick={() => onDownload(file)}
              disabled={downloading}
            >
              Download
            </Button>
          </Space>
        </div>
      </Image.PreviewGroup>
    );
  }

  // For non-image files, use the regular modal
  const renderMediaPreview = (file: any) => {
    if (isVideo(file)) {
      return (
        <video
          controls
          style={{ width: '100%', maxHeight: '70vh' }}
        >
          <source src={getImageUrl(file.document_path)} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio(file)) {
      return (
        <div style={{ width: '100%', padding: '32px', background: '#f9fafb', borderRadius: '8px' }}>
          <audio
            controls
            style={{ width: '100%' }}
          >
            <source src={getImageUrl(file.document_path)} />
            Your browser does not support the audio tag.
          </audio>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <SoundOutlined style={{ fontSize: '96px', color: '#94a3b8' }} />
          </div>
        </div>
      );
    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#f9fafb',
        borderRadius: '8px'
      }}>
        <FileOutlined style={{ fontSize: '96px', color: '#94a3b8', marginBottom: '16px' }} />
        <Text strong style={{ color: '#475569', textAlign: 'center' }}>
          {file?.file_name || "File"}
        </Text>
      </div>
    );
  };

  return (
    <Modal
      open={!!file}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose={true}
      title={
        <Space>
          {getFileTypeIcon(file)}
          <span>{file?.file_name || 'Media Preview'}</span>
        </Space>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {file && (
          <div style={{ position: 'relative', width: '100%', overflow: 'auto' }}>
            {renderMediaPreview(file)}
          </div>
        )}
      </div>
      <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          {file?.file_size
            ? `Size: ${(file.file_size / 1024).toFixed(1)} KB`
            : ""}
        </Text>
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => window.open(getImageUrl(file?.document_path), '_blank')}
          >
            Open in New Tab
          </Button>
          <Button
            type="primary"
            icon={downloading ? <LoadingOutlined /> : <DownloadOutlined />}
            onClick={() => onDownload(file)}
            disabled={downloading}
          >
            Download
          </Button>
        </Space>
      </div>
    </Modal>
  );
};