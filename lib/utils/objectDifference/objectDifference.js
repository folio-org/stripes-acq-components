import {
  has,
  isEmpty,
  isEqual,
  isObject,
} from 'lodash';

const isEmptyObject = (value) => isObject(value) && isEmpty(value);

export const getObjectKey = (obj, key) => (
  Array.isArray(obj) && Number.isInteger(+key)
    ? Number(key)
    : key
);

export const FIELD_CHANGE_TYPES = {
  create: 'create',
  update: 'update',
  delete: 'delete',
};

export const finalFormPathBuilder = (pathArray) => pathArray.reduce((acc, curr) => {
  return acc.concat(Number.isInteger(+curr) ? `[${curr}]` : `.${curr}`);
});

/**
 * Returns a list of changes containing modified (created, deleted, updated) fields' path, values and type of change.
 *
 * @param {Object} first - JSON-like object
 * @param {Object} second - JSON-like object
 *
 * @example // returns
 * [
 *  { type: 'create', path: ['foo', 0, 'bar'], values: [undefined, 'newValue'] },
 *  { type: 'update', path: ['baz', 'foo'], values: ['oldValue', 'newValue'] },
 *  { type: 'delete', path: ['fizz', 'buzz', 0, 'value'], values: ['oldValue', undefined] },
 * ]
 */
export const objectDifference = (
  first,
  second,
  pathParser = finalFormPathBuilder,
) => {
  const pushChange = (type, pathAccum, key, diffs, values) => {
    const newPath = pathAccum.concat(key);

    diffs.push({ type, values, path: pathParser(newPath) });

    return newPath;
  };

  const getDiff = (firstObject, secondObject, pathAccum, diffs) => {
    if (Object.is(first, second)) return diffs;

    const firstObjectKeys = Object.keys(firstObject);
    const secondObjectKeys = Object.keys(secondObject);

    // Check if a field was removed from the first object
    firstObjectKeys.forEach((objectKey) => {
      const key = getObjectKey(firstObject, objectKey);

      if (!has(secondObject, key)) {
        pushChange(
          FIELD_CHANGE_TYPES.delete,
          pathAccum,
          key,
          diffs,
          [firstObject[key], undefined],
        );
      }
    });

    secondObjectKeys.forEach((objectKey) => {
      const key = getObjectKey(secondObject, objectKey);
      const firstObjectValue = firstObject[key];
      const secondObjectValue = secondObject[key];

      // Check if a field was added to the second object
      if (!has(firstObject, key)) {
        pushChange(
          FIELD_CHANGE_TYPES.create,
          pathAccum,
          key,
          diffs,
          [firstObjectValue, secondObjectValue],
        );
        // Check if a field was updated in the second object
      } else if (!isEqual(firstObjectValue, secondObjectValue)) {
        const isSomeNotObject = !isObject(firstObjectValue) || !isObject(secondObjectValue);
        const isBothEmptyObjects = isEmptyObject(firstObjectValue) && isEmptyObject(secondObjectValue);

        if (isSomeNotObject || isBothEmptyObjects) {
          pushChange(
            FIELD_CHANGE_TYPES.update,
            pathAccum,
            key,
            diffs,
            [firstObjectValue, secondObjectValue],
          );
        } else {
          getDiff(firstObject[key], secondObject[key], pathAccum.concat(key), diffs);
        }
      }
    });

    return diffs;
  };

  return getDiff(first, second, [], []);
};
