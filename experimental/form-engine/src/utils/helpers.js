/**
 * Helper utilities for common operations
 * Follows DRY principle
 */

import {
  isDefined,
  isFunction,
} from './checks';

/**
 * Safely call a method on an object if it exists and is a function
 * @param {Object} obj - Object to call method on
 * @param {string} method - Method name
 * @param {...any} args - Arguments to pass to method
 * @returns {*} Method return value or undefined
 */
export const safeCall = (obj, method, ...args) => {
  if (isDefined(obj) && isFunction(obj[method])) {
    return obj[method](...args);
  }

  return undefined;
};

/**
 * Safely get a property from an object
 * @param {Object} obj - Object to get property from
 * @param {string} property - Property name
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} Property value or default value
 */
export const safeGet = (obj, property, defaultValue = undefined) => {
  if (isDefined(obj) && property in obj) {
    return obj[property];
  }

  return defaultValue;
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
