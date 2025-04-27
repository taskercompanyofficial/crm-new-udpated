"use client";
import { useState, useCallback, useEffect } from "react";
import { ComplaintsType, dataTypeIds, ReviewType } from "@/types";
import useForm from "@/hooks/use-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/usefetch";
import { COMPLAINTS } from "@/lib/apiEndPoints";
import useFormHistory from "@/hooks/complaint/use-form-history";
import useOfflineSync from "@/hooks/complaint/use-offline-sync";
import ComplaintTabs from "./complaint-tabs";
import ComplaintActions from "./complaint-actions";
import ComplaintFooter from "./complaint-footer";
import useAutoSave from "@/hooks/complaint/use-auto-save";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Redo2, Undo2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Form({
  complaint,
  technician,
  username,
  role = "user",
}: {
  complaint?: ComplaintsType;
  technician?: dataTypeIds[];
  username?: string;
  role?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState("advanced");
  const session = useSession();
  const token = session.data?.user?.token || "";
  const [loading, setLoading] = useState(true);

  // Initialize form with useForm hook
  const { data, setData, processing, put, errors } = useForm({
    complain_num: complaint?.complain_num,
    brand_complaint_no: complaint?.brand_complaint_no || "",
    applicant_name: complaint?.applicant_name || "",
    reference_by: complaint?.reference_by || "",
    applicant_phone: complaint?.applicant_phone || "",
    applicant_whatsapp: complaint?.applicant_whatsapp || "",
    applicant_adress: complaint?.applicant_adress || "",
    extra_numbers: complaint?.extra_numbers || "",
    dealer: complaint?.dealer || "",
    extra: complaint?.extra || "",
    description: complaint?.description || "",
    branch_id: complaint?.branch_id || "",
    brand_id: complaint?.brand_id || "",
    product: complaint?.product || "",
    model: complaint?.model || "",
    working_details: complaint?.working_details || "",
    serial_number_ind: complaint?.serial_number_ind || "",
    serial_number_oud: complaint?.serial_number_oud || "",
    mq_nmb: complaint?.mq_nmb || "",
    p_date: complaint?.p_date || "",
    complete_date: complaint?.complete_date || "",
    amount: complaint?.amount || "",
    product_type: complaint?.product_type || "",
    technician: complaint?.technician?.id || "",
    status: complaint?.status || "",
    priority: complaint?.priority || "medium",
    complaint_type: complaint?.complaint_type || "",
    provided_services: complaint?.provided_services || "",
    warranty_type: complaint?.warranty_type || "",
    comments_for_technician: complaint?.comments_for_technician || "",
    files: complaint?.files || [],
    send_message_to_technician: false,
    call_status: complaint?.call_status || "",
    cancellation_reason: complaint?.cancellation_reason || "",
    cancellation_details: complaint?.cancellation_details || "",
  });

  // Fetch customer reviews
  const fetchEndPoint = `https://api.taskercompany.com/api/crm/complaint/customer-reviews/${complaint?.id}`;
  const {
    data: reviewsData,
    error,
    isLoading,
  } = useFetch<ReviewType[]>(fetchEndPoint, token);

  // Use custom hooks
  const {
    hasUnsavedChanges,
    updateData,
    undo: undoAction,
    redo: redoAction,
    canUndo,
    canRedo,
    resetUnsavedChanges,
    historyLength
  } = useFormHistory(data);

  // Handle form submission including offline sync
  const syncData = useCallback(async (formData: ComplaintsType) => {
    return put(
      `${COMPLAINTS}/${complaint?.id}`,
      {
        onSuccess: () => { },
        onError: () => { }
      },
      token
    );
  }, [put, complaint?.id, token]);

  const {
    isOnline,
    addPendingChange,
    pendingChangesCount
  } = useOfflineSync<ComplaintsType>(complaint?.id, syncData);

  // Handle undo/redo
  const handleUndo = () => {
    const prevData = undoAction();
    if (prevData) {
      setData(prevData);
    }
  };

  const handleRedo = () => {
    const nextData = redoAction();
    if (nextData) {
      setData(nextData);
    }
  };

  // Save form data
  const saveFormData = useCallback(() => {
    if (!hasUnsavedChanges) return;

    // Check if trying to close/cancel without customer remarks
    if ((data.status === "closed" || data.status === "cancelled") &&
      (!reviewsData || reviewsData.length === 0)) {
      toast.error("Cannot close or cancel complaint without customer remarks");
      return;
    }

    if (!isOnline) {
      // Store changes locally when offline
      const newChange = { ...data, timestamp: Date.now() };
      addPendingChange(newChange as any);
      toast.info("Changes saved locally. Will sync when online.");
      resetUnsavedChanges();
      return;
    }

    put(
      `${COMPLAINTS}/${complaint?.id}`,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          resetUnsavedChanges();
          updateLastSaveTime();
          setData({ ...data, send_message_to_technician: false });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token
    );
  }, [
    hasUnsavedChanges,
    data,
    isOnline,
    put,
    complaint?.id,
    token,
    reviewsData,
    addPendingChange,
    resetUnsavedChanges,
    router
  ]);

  const {
    autoSaveEnabled,
    toggleAutoSave,
    lastSaveTime,
    updateLastSaveTime,
    timeUntilNextSave
  } = useAutoSave({
    onSave: saveFormData,
    hasUnsavedChanges
  });

  // Helper function to update form data with history tracking
  const handleDataUpdate = useCallback((newData: ComplaintsType) => {
    setData(updateData(newData as any));
  }, [setData, updateData]);

  // Count filled form fields
  const filledDataFieldsCount = Object.values(data).filter(Boolean).length;
  const dataFieldsCount = Object.keys(data).length;

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="flex items-center space-x-2 py-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto">
      <ComplaintActions
        data={data}
        setData={handleDataUpdate}
        hasUnsavedChanges={hasUnsavedChanges}
        processing={processing}
        onSubmit={saveFormData}
        undo={handleUndo}
        redo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        username={username}
        role={role}
        autoSaveEnabled={autoSaveEnabled}
        toggleAutoSave={toggleAutoSave}
        errors={errors}
        id={complaint?.id || 0}
      />
      <ScrollArea>
        <ComplaintTabs
          tab={tab}
          setTab={setTab}
          data={data}
          setData={handleDataUpdate}
          errors={errors}
          technician={technician}
          complaintId={Number(complaint?.id || 0)}
          token={token}
          role={role}
        />
        <ComplaintFooter
          lastSaveTime={lastSaveTime}
          isOnline={isOnline}
          pendingChangesCount={pendingChangesCount}
          historyLength={historyLength}
          dataFieldsCount={dataFieldsCount}
          filledDataFieldsCount={filledDataFieldsCount}
          hasUnsavedChanges={hasUnsavedChanges}
          autoSaveEnabled={autoSaveEnabled}
          timeUntilNextSave={timeUntilNextSave}
        />
      </ScrollArea>
    </div>
  );
}