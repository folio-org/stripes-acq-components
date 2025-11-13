/**
 * Path manipulation utilities using lodash
 */

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import unset from 'lodash/unset';

/**
 * Get value by path from object
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
 * @returns {*} Value at path, or undefined if path doesn't exist
 */
export const getByPath = (obj, path) => {
  if (!path) return obj;

  return get(obj, path);
};

/**
 * Set value by path in object (immutably)
 * @param {Object} obj - Object to set value in
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 * @returns {Object} Modified object (new copy)
 */
export const setByPath = (obj, path, value) => {
  if (!path) return obj;
  const result = cloneDeep(obj);

  set(result, path, value);

  return result;
};

/**
 * Check if path exists in object
 * @param {Object} obj - Object to check
 * @param {string} path - Dot notation path
 * @returns {boolean} True if path exists
 */
export const hasPath = (obj, path) => {
  if (!path) return true;

  return has(obj, path);
};

/**
 * Delete value by path from object (immutably)
 * @param {Object} obj - Object to delete value from
 * @param {string} path - Dot notation path
 * @returns {Object} Modified object (new copy)
 */
export const deleteByPath = (obj, path) => {
  if (!path) return obj;
  const result = cloneDeep(obj);

  // Check if we're deleting from an array to use splice instead of unset
  // This maintains array indices (shifts elements) like the original implementation
  const pathParts = path.split(/[.[\]]/).filter(Boolean);
  const lastKey = pathParts.at(-1);
  const parentPath = pathParts.slice(0, -1).join('.');

  if (parentPath && !Number.isNaN(lastKey)) {
    const parent = parentPath ? get(result, parentPath) : result;

    if (Array.isArray(parent)) {
      parent.splice(Number.parseInt(lastKey, 10), 1);

      return result;
    }
  }

  unset(result, path);

  return result;
};
