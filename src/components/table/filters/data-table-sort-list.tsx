import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import type { SortDirection } from '@tanstack/react-table';
import {
  ArrowDownUp,
  Check,
  ChevronsUpDown,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface DataTableProps<TData, TValue> {
  columns: any;
}

/**
 * Sorting represents a single sort item: the column identifier and
 * its sort direction (descending if true).
 */
interface Sorting {
  id: string;
  desc: boolean;
}

/**
 * Formats a string by replacing underscores with spaces and capitalizing the first letter.
 */
const formatLabel = (str: string) =>
  str
    .replace(/_/g, ' ')
    .charAt(0)
    .toUpperCase() + str.replace(/_/g, ' ').slice(1);

/**
 * Our advanced toolbar component.
 */
export function DataTableSortable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  // Build options from columns (skip the first column).
  const options = columns.slice(1).map((column: any) => {
    const accessor = column.accessorKey || '';
    return {
      value: accessor,
      label: formatLabel(accessor),
    };
  });

  const id = React.useId();
  const searchParams = useSearchParams();

  // Parse the initial sort state from the URL (using key "sort").
  let initialSort: Sorting[] = [];
  const sortParam = searchParams.get('sort');
  if (sortParam) {
    try {
      const parsed = JSON.parse(sortParam);
      if (Array.isArray(parsed)) {
        initialSort = parsed as Sorting[];
      }
    } catch (e) {
      console.error('Failed to parse sort param', e);
    }
  }

  // Local state for sort items.
  const [sortState, setSortState] = React.useState<Sorting[]>(initialSort);

  // Instead of using router.push (which encodes the URL), update the URL manually.
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      // Construct the query string with existing params and the new sort state.
      params.set('sort', JSON.stringify(sortState));
      window.history.replaceState(null, "", `${currentPath}?${params.toString()}`);
    }
  }, [sortState]);

  /**
   * Update a sort item at a given index.
   */
  const updateSort = (index: number, newSort: Sorting) => {
    setSortState((prev) =>
      prev.map((s, i) => (i === index ? newSort : s))
    );
  };

  /**
   * Add a new sort row (defaulting to the first available option with desc false).
   */
  const addSort = () => {
    if (options.length === 0) return;
    // Only add if there is at least one option not already selected.
    const selectedIds = sortState.map((s) => s.id);
    const available = options.find(
      (opt:any) => !selectedIds.includes(opt.value)
    );
    if (available) {
      setSortState((prev) => [...prev, { id: available.value, desc: false }]);
    }
  };

  /**
   * Remove a sort row at a given index.
   */
  const removeSort = (index: number) => {
    setSortState((prev) => {
      const newSortState = prev.filter((_, i) => i !== index);
      // Update the URL with the new sort state while preserving other params.
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        params.set('sort', JSON.stringify(newSortState));
        window.history.replaceState(null, "", `${currentPath}?${params.toString()}`);
      }
      return newSortState;
    });
  };

  /**
   * Reset the entire sort state and remove the sort param from the URL.
   */
  const resetSort = () => {
    setSortState([]);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      params.delete('sort'); // Remove the sort param
      window.history.replaceState(null, "", `${currentPath}?${params.toString()}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          aria-label="Open sorting"
          aria-controls={`${id}-sort-dialog`}
        >
          <ArrowDownUp className="size-3" aria-hidden="true" />
          Sort
          {sortState.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
            >
              {sortState.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={`${id}-sort-dialog`}
        align="start"
        collisionPadding={16}
        className={cn(
          'flex w-[calc(100vw-theme(spacing.20))] min-w-72 max-w-[25rem] origin-[var(--radix-popover-content-transform-origin)] flex-col p-4 sm:w-[25rem]'
        )}
      >
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto p-0.5">
          {sortState.length > 0 ? (
            <>
              {sortState.map((sort, index) => {
                const sortItemId = `${id}-sort-${index}`;
                const fieldListboxId = `${sortItemId}-field-listbox`;
                const fieldTriggerId = `${sortItemId}-field-trigger`;
                const directionListboxId = `${sortItemId}-direction-listbox`;

                // For the column select dropdown, filter out options that are already selected
                // in other rows (but include this row’s current value).
                const availableOptions = options.filter(
                  (option: any) =>
                    option.value === sort.id ||
                    !sortState.some((s, i) => i !== index && s.id === option.value)
                );

                return (
                  <div key={sortItemId} className="flex items-center gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          id={fieldTriggerId}
                          variant="outline"
                          size="sm"
                          role="combobox"
                          className="h-8 w-full justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                          aria-controls={fieldListboxId}
                        >
                          <span className="truncate">
                            {formatLabel(sort.id)}
                          </span>
                          <div className="ml-auto flex items-center gap-1">
                            {sortState.length === 1 && (
                              <Badge
                                variant="secondary"
                                className="h-[1.125rem] rounded px-1 font-mono font-normal text-[0.65rem]"
                              >
                                Default
                              </Badge>
                            )}
                            <ChevronsUpDown
                              className="size-4 shrink-0 opacity-50"
                              aria-hidden="true"
                            />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id={fieldListboxId}
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        onCloseAutoFocus={() =>
                          document.getElementById(fieldTriggerId)?.focus()
                        }
                      >
                        <Command>
                          <CommandInput placeholder="Search fields..." />
                          <CommandList>
                            <CommandEmpty>No fields found.</CommandEmpty>
                            <CommandGroup>
                              {availableOptions.map((option: any) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(value) => {
                                    updateSort(index, {
                                      id: value,
                                      desc: sort.desc,
                                    });
                                    // Optionally, set focus on the new trigger.
                                    const newFieldTriggerId = `${id}-sort-${index}-field-trigger`;
                                    requestAnimationFrame(() => {
                                      document
                                        .getElementById(newFieldTriggerId)
                                        ?.focus();
                                    });
                                  }}
                                >
                                  <span className="mr-1.5 truncate">
                                    {option.label}
                                  </span>
                                  <Check
                                    className={`ml-auto size-4 shrink-0 ${
                                      option.value === sort.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                                    aria-hidden="true"
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={sort.desc ? 'desc' : 'asc'}
                      onValueChange={(value: SortDirection) =>
                        updateSort(index, {
                          id: sort.id,
                          desc: value === 'desc',
                        })
                      }
                    >
                      <SelectTrigger
                        aria-label="Select sort direction"
                        aria-controls={directionListboxId}
                        className="h-8 w-full rounded"
                      >
                        <div className="truncate">
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent
                        id={directionListboxId}
                        className="min-w-[var(--radix-select-trigger-width)]"
                      >
                        {[
                          { value: 'asc', label: 'Ascending' },
                          { value: 'desc', label: 'Descending' },
                        ].map((order) => (
                          <SelectItem key={order.value} value={order.value}>
                            {order.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Remove sort ${formatLabel(sort.id)}`}
                      className="size-8 shrink-0 rounded"
                      onClick={() => removeSort(index)}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="mb-2">
            <h3 className='font-semibold text-lg'>
            No sorting applied.
            </h3>
            <p className='text-sm text-muted-foreground'>
            Add sorting to organize your results.
            </p>
          </div>
          )}
        </div>
        <div className="flex w-full items-center gap-2 mt-2">
          <Button
            size="sm"
            className="h-[1.85rem] rounded"
            onClick={addSort}
            disabled={sortState.length >= options.length}
          >
            Add sort
          </Button>
          {sortState.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="rounded"
              onClick={resetSort}
            >
              Reset sorting
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
