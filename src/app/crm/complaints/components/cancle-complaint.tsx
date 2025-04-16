import { Credenza, CredenzaBody, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from '@/components/custom/credenza'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useForm from '@/hooks/use-form'
import React from 'react'

export default function CancelComplaint({ complaintId }: { complaintId: number }) {
    const { data, setData, processing, errors, put } = useForm({
        reason: '',
        details: ''
    })

    const handleSubmit = () => {
        put(`/api/complaints/${complaintId}/cancel`, {
            onSuccess: () => {
                window.location.href = `/complaints/${complaintId}`
            },
        })
    }

    return (
        <Credenza>
            <CredenzaTrigger>Cancel</CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>
                        Are you sure you want to cancel this complaint?
                    </CredenzaTitle>
                    <CredenzaDescription>
                        You can cancel this complaint at any time.
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className="space-y-4">
                    <Select onValueChange={(value) => setData({ ...data, reason: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="resolved">Issue Resolved</SelectItem>
                            <SelectItem value="duplicate">Duplicate Complaint</SelectItem>
                            <SelectItem value="mistake">Filed by Mistake</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>

                    <Textarea
                        placeholder="Please provide additional details about cancellation..."
                        className="min-h-[100px]"
                        value={data.details}
                        onChange={(e) => setData({ ...data, details: e.target.value })}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={processing || !data.reason || !data.details}
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                        {processing ? 'Canceling...' : 'Confirm Cancel'}
                    </button>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}
