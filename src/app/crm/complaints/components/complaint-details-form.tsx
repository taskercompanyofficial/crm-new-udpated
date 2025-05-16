"use client";
import { dataTypeIds } from "@/types";
import { Form, Input, DatePicker, Badge } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Vendors from "./vendors";
import AssignedToTechnician from "./assigned-to-technician";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface ComplaintFormData {
  brand_complaint_no: string;
  serial_number_ind: string;
  serial_number_oud: string;
  model: string;
  extra_numbers: string;
  p_date: string;
  mq_nmb: string;
  amount: string;
  working_details: string;
  comments_for_technician: string;
  cancellation_reason: boolean;
  cancellation_details: string;
}

export default function ComplaintDetailsForm({
  data,
  setData,
  errors,
  technician,
}: {
  data: ComplaintFormData;
  setData: (data: ComplaintFormData) => void;
  errors: Partial<Record<keyof ComplaintFormData, string>>;
  technician?: dataTypeIds[];
}) {
  const [form] = Form.useForm();

  const handleValuesChange = (_: any, allValues: ComplaintFormData) => {
    setData(allValues);
  };

  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-sm dark:bg-slate-900">
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
        onValuesChange={handleValuesChange}
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <Form.Item
            name="brand_complaint_no"
            label="Brand Complaint No"
            validateStatus={errors.brand_complaint_no ? "error" : ""}
            help={errors.brand_complaint_no}
          >
            <Input
              autoFocus
              placeholder="Brand Complaint No"
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>

          <Form.Item
            name="serial_number_ind"
            label="SERIAL NUMBER IN"
            validateStatus={errors.serial_number_ind ? "error" : ""}
            help={errors.serial_number_ind}
          >
            <Input
              placeholder="SERIAL NUMBER IN"
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            name="serial_number_oud"
            label="SERIAL NUMBER OUT"
            validateStatus={errors.serial_number_oud ? "error" : ""}
            help={errors.serial_number_oud}
          >
            <Input
              placeholder="SERIAL NUMBER OUT"
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            name="model"
            label="MODEL NUMBER"
            validateStatus={errors.model ? "error" : ""}
            help={errors.model}
          >
            <Input
              placeholder="MODEL NUMBER"
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            name="extra_numbers"
            label="Extra Number"
            validateStatus={errors.extra_numbers ? "error" : ""}
            help={errors.extra_numbers}
          >
            <Input
              placeholder="Extra Number"
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>

          <Form.Item
            name="p_date"
            label="Date of Purchase"
            validateStatus={errors.p_date ? "error" : ""}
            help={errors.p_date}
          >
            <DatePicker
              style={{ width: '100%' }}
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>

          <Form.Item
            name="mq_nmb"
            label="MQ Number"
            validateStatus={errors.mq_nmb ? "error" : ""}
            help={errors.mq_nmb}
          >
            <Input
              placeholder="MQ Number"
              className="transition-all duration-200"
            />
          </Form.Item>

          <AssignedToTechnician technician={technician || []} data={data} setData={setData} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Form.Item
            name="amount"
            label="Amount"
            validateStatus={errors.amount ? "error" : ""}
            help={errors.amount}
          >
            <Input
              placeholder="Amount"
              className="transition-all duration-200"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Form.Item
            name="working_details"
            label="Working Details"
            validateStatus={errors.working_details ? "error" : ""}
            help={errors.working_details}
          >
            <TextArea
              placeholder="Enter any additional details..."
              className="min-h-[120px] transition-all duration-200"
            />
          </Form.Item>

          <Form.Item
            name="comments_for_technician"
            label="Additional Comment For Technician"
            validateStatus={errors.comments_for_technician ? "error" : ""}
            help={errors.comments_for_technician}
          >
            <TextArea
              placeholder="Enter the comment for technician"
              className="min-h-[120px] transition-all duration-200"
            />
          </Form.Item>
        </div>

        <Badge
          status={data.cancellation_reason ? "processing" : "default"}
          text={data.cancellation_reason ? "Cancel" : "Add Cancellation Reason"}
          className="cursor-pointer"
          onClick={() => setData({ ...data, cancellation_reason: !data.cancellation_reason })}
        />

        <Form.Item
          name="cancellation_details"
          label="Cancellation Details"
          validateStatus={errors.cancellation_details ? "error" : ""}
          help={errors.cancellation_details}
        >
          <TextArea
            placeholder="Enter the cancellation details"
            className="min-h-[120px] transition-all duration-200"
          />
        </Form.Item>

        <Vendors />
      </Form>
    </div>
  );
}
