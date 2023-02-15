export const getVersionWrappedFormatter = ({
  baseFormatter,
  fieldsMapping,
  name,
  paths,
}) => {
  const formatterEntries = Object.entries(baseFormatter);

  return formatterEntries.reduce((acc, [colName, renderCell]) => {
    return {
      ...acc,
      [colName]: ({ rowIndex, ...rest }) => {
        const isUpdated = paths?.includes(`${name}[${rowIndex}].${fieldsMapping[colName]}`);

        const content = renderCell({ rowIndex, ...rest });

        return isUpdated ? <mark>{content}</mark> : content;
      },
    };
  }, {});
};
