import { useState } from 'react';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import JSZip from 'jszip';
import axios from 'axios';
import Env from '@/lib/env';

export const useFileOperations = (token: string | undefined) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadFile = async (file: any) => {
    try {
      setDownloading(true);

      const response = await axios({
        url: `${Env.API_URL}/api/download/files`,
        method: 'POST',
        responseType: 'blob', // Important for downloading binary data
        data: {
          files: [file.file_name] // Using file_name instead of document_path
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to download');
      }

      const blob = new Blob([response.data]);
      saveAs(blob, file.file_name || 'download');

    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download file.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadFilesAsZip = async (filesToDownload: any[], complainNum?: string) => {
    try {
      setDownloading(true);

      const response = await axios({
        url: `${Env.API_URL}/api/download/files`,
        method: 'POST',
        responseType: 'blob', // Critical
        data: {
          files: filesToDownload.map(file => file.file_name)
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to download zip');
      }

      const blob = new Blob([response.data], { type: 'application/zip' });
      const zipName = complainNum ? `${complainNum}_files.zip` : 'files.zip';
      saveAs(blob, zipName);

    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Failed to download files. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadFilesAsZipFallback = async (filesToDownload: any[], complainNum?: string) => {
    try {
      setDownloading(true);
      const zip = new JSZip();
      let successCount = 0;
      let failCount = 0;

      for (const file of filesToDownload) {
        try {
          const response = await axios({
            url: `${Env.API_URL}/api/download/files`,
            method: 'POST',
            responseType: 'blob', // Important
            data: {
              files: [file.file_name]
            },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            zip.file(file.file_name || `file_${Date.now()}`, response.data);
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`Error downloading ${file.file_name}:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipName = complainNum ? `${complainNum}_files.zip` : 'files.zip';
        saveAs(zipBlob, zipName);

        if (failCount > 0) {
          toast.warning(`${successCount} files zipped successfully. ${failCount} files could not be downloaded.`);
        } else {
          toast.success(`${successCount} files zipped successfully.`);
        }
      } else {
        toast.error("Failed to download any files.");
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Failed to download files. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloading,
    handleDownloadFile,
    downloadFilesAsZip,
    downloadFilesAsZipFallback
  };
};
