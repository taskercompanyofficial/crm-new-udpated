"use client";
import React, { FormEvent, useEffect } from "react";
import { Loader, RefreshCcw } from "lucide-react";
import { revalidate } from "@/actions/revalidate";
import { toast } from "react-toastify";

export function RevalidateBtn() {
  const [revalidating, setRevalidating] = React.useState(false);

  const handleRevalidate = async () => {
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'r') {
        handleRevalidate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleRevalidate();
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
