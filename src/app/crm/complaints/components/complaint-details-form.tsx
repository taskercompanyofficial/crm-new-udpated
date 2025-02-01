"use client";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";
import { dataTypeIds } from "@/types";
import SearchSelect from "@/components/custom/search-select";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { TextareaInput } from "@/components/custom/TextareaInput";
import { Checkbox } from "@/components/ui/checkbox";
import Vendors from "./vendors";

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
  const { data: branchesData, isLoading: branchesLoading } = useFetch<
    dataTypeIds[]
  >(`${API_URL}/crm/fetch-branches`);

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
          label="Serial Number In"
          placeholder="Serial Number In"
          onChange={(e) =>
            setData({ ...data, serial_number_ind: e.target.value })
          }
          value={data.serial_number_ind}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="Serial Number Out"
          placeholder="Serial Number Out"
          onChange={(e) =>
            setData({ ...data, serial_number_oud: e.target.value })
          }
          value={data.serial_number_oud}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="Model Number"
          placeholder="Model Number"
          onChange={(e) => setData({ ...data, model: e.target.value })}
          value={data.model}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="Extra Number"
          placeholder="Extra Number"
          onChange={(e) => setData({ ...data, extra_numbers: e.target.value })}
          value={data.extra_numbers}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          type="date"
          label="Date of Purchase"
          placeholder="Date of Purchase"
          onChange={(e) => setData({ ...data, p_date: e.target.value })}
          value={data.p_date}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="Product Type"
          placeholder="Product Type"
          onChange={(e) => setData({ ...data, product_type: e.target.value })}
          value={data.product_type}
          className="transition-all duration-200 hover:shadow-md"
        />
        <LabelInputContainer
          label="MQ Number"
          placeholder="MQ Number"
          onChange={(e) => setData({ ...data, mq_nmb: e.target.value })}
          value={data.mq_nmb}
          className="transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {!branchesLoading && branchesData ? (
          <SearchSelect
            options={branchesData}
            label="Branch"
            value={data.branch_id}
            onChange={(e) => setData({ ...data, branch_id: e })}
            width="full"
            className="transition-all duration-200"
          />
        ) : (
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-12" />
          </div>
        )}
        <div className="space-y-2">
          {technician ? (
            <div className="flex-1">
              <SearchSelect
                options={technician}
                label="Technician"
                value={data.technician}
                onChange={(e) => setData({ ...data, technician: e })}
                width="full"
                className="transition-all duration-200"
              />
            </div>
          ) : (
            <div className="flex-1 space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-12" />
            </div>
          )}
          <div className="flex items-center">
            <Checkbox
              id="send-message-tech"
              checked={data.send_message_to_technician}
              onCheckedChange={() =>
                setData({
                  ...data,
                  send_message_to_technician: !data.send_message_to_technician,
                })
              }
            />
            <label
              htmlFor="send-message-tech"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Send Message
            </label>
          </div>
        </div>
        <LabelInputContainer
          label="Amount"
          placeholder="Amount"
          onChange={(e) => setData({ ...data, amount: e.target.value })}
          value={data.amount}
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
          className="min-h-[120px] transition-all duration-200"
        />
        <TextareaInput
          label="Additional Comment For Technition"
          placeholder="Enter the comment for technician"
          onChange={(e) =>
            setData({ ...data, comments_for_technician: e.target.value })
          }
          value={data.comments_for_technician}
          className="min-h-[120px] transition-all duration-200"
        />
      </div>
      <Vendors />
    </div>
  );
}
