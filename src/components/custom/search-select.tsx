import React, { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DataTypeIds {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: DataTypeIds[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
  width?: "auto" | "full";
  required?: boolean;
  customizable?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
  multiple?: boolean;
}

export default function SearchSelect({
  options: initialOptions,
  value,
  onChange,
  label = "",
  description = "",
  className = "",
  width = "auto",
  required = false,
  customizable = false,
  errorMessage,
  isLoading = false,
  multiple = false,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [customOptions, setCustomOptions] = useState<DataTypeIds[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple && value ? value.split(',') : value ? [value] : []
  );

  // Combine initial options with custom options
  const allOptions = [...initialOptions, ...customOptions].map(option => ({
    ...option,
    value: String(option.value)
  }));

  // Get currently selected option(s)
  const selectedOption = allOptions.find(option => option.value === value);
  const selectedOptions = multiple
    ? allOptions.filter(option => selectedValues.includes(option.value))
    : [];

  // Handle clicking outside
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleAddCustomOption = () => {
    if (!inputValue.trim()) return;

    const newOption = { value: inputValue, label: inputValue };
    setCustomOptions(prev => [...prev, newOption]);
    handleSelectOption(newOption.value);
    setInputValue("");
  };

  const handleSelectOption = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];

      setSelectedValues(newValues);
      onChange(newValues.join(','));
    } else {
      onChange(optionValue);
      setOpen(false);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange('');
    setSelectedValues([]);
  };

  // Display selected values in multiple selection mode
  const renderSelectedValues = () => {
    if (!multiple || selectedValues.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 p-1">
        {selectedOptions.map(option => (
          <div
            key={option.value}
            className="bg-primary/10 text-primary rounded px-2 py-1 text-xs flex items-center gap-1"
          >
            {option.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectOption(option.value);
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-1 pt-1 mt-2", className)} ref={popoverRef}>
      {label && (
        <Label
          className={cn("flex items-center gap-1", errorMessage && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex flex-col border rounded-md cursor-pointer",
              width === "full" ? "w-full" : "w-64",
              open && "border-primary ring-2 ring-primary/20",
              errorMessage && "border-red-500"
            )}
          >
            {renderSelectedValues()}

            <div className="flex items-center p-2">
              {/* Show selected option as text when not multiple and not searching */}
              {selectedOption && !multiple ? (
                <div className="flex-1 truncate">{selectedOption.label}</div>
              ) : (multiple && selectedValues.length === 0) || (!multiple && !selectedOption) ? (
                <div className="flex-1 truncate text-muted-foreground text-sm">
                  {`Select ${label.toLowerCase() || 'option'}...`}
                </div>
              ) : null}

              <div className="flex items-center gap-1 ml-auto">
                {(selectedOption || (multiple && selectedValues.length > 0)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={handleClear}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </div>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          sideOffset={5}
          style={{ width: popoverRef.current?.getBoundingClientRect().width }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${label.toLowerCase() || 'options'}...`}
              value={inputValue}
              onValueChange={setInputValue}
              className="h-9"
            />

            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  </div>
                ) : customizable && inputValue ? (
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={handleAddCustomOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add &quot;{inputValue}&quot;
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No options found
                  </div>
                )}
              </CommandEmpty>

              <CommandGroup>
                {allOptions
                  .filter(option =>
                    inputValue === "" ||
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelectOption(option.value)}
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center w-full">
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            (multiple ? selectedValues.includes(option.value) : value === option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="flex-1">{option.label}</span>
                      </div>
                    </CommandItem>
                  ))
                }
              </CommandGroup>

              {customizable && inputValue && allOptions.some(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              ) && (
                  <div className="p-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={handleAddCustomOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add &quot;{inputValue}&quot;
                    </Button>
                  </div>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error and Description */}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}