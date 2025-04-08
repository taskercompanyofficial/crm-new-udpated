import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, CheckCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useForm from "@/hooks/use-form";
import { API_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import SubmitBtn from "@/components/custom/submit-button";
import { useSession } from "next-auth/react";

export default function ComplaintSchedulerDialog({ id }: { id: number }) {
    const session = useSession();
    const token = session?.data?.user?.token;
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data, setData, processing, put, errors, reset } = useForm({
        complain_num: id,
        complaint_details: '',
        date: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        put(API_URL + '/complaints/schedule', {
            onSuccess: (response) => {
                toast.success(response.message)
                setIsSubmitted(true);
            },
            onError(error) {
                toast.error(error.message)
            }
        }, token);
    };


    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) reset();
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} variant='outline'>
                    <FileText className="mr-2 h-4 w-4" />
                    Schedule a Complaint
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule a Complaint</DialogTitle>
                    <DialogDescription>
                        Select a date and enter your complaint details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Selected Date:</label>
                            <div className="relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date ? format(new Date(data.date), "PPP") : "Select a date"}
                                </Button>

                                {isCalendarOpen && (
                                    <Card className="absolute z-10 mt-2">
                                        <CardContent className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.date ? new Date(data.date) : undefined}
                                                onSelect={(newDate) => {
                                                    setData('date', newDate?.toISOString() || '');
                                                    setIsCalendarOpen(false);
                                                }}
                                                className="rounded-md border"
                                                initialFocus
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                                {errors.date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="complaint" className="text-sm font-medium">Complaint Details:</label>
                            <Textarea
                                id="complaint"
                                placeholder="Please describe your complaint..."
                                value={data.complaint_details}
                                onChange={(e) => setData({ ...data, complaint_details: e.target.value })}
                                className="resize-none h-32"
                                required
                            />
                        </div>

                        {isSubmitted && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>
                                    Your complaint has been scheduled for {format(new Date(data.date), "PPP")}.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <SubmitBtn
                            type="submit"
                            processing={processing}
                        >
                            Schedule Complaint
                        </SubmitBtn>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}