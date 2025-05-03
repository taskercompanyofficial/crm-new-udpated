import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListFilter, GripVertical } from "lucide-react";
import { Sortable, SortableContent, SortableItem, SortableItemHandle } from "@/components/ui/sortable";
import { useFilters } from "@/hooks/use-filter";
import {
  FacetedFilter,
  FacetedFilterContent,
  FacetedFilterTrigger,
} from "@/components/ui/faceted-filter";
import { FilterItem, LogicOperatorSelector } from "./filter";

interface FilterToolbarProps {
  columns: { accessorKey: string }[] | any;
}

export function DataTableFiltersToolbar({ columns }: FilterToolbarProps) {
  const {
    filters,
    logic,
    options,
    updateFilter,
    addFilter,
    removeFilter,
    resetFilters,
    setLogic,
    handleSortFilters,
  } = useFilters(columns);

  return (
    <FacetedFilter>
      <FacetedFilterTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListFilter className="size-3" aria-hidden="true" />
          Filters
          {filters && filters.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] px-[0.32rem] font-mono text-[0.65rem]"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
      </FacetedFilterTrigger>
      <FacetedFilterContent className="min-w-md md:min-w-lg w-fit p-4" align="start">
        <div className="flex flex-col gap-2">
          {filters && filters.length > 0 ? (
            <Sortable
              value={filters}
              onValueChange={handleSortFilters}
              getItemValue={(filter) => `${filter.id}-${filters.indexOf(filter)}`}
            >
              <SortableContent>
                <div className="space-y-2">
                  {filters.map((filter, index) => (
                    <SortableItem
                      value={`${filter.id}-${index}`}
                      key={`${filter.id}-${index}`}
                    >
                      <div className="flex items-center gap-2 border rounded-md p-2 bg-background">
                        <SortableItemHandle asChild>
                          <GripVertical className="size-4 cursor-move text-muted-foreground" />
                        </SortableItemHandle>
                        <FilterItem
                          filter={filter}
                          index={index}
                          options={options}
                          filters={filters}
                          onUpdate={updateFilter}
                          onRemove={removeFilter}
                        />
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContent>
            </Sortable>
          ) : (
            <p className="text-sm text-muted-foreground">No filters applied.</p>
          )}

          {filters && filters.length > 1 && (
            <LogicOperatorSelector
              value={logic}
              onChange={setLogic}
            />
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            onClick={addFilter}
            disabled={filters && filters.length >= options.length}
          >
            Add filter
          </Button>
          {filters && filters.length > 0 && (
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      </FacetedFilterContent>
    </FacetedFilter>
  );
}