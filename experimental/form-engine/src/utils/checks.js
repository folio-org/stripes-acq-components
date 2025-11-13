/**
 * Common object checking utilities
 */

import isNil from 'lodash/isNil';

/**
 * Check if value is null or undefined (nullish)
 * Alias for lodash.isNil
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export { default as isFunction } from 'lodash/isFunction';
export { default as isNil } from 'lodash/isNil';
export { isNil as isNullish };
export { default as isObject } from 'lodash/isObject';
export { default as isEqual } from 'lodash/isEqual';

/**
 * Check if value is defined (not null and not undefined)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isDefined = (value) => !isNil(value);
