"use client";
import React, { useState, useEffect } from "react";
import BasicForm from "../components/basic-form";
import useForm from "@/hooks/use-form";
import { Button, buttonVariants } from "@/components/ui/button";
import SubmitBtn from "@/components/custom/submit-button";
import { SelectInput } from "@/components/custom/SelectInput";
import { CallStatusOptions, ComplaintStatusOptions } from "@/lib/otpions";
import { Undo2, Redo2, Info, WifiOff } from "lucide-react";
import { COMPLAINTS } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Form() {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const [history, setHistory] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingComplaints, setPendingComplaints] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pendingComplaints");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const { data, setData, processing, post, errors } = useForm({
    applicant_name: "",
    reference_by: "",
    brand_complaint_no: "",
    applicant_phone: "",
    applicant_whatsapp: "",
    brand_id: "",
    extra_numbers: "",
    ref_by: "",
    product: "",
    complaint_type: "",
    applicant_adress: "",
    working_details: "",
    description: "",
    status: "open",
    call_status: "pending",
  });
  const router = useRouter();

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Try to submit pending complaints when back online
  useEffect(() => {
    if (isOnline && pendingComplaints.length > 0) {
      const submitPendingComplaints = async () => {
        for (const complaint of pendingComplaints) {
          try {
            await post(
              COMPLAINTS,
              {
                onSuccess: () => {
                  setPendingComplaints(prev => prev.filter(c => c !== complaint));
                  toast.success("Pending complaint submitted successfully");
                },
                onError: () => {/* Keep complaint in pending */ }
              },
              token
            );
          } catch (error) {
            console.error('Failed to submit pending complaint:', error);
          }
        }
        localStorage.setItem("pendingComplaints", JSON.stringify(pendingComplaints));
      };

      submitPendingComplaints();
    }
  }, [isOnline, pendingComplaints, post, token]);

  const handleSubmit = () => {
    if (!isOnline) {
      // Store complaint locally when offline
      const newComplaint = { ...data, timestamp: Date.now() };
      setPendingComplaints(prev => [...prev, newComplaint]);
      localStorage.setItem("pendingComplaints", JSON.stringify([...pendingComplaints, newComplaint]));
      toast.info("Complaint saved locally. Will submit when online.");
      setHasUnsavedChanges(false);
      setData({
        applicant_name: "",
        reference_by: "",
        brand_complaint_no: "",
        applicant_phone: "",
        applicant_whatsapp: "",
        brand_id: "",
        extra_numbers: "",
        ref_by: "",
        product: "",
        complaint_type: "",
        applicant_adress: "",
        working_details: "",
        description: "",
        status: "open",
        call_status: "pending",
      });
      return;
    }

    post(
      COMPLAINTS,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setHasUnsavedChanges(false);
          router.push("/crm/complaints/edit/" + response.data.id);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };

  // Function to update data with history tracking
  const updateData = (newData: any) => {
    // Add current state to history
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setData(newData);
    setHasUnsavedChanges(true);
  };

  // Undo function
  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setData(history[currentIndex - 1]);
      setHasUnsavedChanges(true);
    }
  };

  // Redo function
  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setData(history[currentIndex + 1]);
      setHasUnsavedChanges(true);
    }
  };

  // Handle unsaved changes warning
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="rounded-lg bg-white p-2 shadow-md dark:bg-slate-950 md:p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Create New Complaint
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the complaint details below. All fields marked with * are
            required.
          </p>
          {!isOnline && (
            <div className="flex items-center gap-2 text-yellow-500 mt-2">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Offline Mode - Changes will be saved locally</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={currentIndex <= 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={currentIndex >= history.length - 1}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <SelectInput
            options={CallStatusOptions}
            selected={data.call_status}
            onChange={(e) => updateData({ ...data, call_status: e })}
            errorMessage={errors.call_status}
          />
          <div className="flex-grow md:flex-grow-0">
            <SelectInput
              options={ComplaintStatusOptions}
              selected={data.status}
              onChange={(e) => updateData({ ...data, status: e })}
              errorMessage={errors.status}
            />
          </div>
          <SubmitBtn
            className={`${buttonVariants({ effect: "shineHover" })} w-full md:w-auto`}
            processing={processing}
            size={"sm"}
            onClick={handleSubmit}
          >
            Create Complaint {!isOnline && "(Offline)"}
          </SubmitBtn>
        </div>
      </div>
      <BasicForm data={data} setData={updateData} errors={errors} />
      <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Changes saved: {history.length}
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Form completion: {Object.values(data).filter(Boolean).length}/
              {Object.keys(data).length}
            </div>
            {hasUnsavedChanges && (
              <div className="text-sm text-yellow-500">
                You have unsaved changes
              </div>
            )}
            {pendingComplaints.length > 0 && (
              <div className="text-sm text-yellow-500">
                {pendingComplaints.length} pending complaint(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
