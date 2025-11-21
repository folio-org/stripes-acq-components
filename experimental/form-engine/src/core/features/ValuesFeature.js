/**
 * ValuesFeature - Manages form values and initial values
 */

import {
  getByPath,
  setByPath,
} from '../../utils/path';
import { BaseFeature } from './BaseFeature';

export class ValuesFeature extends BaseFeature {
  /**
   * Initialize values
   * @param {Object} initialValues - Initial form values
   */
  init(initialValues = Object.create(null)) {
    super.init();
    this._setState('values', Object.assign(Object.create(null), initialValues));
    this._setState('initialValues', Object.assign(Object.create(null), initialValues));
  }

  /**
   * Reset values to initial state
   */
  reset() {
    const initialValues = this._getState('initialValues');

    super.reset();
    this._setState('values', Object.assign(Object.create(null), initialValues));
    this._setState('initialValues', Object.assign(Object.create(null), initialValues));
  }

  /**
   * Get value by path
   * @param {string} path - Field path
   * @returns {*} Field value
   */
  get(path) {
    const values = this._getState('values');

    return getByPath(values, path);
  }

  /**
   * Set value by path
   * @param {string} path - Field path
   * @param {*} value - Field value
   */
  set(path, value) {
    const currentValues = this._getState('values');
    const newValues = setByPath(currentValues, path, value);

    this._setState('values', newValues);
  }

  /**
   * Get all values
   * @returns {Object} All form values
   */
  getAll() {
    const values = this._getState('values');

    return { ...values };
  }

  /**
   * Set multiple values
   * @param {Object} values - Values to set
   */
  setAll(values) {
    this._setState('values', Object.assign(Object.create(null), values));
  }

  /**
   * Get initial value by path
   * @param {string} path - Field path
   * @returns {*} Initial field value
   */
  getInitial(path) {
    const initialValues = this._getState('initialValues');

    return getByPath(initialValues, path);
  }

  /**
   * Get all initial values
   * @returns {Object} All initial form values
   */
  getAllInitial() {
    const initialValues = this._getState('initialValues');

    return { ...initialValues };
  }

  /**
   * Get values reference (for internal use)
   * @returns {Object} Values object
   */
  get values() {
    return this._getState('values');
  }

  /**
   * Get initial values reference (for internal use)
   * @returns {Object} Initial values object
   */
  get initialValues() {
    return this._getState('initialValues');
  }
}
