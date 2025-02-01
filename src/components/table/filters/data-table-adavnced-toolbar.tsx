import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, FilterIcon, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

interface Filter {
  id: string;
  condition: string;
  value: string;
}

interface FilterToolbarProps {
  columns: { accessorKey: string }[] | any;
}

const formatLabel = (str: string | undefined) => {
    if (!str) return ''; // Return an empty string if str is undefined
    const formattedStr = str.replace(/_/g, ' ');
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  };
  
const filterConditions = [
  { value: 'contains', label: 'Contains' },
  { value: 'does-not-contain', label: 'Does not contain' },
  { value: 'equals', label: 'Equals' },
  { value: 'not-equals', label: 'Not equals' },
  { value: 'greater-than', label: 'Greater than' },
  { value: 'less-than', label: 'Less than' },
];

export function DataTableFiltersToolbar({ columns }: FilterToolbarProps) {
    const options = columns
    .slice(1)
    .map((column: any) => {
      const accessor = column.accessorKey || ''; // Ensure a fallback value
      return {
        value: accessor,
        label: formatLabel(accessor),
      };
    })
    .filter((option :any) => option.value !== ''); // Remove invalid options
  

  const id = React.useId();
  const searchParams = useSearchParams();

  let initialFilters: Filter[] = [];
  const filterParam = searchParams.get('filters');
  if (filterParam) {
    try {
      const parsed = JSON.parse(filterParam);
      if (Array.isArray(parsed)) {
        initialFilters = parsed as Filter[];
      }
    } catch (e) {
      toast.error('Failed to parse filter param');
    }
  }

  const [filters, setFilters] = React.useState<Filter[]>(initialFilters);
  const [logic, setLogic] = React.useState<'AND' | 'OR'>('AND');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const query = `filters=${JSON.stringify(filters)}&logic=${logic}`;
      window.history.replaceState(null, '', `${currentPath}?${query}`);
    }
  }, [filters, logic]);

  const updateFilter = (index: number, newFilter: Filter) => {
    setFilters((prev) => prev.map((f, i) => (i === index ? newFilter : f)));
  };

  const addFilter = () => {
    if (options.length === 0) return;
    const available = options.find((opt:any) => !filters.some((f) => f.id === opt.value));
    if (available) {
      setFilters([...filters, { id: available.value, condition: 'contains', value: '' }]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    setFilters([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="size-3" aria-hidden="true" />
          Filters
          {filters.length > 0 && (
            <Badge variant="secondary" className="h-[1.14rem] px-[0.32rem] font-mono text-[0.65rem]">
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-52 p-4" dir='right'>
        <div className="flex flex-col gap-2">
          {filters.length > 0 ? (
            filters.map((filter, index) => {
              const fieldTriggerId = `filter-${index}-field-trigger`;
              const availableOptions = options.filter(
                (option:any) => option.value === filter.id || !filters.some((f, i) => i !== index && f.id === option.value)
              );

              return (
                <div key={index} className="flex items-center gap-2">
                  {/* Column Selection */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id={fieldTriggerId} variant="outline" size="sm" className="h-8 w-36 justify-between">
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
                            {availableOptions.map((option:any) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(value) => updateFilter(index, { ...filter, id: value })}
                              >
                                <span className="truncate">{option.label}</span>
                                <Check className={cn('ml-auto size-4', option.value === filter.id ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Condition Selection */}
                  <Select value={filter.condition} onValueChange={(value) => updateFilter(index, { ...filter, condition: value })}>
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

                  {/* Value Input */}
                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(index, { ...filter, value: e.target.value })}
                    placeholder="Enter value"
                    className="h-8 w-32"
                  />

                  {/* Remove Filter */}
                  <Button variant="outline" size="icon" onClick={() => removeFilter(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No filters applied.</p>
          )}

          {/* AND / OR Toggle */}
          {filters.length > 1 && (
            <Select value={logic} onValueChange={(value) => setLogic(value as 'AND' | 'OR')}>
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

        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" onClick={addFilter} disabled={filters.length >= options.length}>
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
