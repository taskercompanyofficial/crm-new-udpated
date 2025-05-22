import { type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpIcon,
  EyeClosed,
  ArrowUpDown,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
import { ArrowDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueValues = useMemo(() => {
    const values = Array.from(new Set(
      column.getFacetedUniqueValues().keys()
    )).filter(Boolean);
    return values;
  }, [column]);

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? "Sorted descending. Click to sort ascending."
                : column.getIsSorted() === "asc"
                  ? "Sorted ascending. Click to sort descending."
                  : "Not sorted. Click to sort ascending."
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-2xs font-bold data-[state=open]:bg-accent"
          >
            <span className="text-2xs">{title}</span>
            {column.getIsFiltered() && (
              <Filter className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <div className="p-2">
            <Input
              placeholder="Search values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-[200px] overflow-auto space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterValues.length === uniqueValues.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterValues(uniqueValues);
                      column.setFilterValue(uniqueValues);
                    } else {
                      setFilterValues([]);
                      column.setFilterValue([]);
                    }
                  }}
                />
                <span className="text-sm">Select All</span>
              </div>
              {uniqueValues
                .filter(value => 
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filterValues.includes(value)}
                      onCheckedChange={(checked) => {
                        const updatedValues = checked
                          ? [...filterValues, value]
                          : filterValues.filter((v) => v !== value);
                        setFilterValues(updatedValues);
                        column.setFilterValue(updatedValues);
                      }}
                    />
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Hide column"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeClosed
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
