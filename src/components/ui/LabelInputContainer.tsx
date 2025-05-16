"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input, InputProps as AntdInputProps } from "antd";

interface EnhancedInputProps extends Omit<AntdInputProps, 'size'> {
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: string;
}

export const LabelInputContainer: React.FC<EnhancedInputProps> = ({
  label,
  labelClassName,
  description,
  errorMessage,
  icon,
  type = "text",
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={props.id} className={labelClassName}>
          {label} {props.required && <span className="text-red-600">*</span>}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
            {disabled && <Lock className="mt-1 h-4 w-4" />}
          </div>
        )}
        <Input
          type={inputType}          
          className={`${icon ? "pl-10" : ""} ${errorMessage ? "border-red-500" : ""} placeholder:text-xs placeholder:font-mono`}
          placeholder={type === "password" ? "********" : props.placeholder}
          disabled={disabled}
          {...props}
        />
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent "
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="mt-1 h-4 w-4" />
            ) : (
              <Eye className="mt-1 h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};
