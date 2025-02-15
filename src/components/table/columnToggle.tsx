"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { exportTableToCSV } from "@/lib/export";
import {
  CheckIcon,
  ChevronsUpDown,
  DownloadIcon,
  Settings2,
} from "lucide-react";
import { cn, toSentenceCase } from "@/lib/utils";
import React, { useEffect } from "react";
import { TasksTableFloatingBar } from "./filters/tasks-table-floating-bar";
import { DeleteTasksDialog } from "./filters/delete-tasks-dialog";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Load column visibility state from localStorage on mount
  useEffect(() => {
    const savedColumnVisibility = localStorage.getItem("tableColumnVisibility");
    if (savedColumnVisibility) {
      table.setColumnVisibility(JSON.parse(savedColumnVisibility));
    }
  }, [table]);

  // Save column visibility state to localStorage when it changes
  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    const newState = {
      ...table.getState().columnVisibility,
      [columnId]: visible,
    };
    table.setColumnVisibility(newState);
    localStorage.setItem("tableColumnVisibility", JSON.stringify(newState));
  };

  return (
    <div className="flex gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTasksDialog
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        ref={triggerRef}
        aria-label="Toggle columns"
        variant="outline"
        role="combobox"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "Records",
            excludeColumns: ["select", "actions"],
          })
        }
        className="ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex"
      >
        <DownloadIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        Export
      </Button>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            className="ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex"
          >
            <Settings2 className="size-4" />
            View
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-44 p-0"
          onCloseAutoFocus={() => triggerRef.current?.focus()}
        >
          <Command>
            <CommandInput placeholder="Search columns..." />
            <CommandList>
              <CommandEmpty>No columns found.</CommandEmpty>
              <CommandGroup>
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <CommandItem
                        key={column.id}
                        onSelect={() =>
                          handleColumnVisibilityChange(
                            column.id,
                            !column.getIsVisible(),
                          )
                        }
                      >
                        <span className="truncate">
                          {toSentenceCase(column.id)}
                        </span>
                        <CheckIcon
                          className={cn(
                            "ml-auto size-4 shrink-0",
                            column.getIsVisible() ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <>
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <TasksTableFloatingBar table={table} />
        ) : null}
      </>
    </div>
  );
}
