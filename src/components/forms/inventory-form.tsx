"use client";
import React, { FormEventHandler } from "react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useForm from "@/hooks/use-form";
import { API_URL, INVENTORIES } from "@/lib/apiEndPoints";
import SubmitBtn from "@/components/custom/submit-button";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/custom/file-upload";
import { TextareaInput } from "../custom/TextareaInput";
import useFetch from "@/hooks/usefetch";
import SearchSelect from "@/components/custom/search-select";
import { dataTypeIds } from "@/types";
import { Skeleton } from "../ui/skeleton";

interface InventoryFormData {
  name: string;
  image: File | null;
  quantity_type: "count" | "feet";
  quantity: number;
  price: number;
  description: string;
  branch_id: string;
  model: string;
}

export default function InventoryForm({ row }: { row?: any }) {
  const { data: branches, isLoading } = useFetch<dataTypeIds[]>(
    `${API_URL}/crm/fetch-branches`,
  );
  const session = useSession();
  const token = session.data?.user?.token || "";
  const { data, setData, post, put, processing, errors } =
    useForm<InventoryFormData>({
      name: row?.name || "",
      image: null,
      quantity_type: row?.quantityType || "count",
      quantity: row?.quantity || 0,
      price: row?.price || 0,
      description: row?.description || "",
      branch_id: row?.branchId || "",
      model: row?.model || "",
    });

  const endPoint = row
    ? `${API_URL}${INVENTORIES}/${row.id}`
    : `${API_URL}${INVENTORIES}`;
  const method = row ? put : post;

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    method(
      endPoint,
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

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setData({ ...data, image: files[0] });
    }
  };

  return (
    <form className="w-full p-2 sm:p-0" onSubmit={submit}>
      <div className="w-full space-y-4">
        <div>
          <Label>Item Image</Label>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <LabelInputContainer
          label="Item Name"
          type="text"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          required
          placeholder="Item Name"
          errorMessage={errors.name}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LabelInputContainer
            label="Model"
            type="text"
            value={data.model}
            onChange={(e) => setData("model", e.target.value)}
            required
            placeholder="Enter Model"
            errorMessage={errors.model}
          />

          {!isLoading && branches ? (
            <SearchSelect
              options={branches}
              label="Branch"
              value={data.branch_id}
              onChange={(e) => setData({ ...data, branch_id: e })}
              width="full"
              className="transition-all duration-200"
            />
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label>Quantity Type</Label>
            <Select
              value={data.quantity_type}
              onValueChange={(value) =>
                setData({ ...data, quantity_type: value as "count" | "feet" })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select quantity type" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="count">Unit</SelectItem>
                <SelectItem value="feet">Feet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <LabelInputContainer
              label="Quantity"
              type="number"
              value={data.quantity}
              onChange={(e) => setData("quantity", parseFloat(e.target.value))}
              required
              min={0}
              step={0.01}
              placeholder="Enter quantity"
              errorMessage={errors.quantity}
            />
          </div>
        </div>

        <div className="w-full">
          <LabelInputContainer
            label={`Price ${data.quantity_type === "count" ? "Per Unit" : "Per Foot"}`}
            type="number"
            value={data.price}
            onChange={(e) => setData("price", parseFloat(e.target.value))}
            required
            min={0}
            step={0.01}
            placeholder="Enter price"
            errorMessage={errors.price}
          />
        </div>

        <TextareaInput
          label="Description"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
          required
          placeholder="Enter description"
          errorMessage={errors.description}
        />
      </div>

      <SubmitBtn processing={processing} className="mt-4 w-full">
        {row ? `Update ${row.name}` : "Create new item"}
      </SubmitBtn>
    </form>
  );
}
