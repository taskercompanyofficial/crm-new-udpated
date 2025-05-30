import { useState, useEffect } from 'react';
import { Button, Modal, Select, Form, Input } from 'antd';
import { API_URL } from '@/lib/apiEndPoints';
import useForm from '@/hooks/use-form';
import { dataTypeIds } from '@/types';
import { toast } from 'react-toastify';

export default function AssignedToTechnician({
    technician,
    data,
    setData,
    disabled,
}: {
    technician: dataTypeIds[]
    data: any
    setData: (data: any) => void
    disabled: boolean
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleSubmit = () => {
        post(API_URL + '/assigned-to-technician', {
            onSuccess: () => {
                toast.success('Technician assigned successfully');
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div>
            <div className="space-y-2">
                <label>Assigned To Technician</label>
                <Button 
                    block
                    onClick={() => !disabled && setIsModalOpen(true)}
                    disabled={disabled}
                >
                    {findTechnician(selectedTechnician)}
                </Button>
            </div>

            <Modal
                title="Assign Technician"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
                okButtonProps={{ loading: processing }}
                okText={selectedTechnician ? 'Update Technician' : 'Assign Technician'}
            >
                <Form layout="vertical">
                    <Form.Item label="Technician" >
                        <Select
                            showSearch
                            value={selectedTechnician}
                            onChange={handleTechnicianChange}
                            options={technician}
                            placeholder="Select Technician"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            autoFocus={true}
                        />
                    </Form.Item>

                    <Form.Item label="Additional Info">
                        <Input.TextArea
                            value={postData.additional_info}
                            onChange={(e) => setPostData({ ...postData, additional_info: e.target.value })}
                            placeholder="Enter additional info"
                            rows={4}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}