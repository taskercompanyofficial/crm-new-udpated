"use client";
import React, { FormEvent } from "react";
import { Loader, RefreshCcw } from "lucide-react";
import { revalidate } from "@/actions/revalidate";
import { toast } from "react-toastify";

export function RevalidateBtn() {
  const [revalidating, setRevalidating] = React.useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRevalidating(true);
    try {
      await revalidate({ path: "/" });
      toast.success("Revalidation successful");
    } catch (error) {
      toast.error("Failed to revalidate");
    } finally {
      setRevalidating(false);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <React.Fragment>
        {revalidating ? (
          <Loader size={15} className="animate-spin" />
        ) : (
          <button type="submit" className="flex items-center gap-1">
            <RefreshCcw size={15} className="cursor-pointer" />
          </button>
        )}
      </React.Fragment>
    </form>
  );
}
