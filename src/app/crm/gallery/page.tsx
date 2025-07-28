"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/apiEndPoints";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { FilePreviewDialog } from "../complaints/components/files-form/FilePreviewDialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";
import { warrantyTypeOptions } from "@/lib/otpions";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageData {
    id: number;
    document_type: string;
    document_path: string;
    file_name: string;
    file_size: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

interface ApiResponse {
    current_page: number;
    data: ImageData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export default function Gallery() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("all");

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['gallery'],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(`${API_URL}/gallery?page=${pageParam}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data: ApiResponse = await res.json();
            return data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.next_page_url ? Number(new URL(lastPage.next_page_url).searchParams.get('page')) : undefined;
        },
        enabled: !!token
    });

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (!token) return <div>Loading session...</div>;
    if (status === "error") return <div>Error fetching data</div>;

    const filteredImages = data?.pages.flatMap(page =>
        page.data.filter(image =>
            selectedType === "all" || image.document_type === selectedType
        )
    ) || [];

    const isVideo = (mimeType: string) => mimeType.startsWith('video/');

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {[...Array(16)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="aspect-square" />
                            <div className="p-1">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gallery</h1>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {warrantyTypeOptions.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: `rgb(${type.color})` }}
                                    />
                                    {type.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filteredImages.map((image: ImageData) => (
                    <Card
                        key={image.id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage(image)}
                    >
                        <div className="aspect-square relative">
                            {isVideo(image.mime_type) ? (
                                <div className="w-full h-full bg-black/10 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white/80" />
                                </div>
                            ) : (
                                <Image
                                    src={getImageUrl(image.document_path)}
                                    alt={image.file_name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="p-1">
                            <p className="text-xs truncate">{image.document_type}</p>
                            <p className="text-xs text-gray-500">{new Date(image.created_at).toLocaleDateString()}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div ref={observerTarget} className="h-10 mt-4">
                {isFetchingNextPage &&
                    <div className="flex justify-center">
                        <div className="animate-pulse flex space-x-4">
                            <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                }
            </div>

            {selectedImage && (
                <FilePreviewDialog
                    file={selectedImage}
                    downloading={downloading}
                    onClose={() => setSelectedImage(null)}
                    onDownload={() => { }}
                />
            )}
        </div>
    );
}
