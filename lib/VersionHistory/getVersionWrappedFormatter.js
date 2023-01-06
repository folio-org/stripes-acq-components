import { getHighlightedFields } from './getHighlightedFields';

export const getVersionWrappedFormatter = ({
  baseFormatter,
  changes,
  fieldsMapping,
  name,
}) => {
  const formatterEntries = Object.entries(baseFormatter);
  const fieldNames = Object.values(fieldsMapping);

  const highlights = getHighlightedFields({ changes, fieldNames, name });

  return formatterEntries.reduce((acc, [colName, renderCell]) => {
    return {
      ...acc,
      [colName]: ({ rowIndex, ...rest }) => {
        const isUpdated = highlights.includes(`${name}[${rowIndex}].${fieldsMapping[colName]}`);

        const content = renderCell({ rowIndex, ...rest });

        return isUpdated ? <mark>{content}</mark> : content;
      },
    };
  }, {});
};
