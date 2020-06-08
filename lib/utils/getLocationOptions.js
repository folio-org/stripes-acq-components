export const getLocationOptions = (locations) => locations?.map(({ name, id, code }) => ({
  label: `${name} (${code})`,
  value: id,
})) ?? [];
