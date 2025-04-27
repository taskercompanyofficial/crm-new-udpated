import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaDescription,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/custom/credenza';
import { API_URL } from '@/lib/apiEndPoints';
import SearchSelect from '@/components/custom/search-select';
import SubmitBtn from '@/components/custom/submit-button';
import { TextareaInput } from '@/components/custom/TextareaInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useForm from '@/hooks/use-form';
import { dataTypeIds } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AssignedToTechnician({
    technician,
    data,
    setData,
}: {
    technician: dataTypeIds[]
    data: any
    setData: (data: any) => void
}) {
    const [selectedTechnician, setSelectedTechnician] = useState(data.technician);
    const { data: postData, setData: setPostData, processing, post, errors } = useForm({
        technician: data.technician,
        complaint_id: data.complain_num,
        additional_info: ''
    });

    useEffect(() => {
        setSelectedTechnician(data.technician);
    }, [data.technician]);

    const handleTechnicianChange = (value: string) => {
        setSelectedTechnician(value);
        setData({ ...data, technician: value });
    };

    const findTechnician = (techId: string | number) => {
        return technician.find(t =>
            String(t.value) === String(techId)
        )?.label || 'Select Technician';
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(API_URL + '/assigned-to-technician', {
            onSuccess: () => {
                toast.success('Technician assigned successfully');
            }
        });
    };

    return (
        <Credenza>
            <CredenzaTrigger className='w-full space-y-2'>
                <Label className='flex items-center gap-2'>
                    Assigned To Technician
                </Label>
                <Button variant='outline' className='flex items-center gap-2 w-full'>
                    {findTechnician(selectedTechnician)}
                </Button>
            </CredenzaTrigger>

            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>
                        Assigned To Technician
                    </CredenzaTitle>
                    <CredenzaDescription>
                        Select the technician to assign the complaint to.
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className='space-y-2 py-2'>
                    <form onSubmit={handleSubmit}>
                        <SearchSelect
                            options={technician}
                            label="Technician"
                            value={selectedTechnician}
                            onChange={handleTechnicianChange}
                            width='full'
                        />
                        <TextareaInput
                            label="Additional Info"
                            value={postData.additional_info}
                            onChange={(e) => setPostData({ ...postData, additional_info: e.target.value })}
                            placeholder='Enter additional info'
                        />
                        <SubmitBtn processing={processing} className='w-full'>
                            {selectedTechnician ? 'Update Technician' : 'Assign Technician'}
                        </SubmitBtn>
                    </form>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}