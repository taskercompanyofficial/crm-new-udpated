import React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Undo2, Redo2, Save, ClipboardCopyIcon } from "lucide-react";
import { SelectInput } from "@/components/custom/SelectInput";
import { CallStatusOptions, ComplaintStatusOptions, PriorityOptions } from "@/lib/otpions";
import SubmitBtn from "@/components/custom/submit-button";
import { Label } from '@/components/ui/label';
import CancelComplaint from '../../components/cancle-complaint';
import ProductReceipt from '../../components/generate-reciving';
import SendMessageCustomerBtn from '../../components/send-message-cutomer-btn';
import { Checkbox } from '@/components/ui/checkbox';
import { copyToClipboard } from '@/hooks/copy-to-clipboard';
import { GenerateBill } from '../../components/generate-bill';
import JobDone from './job-done';

interface ComplaintActionsProps {
  data: any;
  setData: (data: any) => void;
  hasUnsavedChanges: boolean;
  processing: boolean;
  onSubmit: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  username?: string;
  role?: string;
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  errors: any;
  id: number;
}

export default function ComplaintActions({
  data,
  setData,
  hasUnsavedChanges,
  processing,
  onSubmit,
  undo,
  redo,
  canUndo,
  canRedo,
  username = "",
  role = "",
  autoSaveEnabled,
  toggleAutoSave,
  errors,
  id,
}: ComplaintActionsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-muted shadow-sm">
      <div className="flex gap-4 w-full items-center p-2 justify-between">
        <div className="flex gap-1 md:gap-4">
          <strong className="text-sm font-bold">
            {data.complain_num}
          </strong>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-4 items-center">
          <div className="flex gap-2">
            <Label>Is Care Of Customer</Label>
            <Checkbox
              checked={data.is_care_of_customer}
              onCheckedChange={() => setData({ ...data, is_care_of_customer: !data.is_care_of_customer })}
              className="mr-2"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <Undo2 className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <Redo2 className="h-4 w-4 text-gray-600" />
          </Button>
          <SelectInput
            options={PriorityOptions}
            selected={data.priority}
            onChange={(e) => setData({ ...data, priority: e })}
            errorMessage={errors.priority}
          />
          <SelectInput
            options={ComplaintStatusOptions}
            selected={data.status}
            onChange={(e) => setData({ ...data, status: e })}
            errorMessage={errors.status}
          />
          <SelectInput
            options={CallStatusOptions}
            selected={data.call_status}
            onChange={(e) => setData({ ...data, call_status: e })}
            errorMessage={errors.call_status}
          />
        </div>
      </div>
      <div className="fixed inset-x-0 z-50 px-4 mx-auto bottom-4 w-fit">
        <div className="border rounded-lg shadow-lg bg-card flex gap-2 p-2">
          <CancelComplaint complaintId={id} />
          <ProductReceipt
            complaint={data}
            username={username}
            role={role}
          />
          <SendMessageCustomerBtn
            complaint={data}
            to={data.applicant_whatsapp}
            className="w-full"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(data)}
            disabled={processing}
          >
            <ClipboardCopyIcon className="w-4 h-4" />
          </Button>
          <GenerateBill complaint={data} />
          <JobDone complaint={data} onSubmit={onSubmit} />
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={autoSaveEnabled}
              onCheckedChange={toggleAutoSave}
              className="mr-2"
            />
            <SubmitBtn
              className={`w-full ${buttonVariants({ variant: "default" })} ${hasUnsavedChanges ? "animate-pulse ring-2 ring-blue-200" : ""
                }`}
              processing={processing}
              onClick={onSubmit}
            >
              <Save className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? "Save Changes*" : "Save Changes"}
            </SubmitBtn>

          </div>
        </div>
      </div>
    </div>
  );
}
