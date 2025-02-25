"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from 'lucide-react';
import { User } from '@/types';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { revalidate } from '@/actions/revalidate';
import { getImageUrl } from '@/lib/utils';
import { API_URL } from '@/lib/apiEndPoints';
import { Credenza, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from '@/components/custom/credenza';


export default function ProfileImageUploader({ userInfo }: { userInfo: User }) {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please select an image first');
            return;
        }
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append('profile_image', selectedFile);

            const response = await axios.post(`${API_URL}/update-profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDialogOpen(false);
                setSelectedImage(null);
                setSelectedFile(null);
                toast.success('Profile image updated successfully');
                revalidate({ path: "/" });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Failed to update profile image';
                toast.error(errorMessage);
                console.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
                console.error(error);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = () => {
        // Confirm before deleting
        if (window.confirm("Are you sure you want to remove your profile picture?")) {
            setSelectedImage(null);
            setSelectedFile(null);
            setDialogOpen(false);
        }
    };

    const resetSelection = () => {
        setSelectedImage(null);
        setSelectedFile(null);
    };

    return (
        <div className="max-w-md">
            {/* Profile Card */}
            <Card className="shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Profile picture</CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Customize your profile
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                            Edit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-gray-100">
                                {selectedImage ? (
                                    <AvatarImage src={selectedImage} alt="Profile" className="object-cover" />
                                ) : userInfo.profile_image ? (
                                    <AvatarImage src={getImageUrl(userInfo.profile_image)} alt="Profile" className="object-cover" />
                                ) : (
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {userInfo.full_name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </div>
                        <div>
                            <h3 className="font-medium">{userInfo.full_name}</h3>
                            <p className="text-sm text-gray-500">{userInfo.contact_email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upload Dialog */}
            <Credenza open={dialogOpen} onOpenChange={setDialogOpen}>
                <CredenzaContent className="sm:max-w-md">
                    <CredenzaHeader>
                        <CredenzaTitle>Update profile picture</CredenzaTitle>
                        <CredenzaDescription>
                            Upload a new profile picture. SVG, PNG, JPG or GIF (MAX. 800×800px).
                        </CredenzaDescription>
                    </CredenzaHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-32 w-32 border-4 border-gray-200 shadow-lg">
                                {selectedImage ? (
                                    <AvatarImage src={selectedImage} alt="Preview" className="object-cover" />
                                ) : userInfo.profile_image ? (
                                    <AvatarImage src={getImageUrl(userInfo.profile_image)} alt="Profile" className="object-cover" />
                                ) : (
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                                        {userInfo.full_name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {selectedFile ? (
                                <div className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Upload className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="truncate text-sm font-medium">{selectedFile.name}</div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={resetSelection}
                                        className="hover:bg-gray-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <Input
                                        id="picture"
                                        type="file"
                                        accept="image/png,image/jpeg,image/gif,image/svg+xml"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <label
                                            htmlFor="picture"
                                            className="flex items-center justify-center gap-2 cursor-pointer bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors"
                                        >
                                            <Upload className="h-5 w-5" />
                                            Choose File
                                        </label>
                                        <div className="text-center text-sm text-gray-500">
                                            No file chosen
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-center">
                            {selectedImage && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={handleDelete}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>

                        <CredenzaFooter className="flex justify-between gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!selectedFile || processing}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </CredenzaFooter>
                    </form>
                </CredenzaContent>
            </Credenza>
        </div>
    );
}