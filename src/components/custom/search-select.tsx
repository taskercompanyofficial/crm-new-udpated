import React, { useState, useEffect, useCallback, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, ChevronDown, ChevronUp, Loader2, Loader } from "lucide-react";
import { CheckIcon } from "lucide-react";

interface dataTypeIds {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: dataTypeIds[];
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
  options: items,
  value,
  onChange,
  label = "",
  description = "",
  className = "",
  width = "auto",
  required = false,
  customizable,
  errorMessage,
  isLoading = false,
  multiple = false,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customOptions, setCustomOptions] = useState<dataTypeIds[]>([]);
  const [options, setOptions] = useState<dataTypeIds[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>(multiple ? [value] : []);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      setOptions([...items, ...customOptions]);
    }
  }, [items, customOptions]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const normalizedOptions = options.map((option) => ({
    ...option,
    value: String(option.value),
  }));
  const normalizedValue = String(value);

  const selectedOption = normalizedOptions.find(
    (option) => option.value === normalizedValue
  );

  const filteredOptions = searchTerm
    ? normalizedOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : normalizedOptions;

  const handleAddCustom = () => {
    if (searchTerm.trim()) {
      const newOption = { value: searchTerm, label: searchTerm };
      setCustomOptions([...customOptions, newOption]);
      setOptions([...options, newOption]);
      onChange(newOption.value);
      setSearchTerm("");
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!open) setOpen(true);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customizable && searchTerm) {
      e.preventDefault();
      handleAddCustom();
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [searchTerm, customizable]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange(newValues.join(','));
    } else {
      onChange(optionValue);
      setSearchTerm("");
      setOpen(false);
    }
  };

  return (
    <div className={cn("space-y-1 pt-1 mt-2", className)}>
      {label && (
        <Label
          className={cn("flex items-center gap-1", errorMessage && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={cn(
            "flex items-center border rounded-md p-1",
            width === "full" ? "w-full" : "w-[250px]",
            open && "border-primary ring-2 ring-primary/20"
          )}
        >
          {/* Show selected option as text when not searching */}
          {!open && selectedOption && (
            <div className="flex-1 truncate px-2">{selectedOption.label}</div>
          )}

          {/* Show input field only when dropdown is open or no selection */}
          {(open || !selectedOption) && (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none focus:outline-none pr-8"
              placeholder={`Search ${label.toLowerCase()}...`}
              onClick={() => setOpen(true)}
            />
          )}

          <div className="flex items-center gap-1">

            {customizable && searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={handleAddCustom}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <ChevronUp className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </Button>
            )}
          </div>
        </div>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
            <Command className="w-full">
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandEmpty>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : customizable ? (
                    <div className="flex items-center justify-center p-2">
                      No options found
                    </div>
                  ) : (
                    `No ${label.toLowerCase()} found.`
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="text-xs"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          (multiple ? selectedValues.includes(option.value) : normalizedValue === option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      {/* Error and Description */}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
