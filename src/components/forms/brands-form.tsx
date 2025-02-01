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
import { API_URL, BRANDS } from "@/lib/apiEndPoints";
import SubmitBtn from "@/components/custom/submit-button";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/custom/file-upload";
import { revalidate } from "@/actions/revalidate";

export default function BrandsForm({ row }: { row?: any }) {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: row?.name || "",
    status: row?.status || "",
    image: null as File | null,
  });
  const endPoint = row ? API_URL + BRANDS + `/${row.id}` : API_URL + BRANDS;
  const method = row ? put : post;
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    method(
      endPoint,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          revalidate({ path: "/" });
          if (!row) {
            reset();
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    ); // Pass the token as the third parameter
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setData({ ...data, image: files[0] });
    }
  };
  return (
    <form className="w-full p-2 sm:p-0" onSubmit={submit}>
      <div className="w-full">
        <Label>Brand Logo</Label>
        <FileUpload onFileSelect={handleFileSelect} />
        <LabelInputContainer
          label="Brand Name"
          type="text"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          required
          id="large-url"
          placeholder="Brand Name"
          errorMessage={errors.name}
        />
        <div className="mb-1">
          <Label>Status</Label>
          <Select
            value={data.status}
            onValueChange={(status) => setData({ ...data, status })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent side="top">
              {["active", "inactive"].map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <SubmitBtn processing={processing} className="w-full">
        {row ? `Update ${row.name}` : "Create new domain"}
      </SubmitBtn>
    </form>
  );
}
