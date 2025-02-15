"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./Pagination";
import { DataTableViewOptions } from "./columnToggle";
import { DataTableFiltersToolbar } from "./filters/data-table-adavnced-toolbar";
import { DataTableSortable } from "./filters/data-table-sort-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteDialog from "./delete-dialog";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    data: TData[];
    pagination: any;
  };
  FacedFilter?: React.ReactNode;
  Create?: React.ReactNode;
  View?: React.ComponentType<any>;
  Update?: React.ComponentType<any>;
  deletePermission?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  FacedFilter,
  Create,
  View,
  Update,
  deletePermission = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {FacedFilter}
          <DataTableFiltersToolbar columns={columns} />
          <DataTableSortable columns={columns} />
        </div>
        {/* <div className="flex-1">{FacedFilter}</div> */}
        <div className="flex items-center gap-2">
          {Create}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-gray-200 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => row.toggleSelected()}
                  className={`cursor-pointer ${index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'status' || cell.column.id === 'actions') {
                      return (
                        <TableCell key={cell.id} className="text-xs sticky right-0 bg-inherit">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id} className="text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell onClick={(e) => e.stopPropagation()} className="sticky right-0 bg-inherit">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {View && <View row={row.original} />}
                        {Update && <Update row={row.original} />}
                        {deletePermission && (
                          <>
                            <DropdownMenuSeparator />
                            <DeleteDialog row={row.original} />
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pagination={data.pagination} />
    </div>
  );
}
