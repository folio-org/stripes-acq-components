// eslint-disable-next-line import/prefer-default-export
export const createClearFilterHandler = (onChange, name) => () => {
  onChange({ name, values: [] });
};
