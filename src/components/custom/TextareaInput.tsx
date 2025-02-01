"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextareaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function TextareaInput({
  label,
  description,
  errorMessage,
  id,
  maxLength,
  ...props
}: TextareaInputProps) {
  const [charCount, setCharCount] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}
        {props.required && <span className="text-red-500"> *</span>}</Label>}
      <Textarea
        id={id}
        {...props}
        onChange={handleChange}
        className={`bg-gray-50 dark:bg-slate-950 ${props.className} ${errorMessage ? "border-red-500" : ""}`}
      />
      <div className="flex justify-between text-sm text-gray-500">
        {description && <p>{description}</p>}
        {maxLength && (
          <p>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
