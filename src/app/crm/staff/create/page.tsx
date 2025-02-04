import React from "react";
import { workersCreateMeta } from "@/lib/Meta";
import { Metadata } from "next";
import Form from "../components/form";
export const metadata: Metadata = {
  title: `${workersCreateMeta.title} | Tasker Company`,
  description: workersCreateMeta.description,
};
export default function page() {
  return (
    <>
      <div className="mb-2">
        <h2 className="font-serif text-lg font-semibold">
          {workersCreateMeta.title}
        </h2>
        <p className="hidden font-serif text-sm text-gray-500 sm:block">
          {workersCreateMeta.description}
        </p>
      </div>
      <Form />
    </>
  );
}
