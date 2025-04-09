"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadContextType {
    // State
    status: UploadStatus;
    progress: number;
    error: string | null;

    // Methods
    uploadFiles: (files: File[], documentType: string) => Promise<any>;
    cancelUpload: () => void;
    resetUploadState: () => void;

    // Configuration
    setUploadConfig: (config: Partial<UploadConfigType>) => void;
    uploadConfig: UploadConfigType;
}

interface UploadConfigType {
    maxFileSize: number; // in MB
    allowedTypes: string[];
    uploadEndpoint: string;
}

const defaultConfig: UploadConfigType = {
    maxFileSize: 100, // 100MB
    allowedTypes: ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"],
    uploadEndpoint: "/upload-image",
};

// Create the context with a default value
const UploadContext = createContext<UploadContextType | undefined>(undefined);

// Provider component
export function UploadProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const token = session.data?.user?.token || "";

    const [status, setStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [uploadConfig, setUploadConfigState] = useState<UploadConfigType>(defaultConfig);

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                resetUploadState();
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    // Method to configure upload settings
    const setUploadConfig = useCallback((config: Partial<UploadConfigType>) => {
        setUploadConfigState(prevConfig => ({
            ...prevConfig,
            ...config,
        }));
    }, []);

    // Method to upload files
    const uploadFiles = useCallback(async (files: File[], documentType: string) => {
        if (!files.length) {
            toast.error("Please select files to upload");
            return null;
        }

        if (!documentType) {
            toast.error("Please select a document type");
            return null;
        }

        // Validate file sizes
        const maxSizeBytes = uploadConfig.maxFileSize * 1024 * 1024;
        const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
        if (oversizedFiles.length > 0) {
            const errorMsg = `Some files exceed the maximum size limit of ${uploadConfig.maxFileSize}MB`;
            setError(errorMsg);
            toast.error(errorMsg);
            return null;
        }

        // Start upload process
        setStatus("uploading");
        setProgress(0);
        setError(null);

        try {
            if (!token) {
                throw new Error("Authentication token is missing");
            }

            const uploadData = new FormData();
            files.forEach((file) => {
                uploadData.append("files[]", file);
            });
            uploadData.append("document_type", documentType);

            const response = await axios.post(API_URL + uploadConfig.uploadEndpoint, uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setProgress(progress);
                },
            });

            if (response.data && response.data.data) {
                setStatus("success");
                toast.success(`${files.length} file(s) uploaded successfully`);
                return response.data.data;
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during upload";
            setError(errorMessage);
            setStatus("error");
            toast.error(errorMessage);
            console.error("Upload failed:", error);
            return null;
        }
    }, [token, uploadConfig]);

    // Method to cancel upload
    const cancelUpload = useCallback(() => {
        // This function would ideally cancel the axios request
        // For now, we'll just reset the state
        setStatus("idle");
        setProgress(0);
        setError(null);
    }, []);

    // Method to reset upload state
    const resetUploadState = useCallback(() => {
        setStatus("idle");
        setProgress(0);
        setError(null);
    }, []);

    // Create the context value
    const contextValue: UploadContextType = {
        status,
        progress,
        error,
        uploadFiles,
        cancelUpload,
        resetUploadState,
        setUploadConfig,
        uploadConfig,
    };

    return (
        <UploadContext.Provider value={contextValue}>
            {children}
        </UploadContext.Provider>
    );
}

export function useUploadContext() {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error("useUploadContext must be used within an UploadProvider");
    }
    return context;
}