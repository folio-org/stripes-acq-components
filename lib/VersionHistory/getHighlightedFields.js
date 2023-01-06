import { FIELD_CHANGE_TYPES } from '../utils';

/*
  To check if the end of a path leads to an array element instead of an object key.

  From the objects difference point of view it means that an element has been added (removed) to (from)
  array (repeatable field), which means that the entire row in the MCL should be highlighted.
*/
const regExp = /.*\[\d\]$/;

export const getHighlightedFields = ({ changes = [], fieldNames = [], name }) => {
  return (
    changes
      .filter(({ path }) => String(path).startsWith(name))
      .reduce((acc, curr) => {
        const pathsMap = {
          [FIELD_CHANGE_TYPES.create]: regExp.test(curr.path)
            ? fieldNames.map((fieldName) => `${curr.path}.${fieldName}`)
            : [curr.path],
          [FIELD_CHANGE_TYPES.update]: [curr.path],
        };

        const paths = pathsMap[curr.type] || [];

        return acc.concat(paths);
      }, [])
  );
};
