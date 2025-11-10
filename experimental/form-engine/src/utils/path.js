/**
 * Path manipulation utilities
 */

import { isNullish } from './checks';

/**
 * Convert string key to number if it represents a valid array index
 * @param {string} key - String key to convert
 * @returns {number|null} Numeric key or null if not a valid numeric string
 * @private
 */
const parseNumericKey = (key) => {
  if (typeof key !== 'string') return null;
  return /^\d+$/.test(key) ? parseInt(key, 10) : null;
};

/**
 * Parse path into keys array
 * Supports both dot notation and array indices: 'field[0].subField[1]'
 * @param {string} path - Dot notation path with optional array indices
 * @returns {Array} Array of keys (strings or numbers for array indices)
 * @private
 */
const parsePath = (path) => {
  if (!path) return [];

  const keys = [];
  const parts = path.split('.');

  for (const part of parts) {
    // Check if part contains array index like 'field[0]' or '[0]'
    // Regex matches: 'field[0]' -> ['field', '0'] or '[0]' -> ['', '0']
    const arrayIndexMatch = part.match(/^(.+?)\[(\d+)\]$/);

    if (arrayIndexMatch) {
      // Part has array index: 'field[0]' -> ['field', 0] or '[0]' -> [0]
      const fieldName = arrayIndexMatch[1];
      const index = parseInt(arrayIndexMatch[2], 10);

      // If field name exists (not just '[0]'), add it first
      // Example: 'array[0]' -> ['array', 0], '[0]' -> [0]
      if (fieldName) {
        keys.push(fieldName);
      }

      // Add array index as number (not string) for proper array access
      keys.push(index);
    } else {
      // Regular field name without array index
      keys.push(part);
    }
  }

  return keys;
};

/**
 * Navigate to path in object
 * @param {Object} obj - Object to navigate
 * @param {Array} keys - Array of keys
 * @param {boolean} createMissing - Whether to create missing objects
 * @returns {Object} Navigation result
 * @private
 */

/**
 * Handle nullish current value
 * @param {*} current - Current value
 * @param {*} key - Current key
 * @param {Array} keys - All keys
 * @param {number} i - Current index
 * @param {boolean} createMissing - Whether to create missing objects
 * @returns {Object|null} Updated current or null if path doesn't exist
 * @private
 */
const handleNullish = (current, key, keys, i, createMissing) => {
  if (!createMissing) {
    return null;
  }

  // Create appropriate structure based on current key type
  const nextKey = keys[i + 1];

  return typeof key === 'number' ? [] : (typeof nextKey === 'number' ? [] : {});
};

/**
 * Handle array index navigation
 * @param {*} current - Current value
 * @param {number} key - Array index
 * @param {Array} keys - All keys
 * @param {number} i - Current index
 * @param {boolean} createMissing - Whether to create missing objects
 * @returns {Object|null} Updated current or null if path doesn't exist
 * @private
 */
const handleArrayIndex = (current, key, keys, i, createMissing) => {
  if (!Array.isArray(current)) {
    return null;
  }

  if (createMissing) {
    const nextKey = keys[i + 1];

    while (current.length <= key) {
      current.push(typeof nextKey === 'number' ? [] : {});
    }
  } else if (key >= current.length || key < 0) {
    return null;
  }

  return current[key];
};

/**
 * Handle object key navigation
 * @param {*} current - Current value
 * @param {string} key - Object key
 * @param {Array} keys - All keys
 * @param {number} i - Current index
 * @param {boolean} createMissing - Whether to create missing objects
 * @returns {Object|null} Updated current or null if path doesn't exist
 * @private
 */
const handleObjectKey = (current, key, keys, i, createMissing) => {
  if (Array.isArray(current)) {
    return null;
  }

  if (createMissing && !(key in current)) {
    const nextKey = keys[i + 1];

    current[key] = typeof nextKey === 'number' ? [] : {};
  } else if (!createMissing && !(key in current)) {
    return null;
  }

  return current[key];
};

const navigateToPath = (obj, keys, createMissing = false) => {
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    // Handle nullish current
    if (isNullish(current)) {
      const newCurrent = handleNullish(current, key, keys, i, createMissing);

      if (newCurrent === null) {
        return { current: null, found: false };
      }

      current = newCurrent;
    }

    // Special handling: if current is array and key is string that represents a number
    // Try to use it as array index first
    if (Array.isArray(current) && typeof key === 'string') {
      const numericKey = parseNumericKey(key);
      
      if (numericKey !== null) {
        // Key is a numeric string, try as array index first
        const arrayResult = handleArrayIndex(current, numericKey, keys, i, createMissing);
        
        if (arrayResult !== null) {
          current = arrayResult;
          continue;
        }
        // If array access failed, fall through to try as object key (unlikely but possible)
      }
    }

    // Handle array index
    if (typeof key === 'number') {
      const newCurrent = handleArrayIndex(current, key, keys, i, createMissing);

      if (newCurrent === null) {
        return { current: null, found: false };
      }

      current = newCurrent;
    } else {
      // Handle object key
      const newCurrent = handleObjectKey(current, key, keys, i, createMissing);

      if (newCurrent === null) {
        return { current: null, found: false };
      }

      current = newCurrent;
    }
  }

  return { current, found: true };
};

/**
 * Get value by path from object
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
 * @returns {*} Value at path, or undefined if path doesn't exist
 */
export const getByPath = (obj, path) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const { current, found } = navigateToPath(obj, keys);

  // If path doesn't exist, return undefined (not null)
  // null is a valid value that might exist at the path
  if (!found) {
    return undefined;
  }

  return current;
};

/**
 * Set value by path in object
 * @param {Object} obj - Object to set value in
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export const setByPath = (obj, path, value) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  let current = result;

  // Navigate to parent of final key, creating missing structures
  for (let i = 0; i < keys.length - 1; i++) {
    let key = keys[i];
    const nextKey = keys[i + 1];

    // Special handling: if current is array and key is string that represents a number
    // Convert it to number for array access
    // For setByPath, we always create missing structures, so allow array extension
    if (Array.isArray(current) && typeof key === 'string') {
      const numericKey = parseNumericKey(key);
      if (numericKey !== null && numericKey >= 0) {
        // Convert to numeric key
        key = numericKey;
        // Extend array if needed (current is already cloned, safe to mutate)
        if (current.length <= numericKey) {
          while (current.length <= numericKey) {
            current.push(undefined);
          }
        }
      }
    }

    // Create missing structure based on next key type
    // If next key is number, we need array; otherwise object
    // Also check if next key is a numeric string and current would be array
    let shouldBeArray = typeof nextKey === 'number';
    if (!shouldBeArray && parseNumericKey(nextKey) !== null) {
      // Next key is numeric string - check if current[key] should be array
      // This is a heuristic: if we're navigating to an array index, parent should be array
      shouldBeArray = true;
    }

    if (isNullish(current[key])) {
      current[key] = shouldBeArray ? [] : {};
    } else if (Array.isArray(current[key])) {
      // Clone existing array to maintain immutability
      current[key] = [...current[key]];
    } else {
      // Clone existing object to maintain immutability
      current[key] = { ...current[key] };
    }

    current = current[key];
  }

  // Set the final value
  let lastKey = keys[keys.length - 1];

  // Special handling: if current is array and lastKey is string that represents a number
  // Convert it to number for array access
  if (Array.isArray(current) && typeof lastKey === 'string') {
    const numericKey = parseNumericKey(lastKey);
    if (numericKey !== null) {
      lastKey = numericKey;
    }
  }

  // Handle array index
  if (typeof lastKey === 'number') {
    if (!Array.isArray(current)) {
      // Type mismatch: trying to use array index on non-array
      // This shouldn't happen with valid paths, but handle gracefully
      return result;
    }

    // Extend array if needed (immutably)
    // Note: current is already a cloned array from the loop above
    if (current.length <= lastKey) {
      // Create extended array and fill missing indices with undefined
      const extendedArray = [...current];

      while (extendedArray.length <= lastKey) {
        extendedArray.push(undefined);
      }

      extendedArray[lastKey] = value;

      // Update parent reference to point to extended array
      // Need to navigate back to parent and update the reference
      const parentKey = keys[keys.length - 2];

      if (keys.length === 1) {
        // Root is array - return extended array directly
        return extendedArray;
      }

      // Navigate to parent in the cloned result structure
      let parent = result;

      for (let i = 0; i < keys.length - 2; i++) {
        parent = parent[keys[i]];
      }

      parent[parentKey] = extendedArray;
    } else {
      // Array already has enough length, just set value
      // current is already a cloned array, safe to mutate
      current[lastKey] = value;
    }

    return result;
  }

  // Object key - simple assignment
  // current is already a cloned object, safe to mutate
  current[lastKey] = value;

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

  const keys = parsePath(path);
  const { found } = navigateToPath(obj, keys);

  return found;
};

/**
 * Delete value by path from object
 * @param {Object} obj - Object to delete value from
 * @param {string} path - Dot notation path
 * @returns {Object} Modified object
 */
export const deleteByPath = (obj, path) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (isNullish(current[key])) {
      return result; // Path doesn't exist
    }

    // Clone structure for immutability
    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  // Delete the final value
  const lastKey = keys[keys.length - 1];

  if (typeof lastKey === 'number') {
    // Array index - use splice to remove element and shift indices
    // Note: this removes the element, not just sets it to undefined
    if (Array.isArray(current) && lastKey >= 0 && lastKey < current.length) {
      current.splice(lastKey, 1);
    }
  } else {
    // Object key - use delete operator
    // Note: this removes the property, not sets it to undefined
    delete current[lastKey];
  }

  return result;
};
