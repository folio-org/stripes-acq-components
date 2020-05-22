export const getFundsForSelect = (funds) => funds?.map(({ name, code, id }) => ({
  label: `${name} (${code})`,
  value: id,
}));
