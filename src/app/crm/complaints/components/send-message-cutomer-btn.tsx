import { Button } from "@/components/ui/button";
import { Loader2Icon, MessageCircleIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import useForm from "@/hooks/use-form";
import { API_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import { SelectInput } from "@/components/custom/SelectInput";
import { MessageTypeOptions } from "@/lib/otpions";
import { TextareaInput } from "@/components/custom/TextareaInput";
import SubmitBtn from "@/components/custom/submit-button";
import { useSession } from "next-auth/react";
import { Credenza, CredenzaContent, CredenzaTrigger } from "@/components/custom/credenza";

interface SendMessageCustomerBtnProps {
  className?: string;
  complaint: any;
  to: string;
}

export default function SendMessageCustomerBtn({
  className,
  complaint,
  to,
}: SendMessageCustomerBtnProps) {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const { data, setData, processing, post } = useForm({
    message_type: "auto_pay_reminder_2",
    complain_num: complaint.complain_num,
    applicant_name: complaint.applicant_name,
    applicant_phone: complaint.applicant_phone,
    applicant_adress: complaint.applicant_adress,
    description: complaint.description,
    status:
      complaint.status === "open"
        ? "Open"
        : complaint.status === "closed"
          ? "Closed"
          : "In Progress",
    remarks: "",
  });

  const handleSendMessage = () => {
    post(
      `${API_URL}/complaints/send-message-to-customer/${to}`,
      {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };

  const renderTemplatePreview = () => {
    if (data.message_type === "auto_pay_reminder_2") {
      return (
        <div className="p-3 bg-gray-100 border rounded-lg dark:bg-gray-800 sm:p-4 md:p-6">
          <h3 className="mb-2 text-sm font-semibold sm:text-base md:text-lg lg:text-xl">
            Hello {complaint.applicant_name}!
          </h3>
          <p className="text-xs sm:text-sm md:text-base">
            This is to inform you that the status of your complaint has been
            updated:
          </p>
          <ul className="mt-2 space-y-1 text-xs sm:text-sm md:text-base">
            <li>
              <strong>Complaint ID:</strong> {complaint.complain_num}
            </li>
            <li>
              <strong>Current Status:</strong> {complaint.status} {data.status}
            </li>
            <li className="">
              <strong>Remarks:</strong>{" "}
              <p className="text-xs sm:text-sm md:text-base">
                {data.remarks ? data.remarks : "No remarks"}
              </p>
            </li>
          </ul>
          <p className="mt-2 text-xs sm:mt-3 sm:text-sm md:mt-4 md:text-base">
            If you have any further questions or concerns, feel free to reach
            out to us.
          </p>
          <p className="text-xs sm:text-sm md:text-base">
            Thank you, and have a great day!
          </p>
        </div>
      );
    }

    return (
      <div className="p-3 bg-gray-100 border rounded-lg dark:bg-gray-800 sm:p-4 md:p-6">
        <h3 className="mb-2 text-sm font-semibold sm:text-base md:text-lg lg:text-xl">
          Dear {complaint.applicant_name},
        </h3>
        <p className="text-xs sm:text-sm md:text-base">
          Your complaint has been registered successfully.
        </p>
        <ul className="mt-2 space-y-1 text-xs sm:text-sm md:text-base">
          <li>
            <strong>Complaint No:</strong> {data.complain_num}
          </li>
          <li>
            <strong>Phone:</strong> {complaint.applicant_phone}
          </li>
          <li className="break-words">
            <strong>Address:</strong> {complaint.applicant_adress}
          </li>
          <li className="break-words">
            <strong>Fault:</strong> {complaint.description}
          </li>
        </ul>
        <p className="mt-2 text-xs sm:mt-3 sm:text-sm md:mt-4 md:text-base">
          Our technical team will contact you within 24 hours.
        </p>
      </div>
    );
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex min-w-[100px] items-center gap-1 text-xs sm:min-w-[120px] md:min-w-[140px] md:text-sm",
            className,
          )}
        >
          {processing ? (
            <>
              <Loader2Icon className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <MessageCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="w-[95vw] max-w-[500px] sm:w-[90vw] md:w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3 md:gap-4 md:p-4">
          Sending Message to {to}
          <SelectInput
            label="Message Type"
            options={MessageTypeOptions}
            selected={data.message_type}
            onChange={(value) => setData({ ...data, message_type: value })}
          />
          {renderTemplatePreview()}
          {data.message_type === "auto_pay_reminder_2" && (
            <div className="flex flex-col gap-2">
              <TextareaInput
                placeholder="Enter remarks"
                name="remarks"
                label="Remarks"
                rows={3}
                value={data.remarks}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
              />
            </div>
          )}
          <SubmitBtn
            processing={processing}
            onClick={handleSendMessage}
            className="w-full sm:w-auto"
          >Send Message</SubmitBtn>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
