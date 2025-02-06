import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, FilterIcon, Trash2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface Filter {
  id: string;
  condition: string;
  value: string;
}

interface FilterToolbarProps {
  columns: { accessorKey: string }[] | any;
}

const formatLabel = (str: string | undefined) => {
  if (!str) return "";
  const formattedStr = str.replace(/_/g, " ");
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

const filterConditions = [
  { value: "like", label: "Contains" },
  { value: "not like", label: "Does not contain" },
  { value: "=", label: "Equals" },
  { value: "!=", label: "Not equals" },
  { value: "null", label: "Is Empty" },
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: ">=", label: "Greater than or equal" },
  { value: "<=", label: "Less than or equal" },
  { value: "in", label: "In" },
  { value: "not in", label: "Not in" },
  { value: "between", label: "Between" },
];

export function DataTableFiltersToolbar({ columns }: FilterToolbarProps) {
  const options = columns
    .slice(1)
    .map((column: any) => {
      const accessor = column.accessorKey || "";
      return {
        value: accessor,
        label: formatLabel(accessor),
      };
    })
    .filter((option: any) => option.value !== "");

  const searchParams = useSearchParams();

  // Initialize filters from URL, but only if there are actual filters
  let initialFilters: Filter[] = [];
  const filterParam = searchParams.get("filters");
  if (filterParam) {
    try {
      const parsed = JSON.parse(filterParam);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialFilters = parsed as Filter[];
      }
    } catch (e) {
      toast.error("Failed to parse filter param");
    }
  }

  const [filters, setFilters] = React.useState<Filter[]>(initialFilters);
  // Only initialize logic state if there are multiple filters
  const [logic, setLogic] = React.useState<"AND" | "OR">(
    initialFilters.length > 1
      ? (searchParams.get("logic") as "AND" | "OR") || "AND"
      : "AND",
  );

  // Update URL only when needed
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams();

      // Only add filters if there are any
      if (filters.length > 0) {
        searchParams.set("filters", JSON.stringify(filters));
        // Only add logic parameter if there are multiple filters
        if (filters.length > 1) {
          searchParams.set("logic", logic);
        }
      }

      // Get other existing params that we want to preserve
      const currentParams = new URLSearchParams(window.location.search);
      ["page", "per_page", "sort"].forEach((param) => {
        if (currentParams.has(param)) {
          searchParams.set(param, currentParams.get(param)!);
        }
      });

      // Update URL only if there are parameters, otherwise use clean URL
      const queryString = searchParams.toString();
      const newUrl = queryString
        ? `${currentPath}?${queryString}`
        : currentPath;

      window.history.replaceState(null, "", newUrl);
    }
  }, [filters, logic]);

  const updateFilter = (index: number, newFilter: Filter) => {
    setFilters((prev) => {
      const updatedFilters = prev.map((f, i) => {
        if (i !== index) return f;

        // Handle like conditions
        if (
          ["like", "not like"].includes(newFilter.condition) &&
          newFilter.value
        ) {
          // Only add % if it's not already there
          const value = newFilter.value.startsWith("%")
            ? newFilter.value
            : `%${newFilter.value}`;
          return {
            ...newFilter,
            value: value.endsWith("%") ? value : `${value}%`,
          };
        }
        return newFilter;
      });

      return updatedFilters;
    });
  };

  const addFilter = () => {
    if (options.length === 0) return;
    const available = options.find(
      (opt: any) => !filters.some((f) => f.id === opt.value),
    );
    if (available) {
      setFilters([
        ...filters,
        { id: available.value, condition: "like", value: "" },
      ]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => {
      const newFilters = prev.filter((_, i) => i !== index);
      // If we're removing a filter and only one remains, no need for logic anymore
      if (newFilters.length <= 1) {
        setLogic("AND");
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters([]);
    setLogic("AND");
  };

  const renderValueInput = (filter: Filter) => {
    if (filter.condition === "between") {
      return (
        <div className="flex w-64 gap-2">
          <Input
            placeholder="Min value"
            className="h-8"
            value={filter.value.split(",")[0] || ""}
            onChange={(e) => {
              const max = filter.value.split(",")[1] || "";
              updateFilter(filters.indexOf(filter), {
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
              updateFilter(filters.indexOf(filter), {
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
          onChange={(e) =>
            updateFilter(filters.indexOf(filter), {
              ...filter,
              value: e.target.value,
            })
          }
          placeholder="Comma separated values"
          className="h-8 w-64"
        />
      );
    }

    if (filter.condition === "null") {
      return null;
    }

    return (
      <Input
        value={filter.value}
        onChange={(e) =>
          updateFilter(filters.indexOf(filter), {
            ...filter,
            value: e.target.value,
          })
        }
        placeholder="Enter value"
        className="h-8 w-32"
      />
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="size-3" aria-hidden="true" />
          Filters
          {filters.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] px-[0.32rem] font-mono text-[0.65rem]"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-4" dir="right">
        <div className="flex flex-col gap-2">
          {filters.length > 0 ? (
            filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-36 justify-between"
                    >
                      <span className="truncate">{formatLabel(filter.id)}</span>
                      <ChevronsUpDown className="size-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0">
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
                                  (f, i) =>
                                    i !== index && f.id === option.value,
                                ),
                            )
                            .map((option: any) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(value) =>
                                  updateFilter(index, { ...filter, id: value })
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

                <Select
                  value={filter.condition}
                  onValueChange={(value) =>
                    updateFilter(index, { ...filter, condition: value })
                  }
                >
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterConditions.map((cond) => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {renderValueInput(filter)}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFilter(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No filters applied.</p>
          )}

          {filters.length > 1 && (
            <Select
              value={logic}
              onValueChange={(value) => setLogic(value as "AND" | "OR")}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND (Match all filters)</SelectItem>
                <SelectItem value="OR">OR (Match any filter)</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            onClick={addFilter}
            disabled={filters.length >= options.length}
          >
            Add filter
          </Button>
          {filters.length > 0 && (
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
