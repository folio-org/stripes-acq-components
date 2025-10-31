/**
 * Common object checking utilities
 * Centralized functions for consistent object/type checking across the codebase
 */

/**
 * Check if value is a function
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isFunction = (value) => typeof value === 'function';

/**
 * Check if value is null or undefined (nullish)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isNullish = (value) => value == null;

/**
 * Check if value is defined (not null and not undefined)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isDefined = (value) => value != null;

/**
 * Check if value is strictly null
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isNull = (value) => value === null;

/**
 * Check if value is strictly undefined
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isUndefined = (value) => value === undefined;

/**
 * Check if value is an object (but not null)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isObject = (value) => typeof value === 'object' && value !== null;

/**
 * Check if value is an array
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isArray = (value) => Array.isArray(value);

/**
 * Get property safely from object
 * @param {Object} obj - Object to get property from
 * @param {string} prop - Property name
 * @returns {*} Property value or undefined
 */
export const getProperty = (obj, prop) => (isDefined(obj) && prop in obj ? obj[prop] : undefined);

/**
 * Check if object has property
 * @param {Object} obj - Object to check
 * @param {string} prop - Property name
 * @returns {boolean}
 */
export const hasProperty = (obj, prop) => isDefined(obj) && prop in obj;

/**
 * Check if value is truthy
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isTruthy = (value) => Boolean(value);

/**
 * Check if value is falsy
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isFalsy = (value) => !value;

/**
 * Shallow equality check for objects and arrays
 * Compares primitives strictly, objects and arrays by shallow comparison
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean}
 */
export const shallowEqual = (a, b) => {
  // Same reference or primitive equality
  if (a === b) return true;

  // Both nullish
  if (isNullish(a) && isNullish(b)) return true;

  // One is nullish, other is not
  if (isNullish(a) || isNullish(b)) return false;

  // Both arrays - compare length and elements
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }

  // Both objects (but not arrays) - compare keys and values
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!(key in b) || a[key] !== b[key]) return false;
    }

    return true;
  }

  // Different types
  return false;
};
