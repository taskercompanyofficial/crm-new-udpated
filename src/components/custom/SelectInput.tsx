"use client";

import React from "react";
import { Select } from "antd";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  selected: string;
  placeholder?: string;
}

export function SelectInput({
  label,
  description,
  errorMessage,
  options,
  onChange,
  selected,
  placeholder = "Select an option",
}: SelectInputProps) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Select
        value={selected}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        className="w-full"
        status={errorMessage ? "error" : undefined}
        style={{ width: "100%" }}
        dropdownMatchSelectWidth={false} // This allows dropdown to expand beyond select width
        optionLabelProp="label" // This ensures full label text is shown
      />
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
