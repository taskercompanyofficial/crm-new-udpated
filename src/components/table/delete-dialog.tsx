import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import useForm from "@/hooks/use-form";
import { toast } from "react-toastify";
import { revalidate } from "@/actions/revalidate";
import SubmitBtn from "../custom/submit-button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../custom/credenza";
export default function DeleteDialog({ row }: { row: any }) {
  const session = useSession();
  const token = session.data?.user?.token;
  const { processing, delete: destroy } = useForm({});
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const endPoint = "/crm/" + pathname.split("/").slice(2).join("/");
  const handleDelete = async () => {
    destroy(
      `${API_URL}${endPoint}/${row.id}`,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          revalidate({ path: endPoint });
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };
  return (
    <Credenza open={open} onOpenChange={() => setOpen(!open)}>
      <CredenzaTrigger className="w-full">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between text-red-500 hover:bg-red-500 hover:text-white"
        >
          Delete
          <Trash />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Are you absolutely sure?</CredenzaTitle>
          <CredenzaDescription>
            This action cannot be undone. This will permanently delete the Item
            ({row.name}) from our server.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose>Cancel</CredenzaClose>
          <SubmitBtn
            processing={processing}
            variant="destructive"
            onClick={handleDelete}
          >
            Continue
          </SubmitBtn>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
