export const buildQueryParams = (
  params: Record<string, string | undefined>
) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "") // Exclude undefined or empty values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join("&");
};
