import { Credenza, CredenzaBody, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from '@/components/custom/credenza'
import { Button } from '@/components/ui/button'
import { LabelInputContainer } from '@/components/ui/LabelInputContainer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useForm from '@/hooks/use-form'
import { API_URL } from '@/lib/apiEndPoints'
import { X } from 'lucide-react'
import React, { ChangeEvent } from 'react'
import { toast } from 'react-toastify'

export default function CancelComplaint({ complaintId }: { complaintId: number }) {
    const { data, setData, processing, errors, put } = useForm({
        reason: '',
        details: '',
        file: null as File | null
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, file: e.target.files[0] })
        }
    }

    const handleSubmit = () => {
        const formData = new FormData()
        formData.append('reason', data.reason)
        formData.append('details', data.details)
        if (data.file) {
            formData.append('file', data.file)
        }

        put(API_URL + `/crm/complaints/cancel/${complaintId}`, {
            onSuccess: (response) => {
                toast.success(response.message)
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    return (
        <Credenza>
            <CredenzaTrigger>
                <Button variant="destructive" size="icon">
                    <X className='h-4 w-4' />
                </Button>
            </CredenzaTrigger>
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
                    <LabelInputContainer
                        label='Attach File'
                        type='file'
                        onChange={handleFileChange}
                    />
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
