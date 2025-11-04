/**
 * ValuesFeature - Manages form values and initial values
 */

import { getByPath, setByPath } from '../../utils/path';

export class ValuesFeature {
  constructor(engine) {
    this.engine = engine;
    this.values = Object.create(null);
    this.initialValues = Object.create(null);
  }

  /**
   * Initialize values
   * @param {Object} initialValues - Initial form values
   */
  init(initialValues = Object.create(null)) {
    this.values = Object.assign(Object.create(null), initialValues);
    this.initialValues = Object.assign(Object.create(null), initialValues);
  }

  /**
   * Reset values to initial state
   */
  reset() {
    this.values = Object.assign(Object.create(null), this.initialValues);
  }

  /**
   * Get value by path
   * @param {string} path - Field path
   * @returns {*} Field value
   */
  get(path) {
    return getByPath(this.values, path);
  }

  /**
   * Set value by path
   * @param {string} path - Field path
   * @param {*} value - Field value
   */
  set(path, value) {
    this.values = setByPath(this.values, path, value);
  }

  /**
   * Get all values
   * @returns {Object} All form values
   */
  getAll() {
    return { ...this.values };
  }

  /**
   * Set multiple values
   * @param {Object} values - Values to set
   */
  setAll(values) {
    this.values = Object.assign(Object.create(null), values);
  }

  /**
   * Get initial value by path
   * @param {string} path - Field path
   * @returns {*} Initial field value
   */
  getInitial(path) {
    return getByPath(this.initialValues, path);
  }

  /**
   * Get all initial values
   * @returns {Object} All initial form values
   */
  getAllInitial() {
    return { ...this.initialValues };
  }
}

