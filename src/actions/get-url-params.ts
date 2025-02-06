// actions/get-url-params.ts
export function buildQueryParams(params: Record<string, any>) {
  const searchParams = new URLSearchParams();

  // Handle regular params
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value.toString());
    }
  });

  // Handle filters
  if (params.filters) {
    try {
      const filters = JSON.parse(params.filters);
      if (Array.isArray(filters) && filters.length > 0) {
        searchParams.set('filters', params.filters);
        if (filters.length > 1 && params.logic) {
          searchParams.set('logic', params.logic);
        }
      }
    } catch (e) {
      console.error('Failed to parse filters', e);
    }
  }

  // Handle sorting
  if (params.sort) {
    try {
      const sort = JSON.parse(params.sort);
      if (Array.isArray(sort) && sort.length > 0) {
        searchParams.set('sort', params.sort);
      }
    } catch (e) {
      console.error('Failed to parse sort', e);
    }
  }

  return searchParams.toString();
}