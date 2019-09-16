// eslint-disable-next-line import/prefer-default-export
export const filterArrayValues = (value, dataOptions) => {
  const regex = new RegExp(value, 'i');

  const renderedItems = value
    ? dataOptions.filter(item => item.search(regex) !== -1)
    : dataOptions;

  return { renderedItems };
};
