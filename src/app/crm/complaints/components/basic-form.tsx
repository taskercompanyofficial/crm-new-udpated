"use client";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { complaintTypeOptions, DealerOptions, ProductOptions } from "@/lib/otpions";
import { SelectInput } from "@/components/custom/SelectInput";
import { Skeleton } from "@/components/ui/skeleton";
import { dataTypeIds } from "@/types";
import { API_URL } from "@/lib/apiEndPoints";
import useFetch from "@/hooks/usefetch";
import SearchSelect from "@/components/custom/search-select";
import { useState } from "react";
import { TextareaInput } from "@/components/custom/TextareaInput";

export default function BasicForm({
  data,
  setData,
  errors,
}: {
  data: any;
  setData: (data: any) => void;
  errors: any;
}) {
  const { data: brandsData, isLoading: brandsLoading } = useFetch<
    dataTypeIds[]
  >(`${API_URL}/crm/fetch-authorized-brands`);

  const [title, setTitle] = useState<string>("");
  const { data: branchesData, isLoading: branchesLoading } = useFetch<
    dataTypeIds[]
  >(`${API_URL}/crm/fetch-branches`);
  return (
    <div className="w-full space-y-2 bg-white dark:bg-gray-800 p-2 rounded">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <LabelInputContainer
          type="text"
          id="brand_complaint_no"
          placeholder="eg: 123123sas"
          label="Brand Complaint No"
          value={data.brand_complaint_no}
          onChange={(e) =>
            setData({ ...data, brand_complaint_no: e.target.value })
          }
          errorMessage={errors.brand_complaint_no}
          className="uppercase"
        />
        <div className="grid grid-cols-[120px_1fr] gap-2 w-full">
          <div>
            <SelectInput
              label="Title"
              selected={title}
              onChange={(value) => {
                const titlePrefix = value === "mr" ? "Mr. " : value === "ms" ? "Ms. " : value === "mrs" ? "Mrs. " : "";
                setTitle(value);
                setData({
                  ...data,
                  title: value,
                  applicant_name: titlePrefix + (data.applicant_name?.replace(/^(Mr\.|Ms\.|Mrs\.) /, "") || "")
                });
              }}
              options={[
                { label: "Mr.", value: "mr" },
                { label: "Ms.", value: "ms" },
                { label: "Mrs.", value: "mrs" }
              ]}
              errorMessage={errors.title}
            />
          </div>
          <LabelInputContainer
            type="text"
            autoFocus
            id="applicant-name"
            placeholder="Applicant name"
            label="Name"
            value={data.applicant_name}
            onChange={(e) => {
              const name = e.target.value.toUpperCase().replace(/^(MR\.|MS\.|MRS\.) /, "");
              const titlePrefix = data.title === "mr" ? "MR. " : data.title === "ms" ? "MS. " : data.title === "mrs" ? "MRS. " : "";
              setData({ ...data, applicant_name: titlePrefix + name });
            }}
            errorMessage={errors.applicant_name}
            required
            className="w-full"
          />
        </div>
        <LabelInputContainer
          type="text"
          id="ref-by"
          placeholder="Reference by"
          label="Reference by"
          value={data.reference_by}
          onChange={(e) =>
            setData({ ...data, reference_by: e.target.value })
          }
          errorMessage={errors.reference_by}
        />

        <LabelInputContainer
          type="number"
          id="applicant-phone"
          placeholder="Applicant phone"
          label="Phone"
          value={data.applicant_phone}
          onChange={(e) =>
            setData({ ...data, applicant_phone: e.target.value })
          }
          errorMessage={errors.applicant_phone}
          required
        />
        <LabelInputContainer
          type="number"
          id="applicant-whatsapp"
          placeholder="Applicant whatsapp"
          label="Whatsapp"
          required
          value={data.applicant_whatsapp}
          onChange={(e) =>
            setData({ ...data, applicant_whatsapp: e.target.value })
          }
          errorMessage={errors.applicant_whatsapp}
        />
        <LabelInputContainer
          type="text"
          id="extra-numbers"
          placeholder="Extra phone numbers"
          label="Extra numbers"
          value={data.extra_numbers}
          onChange={(e) =>
            setData({ ...data, extra_numbers: e.target.value })
          }
          errorMessage={errors.extra_numbers}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {!branchesLoading && branchesData ? (
          <SearchSelect
            options={branchesData}
            label="Branch"
            value={data.branch_id}
            onChange={(e) => setData({ ...data, branch_id: e })}
            width="full"
            className="transition-all duration-200"
            errorMessage={errors.branch_id}
          />
        ) : (
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-12" />
          </div>
        )}
        <SearchSelect
          label="Dealers"
          options={(() => {
            const defaultOptions = DealerOptions;
            if (data.reference_by && !defaultOptions.find((opt) => opt.value === data.reference_by)) {
              return [...defaultOptions, {
                value: data.reference_by,
                label: data.reference_by,
                id: String(defaultOptions.length + 1),
                image: ""
              }];
            }

            return defaultOptions;
          })()}
          value={data.dealer}
          onChange={(value: string) => setData({ ...data, dealer: value })}
          width="full"
          customizable
          errorMessage={errors.dealer}
        />
        <SearchSelect
          label="Product"
          options={(() => {
            const defaultOptions = ProductOptions;
            if (data.product && !defaultOptions.find((opt) => opt.value === data.product)) {
              return [...defaultOptions, {
                value: data.product,
                label: data.product,
                id: String(defaultOptions.length + 1),
                image: ""
              }];
            }
            return defaultOptions;
          })()}
          value={data.product}
          onChange={(value: string) => setData({ ...data, product: value })}
          width="full"
          customizable
        />
        {!brandsLoading && brandsData ? (
          <SearchSelect
            options={brandsData}
            label="Brand"
            value={data.brand_id}
            onChange={(e) => setData({ ...data, brand_id: e })}
            width="full"
            className="mt-1"
            customizable
            errorMessage={errors.brand_id}
          />
        ) : (
          <div className="mt-1 space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-12" />
          </div>
        )}
      </div>
      <SelectInput
        label="Complaint Type"
        placeholder="Complaint Type"
        options={complaintTypeOptions}
        onChange={(value) => setData({ ...data, complaint_type: value })}
        selected={data.complaint_type}
        errorMessage={errors.complaint_type}
      />
      <TextareaInput
        label="Address"
        name="applicant_adress"
        placeholder="Applicant Address"
        value={data.applicant_adress}
        errorMessage={errors.applicant_adress}
        onChange={(e) => setData({ ...data, applicant_adress: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <TextareaInput
          label="Fault Description"
          name="fault_description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          predefinedOptions={[
            'Not cooling',
            'Water leaking',
            'Making loud noise',
            'Not turning on',
            'Fan not working',
            'Compressor not starting',
            'Ice formation on coils',
            'Remote control not working',
            'Strange smell from AC',
            'Weak airflow',
            'Temperature fluctuation',
            'Unit short cycling',
            'Thermostat issues',
            'Drainage problems',
            'Error Code',
            'NO_COOLING',
            'WATER_LEAKAGE',
            'NOISE_ISSUE',
            'NOT_STARTING',
            'DISPLAY_NOT_WORKING',
            'REMOTE_NOT_WORKING',
            'LOW_COOLING',
            'GAS_LEAKAGE',
            'INSTALLATION_REQUIRED',
            'SERVICE_REQUIRED',
            'OTHER '
          ]}
          required
          placeholder="Describe the AC fault in detail"

        />
        <TextareaInput
          label="Working Details"
          placeholder="Enter any additional details..."
          onChange={(e) =>
            setData({ ...data, working_details: e.target.value })
          }
          value={data.working_details}
          errorMessage={errors.working_details}
          className="transition-all duration-200"
          customizable={true}
        />
      </div>
    </div>
  );
}
