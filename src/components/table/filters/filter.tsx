import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DATE_FIELDS, FILTER_CONDITIONS, Filter, formatLabel } from "@/hooks/use-filter";

interface FilterFieldSelectorProps {
    filter: Filter;
    options: { value: string; label: string }[];
    filters: Filter[];
    index: number;
    onUpdate: (index: number, filter: Filter) => void;
}

export const FilterFieldSelector = ({
    filter,
    options,
    filters,
    index,
    onUpdate,
}: FilterFieldSelectorProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-40 justify-between"
                >
                    <span className="truncate">{formatLabel(filter.id)}</span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
                <Command>
                    <CommandInput placeholder="Search fields..." />
                    <CommandList>
                        <CommandEmpty>No fields found.</CommandEmpty>
                        <CommandGroup>
                            {options
                                .filter(
                                    (option: any) =>
                                        option.value === filter.id ||
                                        !filters.some(
                                            (f, i) => i !== index && f.id === option.value,
                                        ),
                                )
                                .map((option: any) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(value) =>
                                            onUpdate(index, { ...filter, id: value })
                                        }
                                    >
                                        <span className="truncate">{option.label}</span>
                                        <Check
                                            className={cn(
                                                "ml-auto size-4",
                                                option.value === filter.id
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

interface FilterConditionSelectorProps {
    filter: Filter;
    index: number;
    onUpdate: (index: number, filter: Filter) => void;
}

export const FilterConditionSelector = ({
    filter,
    index,
    onUpdate,
}: FilterConditionSelectorProps) => {
    return (
        <Select
            value={filter.condition}
            onValueChange={(value) =>
                onUpdate(index, { ...filter, condition: value })
            }
        >
            <SelectTrigger className="h-8 w-36">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {FILTER_CONDITIONS.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface FilterValueInputProps {
    filter: Filter;
    index: number;
    onUpdate: (index: number, filter: Filter) => void;
}

export const FilterValueInput = ({
    filter,
    index,
    onUpdate,
}: FilterValueInputProps) => {
    if (filter.condition === "null") {
        return null;
    }

    if (DATE_FIELDS.includes(filter.id)) {
        return (
            <Input
                type="date"
                value={filter.value}
                onChange={(e) =>
                    onUpdate(index, {
                        ...filter,
                        value: e.target.value,
                    })
                }
                className="h-8 w-32"
            />
        );
    }

    if (filter.condition === "between") {
        return (
            <div className="flex w-64 gap-2">
                <Input
                    placeholder="Min value"
                    className="h-8"
                    value={filter.value.split(",")[0] || ""}
                    onChange={(e) => {
                        const max = filter.value.split(",")[1] || "";
                        onUpdate(index, {
                            ...filter,
                            value: `${e.target.value},${max}`,
                        });
                    }}
                />
                <Input
                    placeholder="Max value"
                    className="h-8"
                    value={filter.value.split(",")[1] || ""}
                    onChange={(e) => {
                        const min = filter.value.split(",")[0] || "";
                        onUpdate(index, {
                            ...filter,
                            value: `${min},${e.target.value}`,
                        });
                    }}
                />
            </div>
        );
    }

    if (["in", "not in"].includes(filter.condition)) {
        return (
            <Input
                value={filter.value}
                onChange={(e) => {
                    const value = e.target.value.replace(/[,\s]+/g, '.');
                    onUpdate(index, {
                        ...filter,
                        value: value,
                    });
                }}
                placeholder="Values separated by dots (.)"
                className="h-8 w-64"
            />
        );
    }

    return (
        <Input
            value={filter.value?.replace(/%/g, "")}
            onChange={(e) =>
                onUpdate(index, {
                    ...filter,
                    value: e.target.value,
                })
            }
            placeholder="Enter value"
            className="h-8 w-32"
        />
    );
};

interface FilterItemProps {
    filter: Filter;
    index: number;
    options: any[];
    filters: Filter[];
    onUpdate: (index: number, filter: Filter) => void;
    onRemove: (index: number) => void;
}

export const FilterItem = ({
    filter,
    index,
    options,
    filters,
    onUpdate,
    onRemove,
}: FilterItemProps) => {
    return (
        <div className="flex items-center gap-2">
            <FilterFieldSelector
                filter={filter}
                options={options}
                filters={filters}
                index={index}
                onUpdate={onUpdate}
            />
            <FilterConditionSelector
                filter={filter}
                index={index}
                onUpdate={onUpdate}
            />
            <FilterValueInput
                filter={filter}
                index={index}
                onUpdate={onUpdate}
            />
            <Button
                variant="outline"
                size="icon"
                onClick={() => onRemove(index)}
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
};

interface LogicOperatorSelectorProps {
    value: "AND" | "OR";
    onChange: (value: "AND" | "OR") => void;
}

export const LogicOperatorSelector = ({
    value,
    onChange,
}: LogicOperatorSelectorProps) => {
    return (
        <Select value={value} onValueChange={(value) => onChange(value as "AND" | "OR")}>
            <SelectTrigger className="h-8 w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="AND">AND (Match all filters)</SelectItem>
                <SelectItem value="OR">OR (Match any filter)</SelectItem>
            </SelectContent>
        </Select>
    );
};