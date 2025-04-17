import React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Undo2, Redo2, Save } from "lucide-react";
import { SelectInput } from "@/components/custom/SelectInput";
import { CallStatusOptions, ComplaintStatusOptions, PriorityOptions } from "@/lib/otpions";
import SubmitBtn from "@/components/custom/submit-button";
import ProductReceipt from "../components/generate-reciving";
import SendMessageCustomerBtn from "../components/send-message-cutomer-btn";
import { Checkbox } from "@/components/ui/checkbox";
import ComplaintSchedulerDialog from '../components/sceduale';
import CancelComplaint from '../components/cancle-complaint';
import { Label } from '@/components/ui/label';

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
  errors,
  id,
  autoSaveEnabled,
  toggleAutoSave,
}: ComplaintActionsProps) {
  return (
    <>
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm w-full px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
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
          </div>

          <div className="flex flex-wrap gap-3 items-center">
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
            <CancelComplaint complaintId={id} />
            <ProductReceipt complaint={data} username={username} role={role} />
            <SendMessageCustomerBtn
              complaint={data}
              to={data.applicant_whatsapp}
              className="w-full"
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

          <div className="flex items-center gap-2">
            <Checkbox
              checked={autoSaveEnabled}
              onChange={toggleAutoSave}
              className="mr-1"
            />
            <Label>Auto Save</Label>
          </div>
        </div>
      </div>
      {/* Scheduler Dialog can be outside of sticky */}
      <ComplaintSchedulerDialog id={id} />
    </>
  );
}
