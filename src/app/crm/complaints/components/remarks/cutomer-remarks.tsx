import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useFetch from '@/hooks/usefetch';
import { useSession } from 'next-auth/react';
import useForm from '@/hooks/use-form';
import { toast } from 'react-toastify';
import { TextareaInput } from '@/components/custom/TextareaInput';
import SubmitBtn from '@/components/custom/submit-button';
import { Loader, Trash2, Edit } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ReviewType } from '@/types';

interface User {
    id: number;
    full_name: string;
    username: string;
    role: string;
}



export default function CustomerRemarks({ complaintId }: { complaintId: number }) {
    const [refetchRemarks, setRefetchRemarks] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewType | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
    const session = useSession();
    const token = session.data?.user?.token || "";

    const fetchEndPoint = `https://api.taskercompany.com/api/crm/complaint/customer-reviews/${complaintId}`;
    const storeEndPoint = `https://api.taskercompany.com/api/crm/customer-reviews`;
    const {
        data: reviewsData,
        error,
        isLoading,
    } = useFetch<ReviewType[]>(
        fetchEndPoint,
        token,
        refetchRemarks
    );

    const { data, setData, errors, processing, post, reset, put } = useForm({
        rating: 0,
        reason: "",
        comment: "",
        complaint_id: complaintId,
    });

    const handleSubmitReview = async () => {
        const method = editingReview ? put : post;
        const endPoint = editingReview ? `${storeEndPoint}/${editingReview.id}` : storeEndPoint;
        method(
            endPoint,
            {
                onSuccess: (response) => {
                    toast.success(response.message);
                    setRefetchRemarks(true);
                    setTimeout(() => {
                        setRefetchRemarks(false);
                    }, 1000);
                    reset();
                    setEditingReview(null);
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
            token,
        );
    };

    const handleEditReview = (review: ReviewType) => {
        setEditingReview(review);
        setData({
            rating: review.rating,
            reason: review.reason,
            comment: review.comment,
            complaint_id: review.complaint_id
        });
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            const response = await fetch(`${storeEndPoint}/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            toast.success(data.message);
            setRefetchRemarks(true);
            setTimeout(() => {
                setRefetchRemarks(false);
            }, 1000);
            setShowDeleteDialog(false);
            setReviewToDelete(null);
        } catch (error: any) {
            toast.error(error?.message);
        }
    };

    return (
        <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Customer Review
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Rating
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setData({ ...data, rating })}
                                className={`h-10 w-10 rounded-full border-2 transition-colors ${data.rating === rating
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-300 hover:border-blue-500"
                                    }`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                    {errors.rating && (
                        <p className="text-xs text-red-500">
                            {errors.rating}
                        </p>
                    )}
                </div>

                {data.rating <= 8 && data.rating > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Please tell us why:
                        </label>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Selection</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Primary Reason</TableCell>
                                    <TableCell>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={data.reason}
                                            onChange={(e) =>
                                                setData({ ...data, reason: e.target.value })
                                            }
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="service-quality">
                                                Service Quality
                                            </option>
                                            <option value="response-time">
                                                Response Time
                                            </option>
                                            <option value="technician-behavior">
                                                Technician Behavior
                                            </option>
                                            <option value="price">Price</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Additional Comments
                    </label>
                    <TextareaInput
                        className="w-full rounded-md border border-gray-300 p-2"
                        rows={3}
                        placeholder="Please provide any additional feedback..."
                        value={data.comment}
                        onChange={(e) =>
                            setData({ ...data, comment: e.target.value })
                        }
                    />
                </div>

                <SubmitBtn
                    onClick={handleSubmitReview}
                    className="w-full"
                    processing={processing}
                >
                    Submit Review
                </SubmitBtn>

                <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">
                        Previous Reviews
                    </h3>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-white dark:bg-gray-800'>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            <Loader className="mx-auto h-4 w-4 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : Array.isArray(reviewsData) ? (
                                    reviewsData.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>{review.rating}/10</TableCell>
                                            <TableCell className="capitalize">
                                                {review.reason?.replace("-", " ") || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {review.comment || "No comment"}
                                            </TableCell>
                                            <TableCell>
                                                {review.user.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded"
                                                                onClick={() => handleEditReview(review)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Review</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="flex flex-wrap gap-4">
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                                                                        <button
                                                                            key={rating}
                                                                            onClick={() => setData({ ...data, rating })}
                                                                            className={`h-10 w-10 rounded-full border-2 transition-colors ${data.rating === rating
                                                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                                : "border-gray-300 hover:border-blue-500"
                                                                                }`}
                                                                        >
                                                                            {rating}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {data.rating <= 8 && data.rating > 0 && (
                                                                    <select
                                                                        className="w-full rounded-md border border-gray-300 p-2"
                                                                        value={data.reason}
                                                                        onChange={(e) =>
                                                                            setData({ ...data, reason: e.target.value })
                                                                        }
                                                                    >
                                                                        <option value="">Select a reason</option>
                                                                        <option value="service-quality">Service Quality</option>
                                                                        <option value="response-time">Response Time</option>
                                                                        <option value="technician-behavior">Technician Behavior</option>
                                                                        <option value="price">Price</option>
                                                                        <option value="other">Other</option>
                                                                    </select>
                                                                )}
                                                                <TextareaInput
                                                                    className="w-full rounded-md border border-gray-300 p-2"
                                                                    rows={3}
                                                                    placeholder="Please provide any additional feedback..."
                                                                    value={data.comment}
                                                                    onChange={(e) =>
                                                                        setData({ ...data, comment: e.target.value })
                                                                    }
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>
                                                                <Button onClick={handleSubmitReview}>Update Review</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded text-red-500"
                                                                onClick={() => setReviewToDelete(review.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Delete Review</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                                <p>Are you sure you want to delete this review?</p>
                                                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No previous reviews found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
