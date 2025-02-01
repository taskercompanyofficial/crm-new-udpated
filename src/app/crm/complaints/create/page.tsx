import React from "react";
import Form from "./form";
import { Metadata } from "next";
import { complaintsCreateMeta } from "@/lib/Meta";

export const metadata: Metadata = {
  title: `${complaintsCreateMeta.title} | Tasker Company`,
  description: complaintsCreateMeta.description,
};

export default async function page() {
  return (
    <div>
      <Form />
    </div>
  );
}
