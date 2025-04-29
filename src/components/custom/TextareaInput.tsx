"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

interface TextareaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  containerClassName?: string;
  predefinedOptions?: string[];
  customizable?: boolean;
}

export function TextareaInput({
  label,
  description,
  errorMessage,
  id,
  maxLength,
  containerClassName,
  predefinedOptions = [],
  customizable = false,
  value: propValue,
  onChange,
  ...props
}: TextareaInputProps) {
  const [charCount, setCharCount] = React.useState(0);
  const [value, setValue] = React.useState<string>(String(propValue || ''));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [customOptions, setCustomOptions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Check if there are any options to display
  const hasOptions = predefinedOptions.length > 0 || customOptions.length > 0;

  const options = React.useMemo(() => {
    return [...predefinedOptions, ...customOptions];
  }, [predefinedOptions, customOptions]);

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update internal value when prop value changes
  React.useEffect(() => {
    setValue(String(propValue || ''));
    setCharCount(String(propValue || '').length);
  }, [propValue]);

  const filteredOptions = React.useMemo(() => {
    return searchTerm
      ? options.filter(option =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }, [searchTerm, options]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setCharCount(newValue.length);
    
    // Only set searchTerm and open dropdown if we have options
    if (hasOptions || customizable) {
      setSearchTerm(newValue.split(' ').pop() || '');
      setOpen(true);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const handleSelect = (selectedOption: string) => {
    const words = String(value).split(' ');
    words[words.length - 1] = selectedOption;
    const newValue = words.join(' ');

    setValue(newValue);
    setCharCount(newValue.length);
    setOpen(false);

    const event = {
      target: {
        value: newValue,
        name: props.name
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;

    if (onChange) {
      onChange(event);
    }
  };

  const handleAddCustom = () => {
    if (searchTerm.trim()) {
      setCustomOptions(prev => [...prev, searchTerm]);
      handleSelect(searchTerm);
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex justify-between items-center">
        {label && <Label htmlFor={id}>{label}
          {props.required && <span className="text-red-500"> *</span>}</Label>}
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id={id}
            {...props}
            value={value}
            onChange={handleChange}
            className={cn(
              props.className, 
              errorMessage && "border-red-500", 
              (hasOptions || customizable) ? "pr-20" : ""
            )}
            rows={1}
          />
          
          {/* Only show dropdown button if there are options or component is customizable */}
          {(hasOptions || customizable) && (
            <div className="absolute right-2 top-2 flex gap-1">         
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={toggleDropdown}
              >
                {open ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Only render dropdown if open AND we have options or allow custom options */}
        {open && (hasOptions || customizable) && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
            <Command className="w-full">
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandEmpty>
                  {customizable ? (
                    <div className="flex items-center justify-between p-2">
                      <span>No options found</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={handleAddCustom}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="ml-2">Add</span>
                      </Button>
                    </div>
                  ) : (
                    "No options found"
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelect(option)}
                      className="text-sm"
                    >
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>

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