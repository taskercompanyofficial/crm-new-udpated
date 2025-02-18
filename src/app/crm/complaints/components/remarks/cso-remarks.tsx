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

interface User {
    id: number;
    full_name: string;
    username: string;
    role: string;
}

interface CsoRemark {
    id: number;
    complaint_id: number;
    remarks: string;
    user: User;
    created_at: string;
}

export default function CsoRemarks({ complaintId }: { complaintId: number }) {
    const [refetchRemarks, setRefetchRemarks] = useState(false);
    const [editingRemark, setEditingRemark] = useState<CsoRemark | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [remarkToDelete, setRemarkToDelete] = useState<number | null>(null);
    const session = useSession();
    const token = session.data?.user?.token || "";

    const fetchEndPoint = `https://api.taskercompany.com/api/crm/cso-remarks/${complaintId}`;
    const storeEndPoint = `https://api.taskercompany.com/api/crm/cso-remarks`;
    const {
        data: remarksData,
        error,
        isLoading,
    } = useFetch<CsoRemark[]>(
        fetchEndPoint,
        token,
        refetchRemarks
    );

    const { data, setData, errors, processing, post, reset, put } = useForm({
        remarks: "",
        complaint_id: complaintId,
    });

    const handleSubmitRemark = async () => {
        const method = editingRemark ? put : post;
        const endPoint = editingRemark ? `${storeEndPoint}/${editingRemark.id}` : storeEndPoint;
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
                    setEditingRemark(null);
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
            token,
        );
    };

    const handleEditRemark = (remark: CsoRemark) => {
        setEditingRemark(remark);
        setData({
            remarks: remark.remarks,
            complaint_id: remark.complaint_id
        });
    };

    const handleDeleteRemark = async (remarkId: number) => {
        try {
            const response = await fetch(`${storeEndPoint}/${remarkId}`, {
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
            setRemarkToDelete(null);
        } catch (error: any) {
            toast.error(error?.message);
        }
    };

    return (
        <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-semibold">
                CSO Remarks
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Add Remark
                    </label>
                    <TextareaInput
                        className="w-full rounded-md border border-gray-300 p-2"
                        rows={3}
                        placeholder="Enter your remarks here..."
                        value={data.remarks}
                        onChange={(e) =>
                            setData({ ...data, remarks: e.target.value })
                        }
                    />
                </div>

                <SubmitBtn
                    onClick={handleSubmitRemark}
                    className="w-full"
                    processing={processing}
                >
                    Submit Remark
                </SubmitBtn>

                <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">
                        Previous Remarks
                    </h3>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-white dark:bg-gray-800'>
                                    <TableHead>Remark</TableHead>
                                    <TableHead>CSO Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            <Loader className="mx-auto h-4 w-4 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : Array.isArray(remarksData) ? (
                                    remarksData.map((remark) => (
                                        <TableRow key={remark.id}>
                                            <TableCell>{remark.remarks}</TableCell>
                                            <TableCell>
                                                {remark.user.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(remark.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded"
                                                                onClick={() => handleEditRemark(remark)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Remark</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <TextareaInput
                                                                    className="w-full rounded-md border border-gray-300 p-2"
                                                                    rows={3}
                                                                    placeholder="Enter your remarks here..."
                                                                    value={data.remarks}
                                                                    onChange={(e) =>
                                                                        setData({ ...data, remarks: e.target.value })
                                                                    }
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>
                                                                <Button onClick={handleSubmitRemark}>Update Remark</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded text-red-500"
                                                                onClick={() => setRemarkToDelete(remark.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Delete Remark</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                                <p>Are you sure you want to delete this remark?</p>
                                                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => remarkToDelete && handleDeleteRemark(remarkToDelete)}
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
                                        <TableCell colSpan={4} className="text-center">
                                            No previous remarks found
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
