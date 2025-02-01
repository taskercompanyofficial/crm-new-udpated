import React, { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckIcon, PlusCircle,  } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type OptionType = {
  label: string;
  value: string;
};

interface SelectInputProps {
  options: OptionType[] | null;
  label: string;
  param: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ options, label, param }) => {
  const [filterValue, setFilterValue] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleStatusChange = (value: string) => {
    setFilterValue(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full overflow-hidden border-dashed md:max-w-[150px] h-8"
        >
          {filterValue ? (
            <>
              <Badge
                variant="secondary"
                className="w-full overflow-hidden rounded-sm px-1 font-normal"
              >
                {options?.find((option) => option.value === filterValue)
                  ?.label || filterValue}
              </Badge>
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              {label}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto">
              {options?.map((option) => {
                const isSelected = filterValue === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleStatusChange(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {filterValue && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleStatusChange("")}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectInput;
