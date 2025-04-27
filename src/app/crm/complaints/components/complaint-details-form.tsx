"use client";;
import { dataTypeIds } from "@/types";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { TextareaInput } from "@/components/custom/TextareaInput";
import Vendors from "./vendors";
import { Badge } from "@/components/ui/badge";
import AssignedToTechnician from "./assigned-to-technician";

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
    <div className="p-4 space-y-6 bg-white rounded-lg shadow-sm dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <LabelInputContainer
          type="text"
          autoFocus
          id="brand-complaint-no"
          placeholder="Brand Complaint No"
          label="Brand Complaint No"
          value={data.brand_complaint_no}
          onChange={(e) =>
            setData({ ...data, brand_complaint_no: e.target.value })
          }
          errorMessage={errors.brand_complaint_no}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="SERIAL NUMBER IN"
          placeholder="SERIAL NUMBER IN"
          onChange={(e) => {
            const cursorPosition = e.target.selectionStart;
            const newValue = e.target.value.toUpperCase();
            setData({ ...data, serial_number_ind: newValue });
            // Maintain cursor position after uppercase conversion
            setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
          }}
          value={data.serial_number_ind}
          errorMessage={errors.serial_number_ind}
          className="transition-all duration-200 hover:shadow-md uppercase"
        />
        <LabelInputContainer
          label="SERIAL NUMBER OUT"
          placeholder="SERIAL NUMBER OUT"
          onChange={(e) => {
            const cursorPosition = e.target.selectionStart;
            const newValue = e.target.value.toUpperCase();
            setData({ ...data, serial_number_oud: newValue });
            // Maintain cursor position after uppercase conversion
            setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
          }}
          value={data.serial_number_oud}
          errorMessage={errors.serial_number_oud}
          className="transition-all duration-200 hover:shadow-md uppercase"
        />
        <LabelInputContainer
          label="MODEL NUMBER"
          placeholder="MODEL NUMBER"
          onChange={(e) => {
            const cursorPosition = e.target.selectionStart;
            const newValue = e.target.value.toUpperCase();
            setData({ ...data, model: newValue });
            // Maintain cursor position after uppercase conversion
            setTimeout(() => e.target.setSelectionRange(cursorPosition, cursorPosition), 0);
          }}
          value={data.model}
          errorMessage={errors.model}
          className="transition-all duration-200 hover:shadow-md uppercase"
        />
        <LabelInputContainer
          label="Extra Number"
          placeholder="Extra Number"
          onChange={(e) => setData({ ...data, extra_numbers: e.target.value })}
          value={data.extra_numbers}
          errorMessage={errors.extra_numbers}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          type="date"
          label="Date of Purchase"
          placeholder="Date of Purchase"
          onChange={(e) => setData({ ...data, p_date: e.target.value })}
          value={data.p_date}
          errorMessage={errors.p_date}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="MQ Number"
          placeholder="MQ Number"
          onChange={(e) => setData({ ...data, mq_nmb: e.target.value })}
          value={data.mq_nmb}
          errorMessage={errors.mq_nmb}
          className="transition-all duration-200"
        />
        <AssignedToTechnician technician={technician || []} data={data} setData={setData} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LabelInputContainer
          label="Amount"
          placeholder="Amount"
          onChange={(e) => setData({ ...data, amount: e.target.value })}
          value={data.amount}
          errorMessage={errors.amount}
          className="transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextareaInput
          label="Working Details"
          placeholder="Enter any additional details..."
          onChange={(e) =>
            setData({ ...data, working_details: e.target.value })
          }
          value={data.working_details}
          errorMessage={errors.working_details}
          className="min-h-[120px] transition-all duration-200"
          customizable={true}
        />
        <TextareaInput
          label="Additional Comment For Technition"
          placeholder="Enter the comment for technician"
          onChange={(e) =>
            setData({ ...data, comments_for_technician: e.target.value })
          }
          value={data.comments_for_technician}
          errorMessage={errors.comments_for_technician}
          className="min-h-[120px] transition-all duration-200"
          customizable={true}
        />
      </div>
      <Badge
        variant="outline"
        className="cursor-pointer"
        onClick={() => setData({ ...data, cancellation_reason: !data.cancellation_reason })}
      >
        {data.cancellation_reason ? "Cancel" : "Add Cancellation Reason"}
      </Badge>
      <TextareaInput
        label="Cancellation Details"
        placeholder="Enter the cancellation details"
        value={data.cancellation_details}
        errorMessage={errors.cancellation_details}
        className="min-h-[120px] transition-all duration-200"
        customizable={true}
      />

      <Vendors />
    </div >
  );
}
