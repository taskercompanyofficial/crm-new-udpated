import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';

interface JobDoneProps {
    complaint: any;
    onSubmit: () => void;
}

export default function JobDone({ complaint, onSubmit }: JobDoneProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleJobDone = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirm = () => {
        onSubmit();
        setShowConfirmDialog(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={handleJobDone}
                icon={<CheckOutlined />}
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
            >
            </Button>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircleOutlined className="text-xl" />
                        <span>Confirm Job Completion</span>
                    </div>
                }
                open={showConfirmDialog}
                onOk={handleConfirm}
                onCancel={() => setShowConfirmDialog(false)}
                okText={<div className="flex items-center gap-1"><CheckOutlined />Confirm</div>}
                cancelText={<div className="flex items-center gap-1"><CloseCircleOutlined />Cancel</div>}
                okButtonProps={{
                    className: "bg-green-500 hover:bg-green-600",
                    type: "primary"
                }}
                centered
            >
                <div className="py-4">
                    <p className="text-gray-600 mb-2">
                        Are you sure you want to mark this job as complete? This action cannot be undone.
                    </p>
                    <p className="font-semibold">
                        Complaint Number: <span className="text-blue-500">{complaint?.complain_num}</span>
                    </p>
                </div>
            </Modal>
        </div>
    );
}
