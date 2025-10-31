/**
 * Fast object hashing utilities
 * Replaces slow JSON.stringify for better performance
 */

import { isNullish, isObject, isArray } from './checks';

/**
 * Create a fast hash of an object
 * Much faster than JSON.stringify for large objects
 * @param {Object} obj - Object to hash
 * @returns {string} Hash string
 */
export const hashObject = (obj) => {
  if (isNullish(obj)) {
    return 'null';
  }

  if (!isObject(obj)) {
    return String(obj);
  }

  if (isArray(obj)) {
    return `[${obj.map(hashObject).join(',')}]`;
  }

  // For objects, create a deterministic hash
  const keys = Object.keys(obj).sort();
  const hashParts = keys.map(key => `${key}:${hashObject(obj[key])}`);

  return `{${hashParts.join(',')}}`;
};

/**
 * Create a shallow hash of an object (only first level)
 * Even faster for simple objects
 * @param {Object} obj - Object to hash
 * @returns {string} Shallow hash string
 */
export const hashObjectShallow = (obj) => {
  if (isNullish(obj)) {
    return 'null';
  }

  if (!isObject(obj)) {
    return String(obj);
  }

  const keys = Object.keys(obj).sort();
  const hashParts = keys.map(key => `${key}:${obj[key]}`);

  return `{${hashParts.join(',')}}`;
};

/**
 * Create a hash for form state caching
 * Optimized for form state objects
 * @param {Object} formState - Form state object
 * @returns {string} Hash string
 */
export const hashFormState = (formState) => {
  const { values, initialValues, errors, touched, active, submitting, dirty, pristine, valid } = formState;

  return [
    hashObjectShallow(values),
    hashObjectShallow(initialValues || {}),
    hashObjectShallow(errors),
    isArray(touched) ? touched.join(',') : '[]',
    active || 'null',
    submitting ? 'true' : 'false',
    dirty ? 'true' : 'false',
    pristine ? 'true' : 'false',
    valid ? 'true' : 'false',
  ].join('|');
};
