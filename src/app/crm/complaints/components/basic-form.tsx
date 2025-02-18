"use client";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { TextareaInput } from "@/components/custom/TextareaInput";
import { complaintTypeOptions } from "@/lib/otpions";
import { SelectInput } from "@/components/custom/SelectInput";
import { Skeleton } from "@/components/ui/skeleton";
import { dataTypeIds } from "@/types";
import { API_URL } from "@/lib/apiEndPoints";
import useFetch from "@/hooks/usefetch";
import SearchSelect from "@/components/custom/search-select";
import AddressTextarea from "./address-textarea";

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

  return (
    <div>
      <div className="w-full space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
          />
          <LabelInputContainer
            type="text"
            autoFocus
            id="applicant-name"
            placeholder="Applicant name"
            label="Name"
            value={data.applicant_name}
            onChange={(e) =>
              setData({ ...data, applicant_name: e.target.value })
            }
            errorMessage={errors.applicant_name}
            required
          />
          <LabelInputContainer
            type="text"
            id="applicant-email"
            placeholder="Applicant email"
            label="Email"
            value={data.applicant_email}
            onChange={(e) =>
              setData({ ...data, applicant_email: e.target.value })
            }
            errorMessage={errors.applicant_email}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
          <SearchSelect
            label="Reference by"
            options={(() => {
              const defaultOptions: dataTypeIds[] = [
                { value: "Lahore Center", label: "Lahore Center", id: "1", image: "" },
                { value: "Multi Electronics", label: "Multi Electronics", id: "2", image: "" },
                { value: "Afzal Electronics", label: "Afzal Electronics", id: "3", image: "" },
                { value: "Madinah Electronics", label: "Madinah Electronics", id: "4", image: "" },
                { value: "Metro Cash & Carry", label: "Metro Cash & Carry", id: "5", image: "" },
                { value: "Imtiaz Store", label: "Imtiaz Store", id: "6", image: "" },
                { value: "E Lux", label: "E Lux", id: "7", image: "" },
                { value: "Dawlance experience store", label: "Dawlance experience store", id: "8", image: "" },
                { value: "Al mumtaz group", label: "Al mumtaz group", id: "9", image: "" }
              ];

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
            value={data.reference_by}
            onChange={(value: string) => setData({ ...data, reference_by: value })}
            width="full"
            customizable
            errorMessage={errors.reference_by}
          />
          <SearchSelect
            label="Product"
            options={(() => {
              const defaultOptions: dataTypeIds[] = [
                { value: "Refrigerator", label: "Refrigerator", id: "1", image: "" },
                { value: "Refrigerator Side by Side", label: "Refrigerator Side by Side", id: "2", image: "" },
                { value: "Refrigerator French Door", label: "Refrigerator French Door", id: "3", image: "" },
                { value: "Refrigerator Top Freezer", label: "Refrigerator Top Freezer", id: "4", image: "" },
                { value: "Refrigerator Bottom Freezer", label: "Refrigerator Bottom Freezer", id: "5", image: "" },
                { value: "Washing Machine", label: "Washing Machine", id: "6", image: "" },
                { value: "Washing Machine Top Load", label: "Washing Machine Top Load", id: "7", image: "" },
                { value: "Washing Machine Front Load", label: "Washing Machine Front Load", id: "8", image: "" },
                { value: "Washing Machine Semi-Automatic", label: "Washing Machine Semi-Automatic", id: "9", image: "" },
                { value: "Air Conditioner", label: "Air Conditioner", id: "10", image: "" },
                { value: "Microwave", label: "Microwave", id: "11", image: "" },
                { value: "Dishwasher", label: "Dishwasher", id: "12", image: "" },
                { value: "Water Heater", label: "Water Heater", id: "13", image: "" },
                { value: "Dryer", label: "Dryer", id: "14", image: "" },
                { value: "Stove", label: "Stove", id: "15", image: "" },
                { value: "Oven", label: "Oven", id: "16", image: "" },
                { value: "LCD TV", label: "LCD TV", id: "17", image: "" },
                { value: "LCD Monitor", label: "LCD Monitor", id: "18", image: "" }
              ];

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
        <AddressTextarea
          value={data.applicant_adress}
          errorMessage={errors.applicant_adress}
          onChange={(value: string) => setData({ ...data, applicant_adress: value })}
        />
        <TextareaInput
          label="Fault"
          placeholder="Describe the fault..."
          maxLength={250}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          errorMessage={errors.description}
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}
