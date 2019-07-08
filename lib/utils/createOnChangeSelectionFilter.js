// eslint-disable-next-line import/prefer-default-export
export const createOnChangeSelectionFilter = (onChange, filterName) => {
  return value => onChange({ name: filterName, values: [value] });
};
