/**
 * Common object checking utilities
 * Re-exports lodash functions for consistency
 */

import { isFunction, isNil, isObject, isEqual } from 'lodash';

/**
 * Check if value is null or undefined (nullish)
 * Alias for lodash.isNil
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export { isFunction, isNil as isNullish, isObject };

/**
 * Check if value is defined (not null and not undefined)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isDefined = (value) => !isNil(value);

/**
 * Shallow equality check for objects and arrays
 * Uses lodash.isEqual for deep comparison
 * Note: This is actually deep equality, not shallow. The name is kept for backward compatibility.
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean}
 */
export const shallowEqual = isEqual;
