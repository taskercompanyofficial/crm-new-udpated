"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";

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
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger
          className={`text-xs bg-gray-50 dark:bg-slate-950 ${errorMessage ? "border-red-500" : ""} ${buttonVariants({ variant: "secondary" })}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
