import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import useForm from "@/hooks/use-form";
import { toast } from "react-toastify";
import { revalidate } from "@/actions/revalidate";
import SubmitBtn from "../custom/submit-button";
export default function DeleteDialog({ row }: { row: any }) {
  const session = useSession();
  const token = session.data?.user?.token;
  const { processing, delete: destroy } = useForm({});

  const pathname = usePathname();
  const endPoint = "/crm/" + pathname.split("/").slice(2).join("/");
  const handleDelete = async () => {
    destroy(
      `${API_URL}${endPoint}/${row.id}`,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          revalidate({ path: endPoint });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-red-500 hover:bg-red-500 hover:text-white"
        >
          Delete
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Item
            ({row.name}) from our server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitBtn
            processing={processing}
            variant="destructive"
            onClick={handleDelete}
          >
            Continue
          </SubmitBtn>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
