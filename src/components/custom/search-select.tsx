import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";

// Define dataTypeIds type
export interface dataTypeIds {
  value: string | number;
  label: string;
}

interface SearchSelectProps {
  options: dataTypeIds[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  width?: "auto" | "full";
  required?: boolean;
  customizable?: boolean;
}

export default function SearchSelect({
  options: items,
  value,
  onChange,
  label = "",
  description = "",
  error = "",
  className = "",
  width = "auto",
  required = false,
  customizable,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState({ value: "", label: "" });
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [options, setOptions] = useState<dataTypeIds[]>(items || []);

  // Normalize options for consistent types
  const normalizedOptions = options.map((option) => ({
    ...option,
    value: String(option.value),
  }));
  const normalizedValue = String(value);

  const selectedOption = normalizedOptions.find(
    (option) => option.value === normalizedValue
  );

  const handleAddCustom = () => {
    if (customValue.value.trim() && customValue.label.trim()) {
      const newOption = { ...customValue };
      setOptions([...options, newOption]);
      onChange(newOption.value);
      setCustomValue({ value: "", label: "" });
      setIsAddingCustom(false);
    }
  };

  const onChangeCustomAddInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue({ ...customValue, value: e.target.value, label: e.target.value });
  };

  return (
    <div className={cn("space-y-1 pt-1 mt-2", className)}>
      {/* Label */}
      {label && (
        <Label
          className={cn("flex items-center gap-1", error && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      {/* Popover Trigger */}
      <Popover open={open} onOpenChange={setOpen} >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between bg-gray-50 dark:bg-slate-950 h-8",
              width === "full" ? "w-full" : "w-[250px]"
            )}
          >
            <span className="text-xs text-left line-clamp-1 text-muted-foreground">
              {selectedOption
                ? selectedOption.label
                : `Select ${label.toLowerCase()}...`}
            </span>
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        {/* Popover Content */}
        <PopoverContent
          className={cn(
            "p-0",
            width === "full"
              ? "w-[--radix-popover-trigger-width]"
              : "w-[250px]"
          )}
          align="start"
        >
          <Command className="w-full">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              className="border-none focus:ring-0"
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {normalizedOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        normalizedValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {customizable && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {!isAddingCustom ? (
                      <CommandItem onSelect={() => setIsAddingCustom(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add custom option
                      </CommandItem>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Input
                          value={customValue.value}
                          onChange={onChangeCustomAddInput}
                          placeholder="Enter custom value..."
                          className="h-8"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddCustom}
                          disabled={!customValue.value.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error and Description */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
