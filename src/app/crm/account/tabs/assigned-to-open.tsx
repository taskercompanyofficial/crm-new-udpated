"use client"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Modal, Button, Select, Alert } from 'antd';
import { API_URL } from '@/lib/apiEndPoints';
import axios from 'axios';
import { ComplaintStatusOptions } from '@/lib/otpions';

export default function AssignedToOpen() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const openAllComplaints = async () => {
        try {
            const response = await axios.post(`${API_URL}/complaints/open-all-complaints`, {
                statuses: selectedStatuses
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            setIsConfirmModalOpen(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedStatuses([]);
    };

    const handleConfirmOpen = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmCancel = () => {
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <Button type="default" onClick={showModal}>
                Open All Complaints
            </Button>
            <Modal
                title="Open All Complaints"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleConfirmOpen}
                        disabled={selectedStatuses.length === 0}
                    >
                        Continue
                    </Button>
                ]}
            >
                <Alert
                    message="Important Notice"
                    description="This action will open all complaints with the selected statuses that are assigned to technicians. Please select carefully."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
                <p>Select statuses to open complaints assigned to Technician:</p>
                <Select
                    mode="multiple"
                    style={{ width: '100%', marginTop: '16px' }}
                    placeholder="Select statuses"
                    onChange={(values) => setSelectedStatuses(values)}
                    options={ComplaintStatusOptions.map(status => ({
                        label: status.label,
                        value: status.value
                    }))}
                />
            </Modal>

            <Modal
                title="Confirm Action"
                open={isConfirmModalOpen}
                onCancel={handleConfirmCancel}
                footer={[
                    <Button key="back" onClick={handleConfirmCancel}>
                        Go Back
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={openAllComplaints}
                    >
                        Yes, Open All Selected Complaints
                    </Button>
                ]}
            >
                <Alert
                    message="Are you absolutely sure?"
                    description={`You are about to open all complaints with the following statuses: ${selectedStatuses.join(', ')}. This action cannot be undone.`}
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            </Modal>
        </>
    )
}
