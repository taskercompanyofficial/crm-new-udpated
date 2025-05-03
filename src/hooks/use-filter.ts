import { useQueryState } from "nuqs";

export interface Filter {
    id: string;
    condition: string;
    value: string;
}

export type LogicOperator = "AND" | "OR";

export const useFilters = (availableColumns: any[]) => {
    // Format column options for selection
    const options = availableColumns
        .slice(1)
        .map((column: any) => {
            const accessor = column.accessorKey || "";
            return {
                value: accessor,
                label: formatLabel(accessor),
            };
        })
        .filter((option: any) => option.value !== "");

    // Set up query state
    const [filters, setFilters] = useQueryState<Filter[]>("filters", {
        defaultValue: [],
        parse: (value) => {
            if (!value) return [];
            try {
                return JSON.parse(value) || [];
            } catch {
                return [];
            }
        },
        serialize: (value) => {
            if (!value || value.length === 0) return "";
            return JSON.stringify(value);
        },
        shallow: false,
    });

    const [logic, setLogic] = useQueryState<LogicOperator>("logic", {
        defaultValue: "AND",
        parse: (value) => value as LogicOperator,
        serialize: (value) => value,
    });

    // Filter operations
    const updateFilter = (index: number, newFilter: Filter) => {
        setFilters((prev) => {
            if (!prev) return [newFilter];
            const updatedFilters = prev.map((f, i) => {
                if (i !== index) return f;

                if (f.id !== newFilter.id) {
                    newFilter.value = "";
                }

                if (["like", "not like"].includes(newFilter.condition)) {
                    const value = newFilter.value.trim();
                    return {
                        ...newFilter,
                        value: value ? `%${value}%` : "",
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
            (opt: any) => !filters?.some((f) => f.id === opt.value),
        );
        if (available) {
            setFilters((prev) => [
                ...(prev || []),
                { id: available.value, condition: "like", value: "" },
            ]);
        }
    };

    const removeFilter = (index: number) => {
        setFilters((prev) => {
            if (!prev) return [];
            const newFilters = prev.filter((_, i) => i !== index);
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

    const handleSortFilters = (newOrder: Filter[]) => {
        setFilters(newOrder);
    };

    return {
        filters,
        logic,
        options,
        updateFilter,
        addFilter,
        removeFilter,
        resetFilters,
        setLogic,
        handleSortFilters,
    };
};

// Helper functions
export const formatLabel = (str: string | undefined) => {
    if (!str) return "";
    const formattedStr = str.replace(/_/g, " ");
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

export const DATE_FIELDS = ["created_at", "updated_at"];

export const FILTER_CONDITIONS = [
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