/**
 * Helper utilities for common operations
 * Follows DRY principle
 */

import invoke from 'lodash/invoke';

/**
 * Safely call a method on an object if it exists and is a function
 * @param {Object} obj - Object to call method on
 * @param {string} method - Method name
 * @param {...any} args - Arguments to pass to method
 * @returns {*} Method return value or undefined
 */
export const safeCall = (obj, method, ...args) => {
  return invoke(obj, method, ...args);
};

/**
 * Create an object with null prototype (no inherited properties)
 * @param {Object} source - Optional source object to copy properties from
 * @returns {Object} New object with null prototype
 */
export const createCleanObject = (source = null) => {
  const obj = Object.create(null);

  if (source) {
    return Object.assign(obj, source);
  }

  return obj;
};
