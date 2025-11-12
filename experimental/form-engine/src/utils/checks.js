/**
 * Common object checking utilities
 */

import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isEqualLodash from 'lodash/isEqual';

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
 * Equality check for objects and arrays
 * Uses lodash.isEqual for deep comparison
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean}
 */
export const isEqual = isEqualLodash;
