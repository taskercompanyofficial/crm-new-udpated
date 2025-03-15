import React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { SelectInput } from "@/components/custom/SelectInput";
import { CallStatusOptions, ComplaintStatusOptions } from "@/lib/otpions";
import SubmitBtn from "@/components/custom/submit-button";
import ProductReceipt from "../components/generate-reciving";
import SendMessageCustomerBtn from "../components/send-message-cutomer-btn";
import { Checkbox } from "@/components/ui/checkbox";
import SearchSelect from '@/components/custom/search-select';

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
  complaintNumber?: string;
  username?: string;
  role?: string;
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  errors: any;
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
  complaintNumber,
  username = "",
  role = "",
  autoSaveEnabled,
  toggleAutoSave,
  errors
}: ComplaintActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {complaintNumber}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <SelectInput
        options={CallStatusOptions}
        selected={data.call_status}
        onChange={(e) => setData({ ...data, call_status: e })}
        errorMessage={errors.call_status}
      />
      <div className="w-full md:w-auto">
        <SelectInput
          options={ComplaintStatusOptions}
          selected={data.status}
          onChange={(e) => setData({ ...data, status: e })}
          errorMessage={errors.status}
        />
      </div>
      <div className="flex items-center gap-2">
        <ProductReceipt
          complaint={data}
          username={username}
          role={role}
        />
        <SendMessageCustomerBtn
          complaint={data}
          to={data.applicant_whatsapp}
        />
        <div className="flex items-center gap-1">
          <Checkbox
            id="auto-save"
            checked={autoSaveEnabled}
            onCheckedChange={toggleAutoSave}
          />
          <label
            htmlFor="auto-save"
            className="text-sm text-muted-foreground"
          >
            Auto Save
          </label>
        </div>
        <SubmitBtn
          className={`${buttonVariants({ effect: "shineHover" })} w-full md:w-auto ${hasUnsavedChanges ? "animate-pulse" : ""}`}
          processing={processing}
          size={"sm"}
          onClick={onSubmit}
        >
          {hasUnsavedChanges
            ? "Save Changes*"
            : "Save Changes"}
        </SubmitBtn>
      </div>
    </div>
  );
}
