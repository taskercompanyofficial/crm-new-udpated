"use client";
import { dataTypeIds } from "@/types";
import { Form, Input, DatePicker, Badge } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Vendors from "./vendors";
import AssignedToTechnician from "./assigned-to-technician";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export default function ComplaintDetailsForm({
  data,
  setData,
  errors,
  technician,
}: {
  data: any;
  setData: (data: any) => void;
  errors: any;
  technician?: dataTypeIds[];
}) {

  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-sm dark:bg-slate-900">
      <Form layout="vertical">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <Form.Item
            label="Brand Complaint No"
            validateStatus={errors.brand_complaint_no ? "error" : ""}
            help={errors.brand_complaint_no}
          >
            <Input
              autoFocus
              placeholder="Brand Complaint No"
              value={data.brand_complaint_no}
              onChange={(e) => setData({ ...data, brand_complaint_no: e.target.value })}
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>

          <Form.Item
            label="SERIAL NUMBER IN"
            validateStatus={errors.serial_number_ind ? "error" : ""}
            help={errors.serial_number_ind}
          >
            <Input
              placeholder="SERIAL NUMBER IN"
              value={data.serial_number_ind}
              onChange={(e) => {
                const cursorPosition = e.target.selectionStart;
                const newValue = e.target.value.toUpperCase();
                setData({ ...data, serial_number_ind: newValue });
                setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
              }}
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            label="SERIAL NUMBER OUT"
            validateStatus={errors.serial_number_oud ? "error" : ""}
            help={errors.serial_number_oud}
          >
            <Input
              placeholder="SERIAL NUMBER OUT"
              value={data.serial_number_oud}
              onChange={(e) => {
                const cursorPosition = e.target.selectionStart;
                const newValue = e.target.value.toUpperCase();
                setData({ ...data, serial_number_oud: newValue });
                setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
              }}
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            label="MODEL NUMBER"
            validateStatus={errors.model ? "error" : ""}
            help={errors.model}
          >
            <Input
              placeholder="MODEL NUMBER"
              value={data.model}
              onChange={(e) => {
                const cursorPosition = e.target.selectionStart;
                const newValue = e.target.value.toUpperCase();
                setData({ ...data, model: newValue });
                setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
              }}
              className="transition-all duration-200 hover:shadow-md uppercase"
            />
          </Form.Item>

          <Form.Item
            label="Extra Number"
            validateStatus={errors.extra_numbers ? "error" : ""}
            help={errors.extra_numbers}
          >
            <Input
              placeholder="Extra Number"
              value={data.extra_numbers}
              onChange={(e) => setData({ ...data, extra_numbers: e.target.value })}
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>
          <Form.Item
            label="Date of Purchase"
            validateStatus={errors.p_date ? "error" : ""}
            help={errors.p_date}
          >
            <DatePicker
              style={{ width: '100%' }}
              value={data.p_date ? dayjs(data.p_date) : null}
              onChange={(date: Dayjs | null) => setData({ ...data, p_date: date?.format('YYYY-MM-DD') })}
              className="transition-all duration-200 hover:shadow-md"
            />
          </Form.Item>

          <Form.Item
            label="MQ Number"
            validateStatus={errors.mq_nmb ? "error" : ""}
            help={errors.mq_nmb}
          >
            <Input
              placeholder="MQ Number"
              value={data.mq_nmb}
              onChange={(e) => setData({ ...data, mq_nmb: e.target.value })}
              className="transition-all duration-200"
            />
          </Form.Item>

          <AssignedToTechnician technician={technician || []} data={data} setData={setData} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Form.Item
            label="Amount"
            validateStatus={errors.amount ? "error" : ""}
            help={errors.amount}
          >
            <Input
              placeholder="Amount"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
              className="transition-all duration-200"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Form.Item
            label="Working Details"
            validateStatus={errors.working_details ? "error" : ""}
            help={errors.working_details}
          >
            <TextArea
              placeholder="Enter any additional details..."
              value={data.working_details}
              onChange={(e) => setData({ ...data, working_details: e.target.value })}
              className="min-h-[120px] transition-all duration-200"
            />
          </Form.Item>

          <Form.Item
            label="Additional Comment For Technition"
            validateStatus={errors.comments_for_technician ? "error" : ""}
            help={errors.comments_for_technician}
          >
            <TextArea
              placeholder="Enter the comment for technician"
              value={data.comments_for_technician}
              onChange={(e) => setData({ ...data, comments_for_technician: e.target.value })}
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
          label="Cancellation Details"
          validateStatus={errors.cancellation_details ? "error" : ""}
          help={errors.cancellation_details}
        >
          <TextArea
            placeholder="Enter the cancellation details"
            value={data.cancellation_details}
            onChange={(e) => setData({ ...data, cancellation_details: e.target.value })}
            className="min-h-[120px] transition-all duration-200"
          />
        </Form.Item>

        <Vendors />
      </Form>
    </div>
  );
}
