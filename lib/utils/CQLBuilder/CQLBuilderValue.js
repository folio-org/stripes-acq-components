import { identity } from 'lodash';

import { escapeCqlValue } from '@folio/stripes/util';

/**
 * An abstract class representing a value in CQL Builder.
 * Any value that needs to be formatted in a specific way for CQL queries should extend this class and implement the toCQL method.
 * This allows for consistent handling of complex values across the CQL Builder.
*/
export class CQLBuilderValue {
  constructor(input, options = {}) {
    this.input = input;
    this.escapeCQL = options.escapeCQL ?? true;
  }

  toCQL() {
    throw new Error('toCQL method must be implemented by subclasses of CQLBuilderValue');
  }

  toString() {
    return this.toCQL();
  }

  /**
   * Escape special characters for CQL
   * @private
   * @param {string} value - The value to escape
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean|function} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value or a custom escape function
   * @returns {string} Either an escaped string or initial value when `escapeCQL` option is `false`
   */
  _getEscapedValue(value, options = {}) {
    const { escapeCQL = true } = options;

    // If a custom escape function is provided, use it
    if (typeof escapeCQL === 'function') {
      return escapeCQL(value);
    }

    // If escapeCQL is true, use the default escape function; otherwise, return the value as-is
    const escapeFn = escapeCQL ? escapeCqlValue : identity;

    return escapeFn(value);
  }
}
