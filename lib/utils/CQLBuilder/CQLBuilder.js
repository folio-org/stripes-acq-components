import identity from 'lodash/identity';

import { escapeCqlValue } from '@folio/stripes/util';

/**
 * Complete CQL Query Builder supporting CQL 1.2 features
 * with FOLIO-specific extensions including array search modifiers
 * and multi-field sorting.
 */
export class CQLBuilder {
  static OPERATORS = {
    ALL: 'all',
    AND: 'AND',
    ANY: 'any',
    EQUAL: '==',
    FUZZY: '=',
    GREATER_THAN: '>',
    GREATER_THAN_EQUAL: '>=',
    LESS_THAN: '<',
    LESS_THAN_EQUAL: '<=',
    NOT: 'NOT',
    NOT_EQUAL: '<>',
    OR: 'OR',
    PROX: 'prox',
  };

  static SORT_ORDERS = {
    ASC: 'asc',
    DESC: 'desc',
    SORT_ASCENDING: 'sort.ascending',
    SORT_DESCENDING: 'sort.descending',
  };

  static SPECIAL_TERMS = {
    ALL_RECORDS: 'cql.allRecords',
    SORT_BY: 'sortBy',
  };

  static GROUP_TOKENS = {
    OPEN: '(',
    CLOSE: ')',
  };

  constructor() {
    this.queryParts = [];
    this.requiresImplicitAnd = false;
    this.currentRelationModifiers = [];
    this.currentBooleanModifiers = [];
  }

  // ===== BASIC CLAUSES =====

  /**
   * Sets the field name for scoped operations (index -> relation -> value pattern)
   * @param {string} index - The search field name
   * @returns {CQLBuilder} Returns self for method chaining
   */
  index(index) {
    this.scopedIndex = index;

    return this;
  }

  /**
   * Sets the comparison operator for scoped operations
   * @param {string} operator - The operator (=, ==, >, <, all, any, etc.)
   * @param {Array<{name: string, value?: any}>} [modifiers] - Optional inline relation modifiers.
   *   Merged with any modifiers queued via {@link relationModifier} (inline modifiers applied first).
   * @returns {CQLBuilder} Returns self for method chaining
   * @throws {Error} If no index was set before calling relation()
   */
  relation(operator, modifiers) {
    if (!this.scopedIndex) {
      throw new Error('Index must be set before relation');
    }

    if (modifiers) {
      this.currentRelationModifiers.unshift(
        ...modifiers.map(m => (m.value === undefined ? m.name : `${m.name}=${m.value}`)),
      );
    }

    const relationModifiersChain = this._buildRelationModifiers();

    this.queryParts.push(`${this.scopedIndex} ${operator}${relationModifiersChain}`);
    this.scopedIndex = null;

    return this;
  }

  /**
   * Sets the comparison value for scoped operations
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @returns {CQLBuilder} Returns self for method chaining
   * @throws {Error} If value doesn't follow a relation
   */
  value(value, options) {
    const lastPart = this.queryParts.at(-1);

    if (typeof lastPart !== 'string' || !lastPart.includes(' ')) {
      throw new Error('Value must follow a relation');
    }

    const formattedValue = this._formatValue(value, options);

    this.queryParts[this.queryParts.length - 1] = `${lastPart} ${formattedValue}`;
    this.requiresImplicitAnd = true;

    return this;
  }

  // ===== SHORTHAND METHODS =====

  /**
   * Adds an exact match condition (== operator)
   * @param {string} field - The field name to match
   * @param {string|number} value - The exact value to match
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  equal(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.EQUAL, value, options);
  }

  /**
   * Adds a fuzzy match condition (= operator with wildcards)
   * @param {string} field - The field name to search
   * @param {string} value - The search pattern (can include *)
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  fuzzy(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.FUZZY, value, options);
  }

  /**
   * Adds a not-equal condition (<> operator)
   * @param {string} field - The field name to check
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  notEqual(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.NOT_EQUAL, value, options);
  }

  /**
   * Adds a greater-than condition (> operator)
   * @param {string} field - The field name to check
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  greaterThan(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.GREATER_THAN, value, options);
  }

  /**
   * Adds a greater-than-or-equal condition (>= operator)
   * @param {string} field - The field name to check
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  greaterThanEqual(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.GREATER_THAN_EQUAL, value, options);
  }

  /**
   * Shorthand for {@link greaterThanEqual}
   */
  gte(field, value, options) {
    return this.greaterThanEqual(field, value, options);
  }

  /**
   * Adds a less-than condition (< operator)
   * @param {string} field - The field name to check
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  lessThan(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.LESS_THAN, value, options);
  }

  /**
   * Adds a less-than-or-equal condition (<= operator)
   * @param {string} field - The field name to check
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  lessThanEqual(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.LESS_THAN_EQUAL, value, options);
  }

  /**
   * Shorthand for {@link lessThanEqual}
   */
  lte(field, value, options) {
    return this.lessThanEqual(field, value, options);
  }

  /**
   * Adds a contains-all-words condition (all operator)
   * @param {string} field - The field name to search
   * @param {string} value - Space-separated words to find
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  contains(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.ALL, value, options);
  }

  /**
   * Adds a contains-any-term condition (any operator)
   * @param {string} field - The field name to search
   * @param {string} value - Space-separated terms, at least one of which must be present
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  containsAny(field, value, options) {
    return this._addCondition(field, CQLBuilder.OPERATORS.ANY, value, options);
  }

  /**
   * Adds a match-all clause (cql.allRecords=1)
   * @returns {CQLBuilder} Returns self for method chaining
   */
  allRecords(options) {
    return this.fuzzy(CQLBuilder.SPECIAL_TERMS.ALL_RECORDS, 1, options);
  }

  // ===== BOOLEAN OPERATORS =====

  /**
   * Inserts an AND operator between the current and next clause.
   * Consumes any modifiers queued via {@link booleanModifier} / {@link booleanModifiers}.
   * No-op when there is no left-hand clause or when a boolean operator is already pending.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  and() {
    if (this.queryParts.length === 0 || this._lastPartIsOperator()) {
      return this;
    }

    const modChain = this._serializeBooleanModifiers(this._consumePendingBooleanModifiers());

    this.queryParts.push(`${CQLBuilder.OPERATORS.AND}${modChain}`);
    this.requiresImplicitAnd = false;

    return this;
  }

  /**
   * Inserts an OR operator between the current and next clause.
   * Consumes any modifiers queued via {@link booleanModifier} / {@link booleanModifiers}.
   * No-op when there is no left-hand clause or when a boolean operator is already pending.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  or() {
    if (this.queryParts.length === 0 || this._lastPartIsOperator()) {
      return this;
    }

    const modChain = this._serializeBooleanModifiers(this._consumePendingBooleanModifiers());

    this.queryParts.push(`${CQLBuilder.OPERATORS.OR}${modChain}`);
    this.requiresImplicitAnd = false;

    return this;
  }

  /**
   * Inserts a NOT operator before the next clause.
   * Consumes any modifiers queued via {@link booleanModifier} / {@link booleanModifiers}.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  not() {
    const modChain = this._serializeBooleanModifiers(this._consumePendingBooleanModifiers());

    this.queryParts.push(`${CQLBuilder.OPERATORS.NOT}${modChain}`);

    return this;
  }

  // ===== PROXIMITY SEARCH =====

  /**
   * Proximity operator between two terms.
   * @param {Array<{name: string, value?: any, symbol?: string}>} [modifiers] - Optional boolean modifiers.
   *   Each entry serializes as /name, /name=value, or /name<symbol>value.
   * @returns {CQLBuilder}
   */
  prox(modifiers) {
    if (this.queryParts.length === 0 || this._lastPartIsOperator()) {
      return this;
    }

    const queued = this._consumePendingBooleanModifiers();
    const modChain = this._serializeBooleanModifiers([...(modifiers ?? []), ...queued]);

    this.queryParts.push(`${CQLBuilder.OPERATORS.PROX}${modChain}`);
    this.requiresImplicitAnd = false;

    return this;
  }

  // ===== SORTING =====

  /**
   * Multi-field sorting
   * @param {Array<{field: string, order: string}>} sorts - Sort specifications
   * @returns {CQLBuilder}
   */
  sortByMultiple(sorts) {
    const sortClauses = sorts.map(({ field, order }) => {
      const defaultOrder = order === CQLBuilder.SORT_ORDERS.ASC
        ? CQLBuilder.SORT_ORDERS.SORT_ASCENDING
        : CQLBuilder.SORT_ORDERS.SORT_DESCENDING;
      const normalizedOrder = order.startsWith('sort.') ? order : defaultOrder;

      return `${field}/${normalizedOrder}`;
    });

    this.queryParts.push(`${CQLBuilder.SPECIAL_TERMS.SORT_BY} ${sortClauses.join(' ')}`);

    return this;
  }

  /**
   * Single-field sorting (backward compatible)
   * @param {string} field - Field to sort by
   * @param {string} [order='asc'] - Sort direction
   * @returns {CQLBuilder}
   */
  sortBy(field, order = CQLBuilder.SORT_ORDERS.ASC) {
    return this.sortByMultiple([{ field, order }]);
  }

  // ===== RELATION MODIFIERS =====
  /**
   * Adds one or more relation modifiers to the next condition.
   *
   * Relation modifiers are appended directly to the relation operator,
   * following standard CQL syntax:
   *
   * field =/@modifier "value"
   * field =/@modifier=value "value"
   *
   * Modifiers are applied only to the next condition and are cleared
   * automatically after use.
   *
   * @param {string} name - Modifier name (for example: '@locationId')
   * @param {string|number|boolean} [value] - Optional modifier value
   * @returns {CQLBuilder} Returns self for method chaining
   */
  relationModifier(name, value) {
    this.currentRelationModifiers.push(value === undefined ? name : `${name}=${value}`);

    return this;
  }

  /**
   * Queues multiple relation modifiers at once. Shorthand for chaining {@link relationModifier}.
   * @param {Array<{name: string, value?: any}>} mods - Modifiers to queue.
   *   Each entry produces `/@name` (no value) or `/@name=value`.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  relationModifiers(mods) {
    mods.forEach(({ name, value }) => this.relationModifier(name, value));

    return this;
  }

  /**
   * Queues a single boolean modifier for the next boolean operator (and/or/not/prox).
   * Modifiers are consumed and cleared when the operator method is called.
   * @param {string} name - Modifier name (e.g. 'unit', 'distance', 'unordered')
   * @param {*} [value] - Optional modifier value. Omit for flag-style modifiers (e.g. 'unordered').
   * @param {string} [symbol='='] - Comparison symbol between name and value (e.g. '<=' for distance<=1).
   * @returns {CQLBuilder} Returns self for method chaining
   */
  booleanModifier(name, value, symbol) {
    this.currentBooleanModifiers.push(
      value === undefined ? { name } : { name, value, ...(symbol ? { symbol } : {}) },
    );

    return this;
  }

  /**
   * Queues multiple boolean modifiers at once. Shorthand for chaining {@link booleanModifier}.
   * @param {Array<{name: string, value?: any, symbol?: string}>} mods - Modifiers to queue.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  booleanModifiers(mods) {
    this.currentBooleanModifiers.push(...mods);

    return this;
  }

  // ===== GROUPING =====

  /**
   * Wraps a sub-query in parentheses.
   * @param {function(CQLBuilder): void} callback - Receives a fresh builder; its result becomes the grouped sub-query.
   * @returns {CQLBuilder} Returns self for method chaining
   */
  group(callback) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    this.queryParts.push(CQLBuilder.GROUP_TOKENS.OPEN);

    const groupBuilder = new CQLBuilder();

    callback(groupBuilder);
    this.queryParts.push(groupBuilder.build(), CQLBuilder.GROUP_TOKENS.CLOSE);
    this.requiresImplicitAnd = true;

    return this;
  }

  // ===== QUERY BUILDING =====

  /**
   * Builds the final CQL query
   * @returns {string} - Complete CQL query string
   */
  build() {
    const query = this.queryParts.join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s(=+)\s/g, '$1')
      .replace(/\(\s/g, CQLBuilder.GROUP_TOKENS.OPEN)
      .replace(/\s\)/g, CQLBuilder.GROUP_TOKENS.CLOSE)
      .trim();

    this._reset();

    return query;
  }

  // ===== PRIVATE METHODS =====

  /**
   * Adds a complete condition to the query
   * @private
   * @param {string} field - The field name to query against
   * @param {string} operator - The comparison operator (=, ==, >, etc.)
   * @param {string|number} value - The value to compare against
   * @param {Object} [options] - Optional parameters
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters in the value
   * @param {function} [options.formatter] - Custom value formatter
   * @param {Array<{name: string, value?: any}>} [options.modifiers] - Inline relation modifiers
   * @returns {CQLBuilder} Returns self for method chaining
   */
  _addCondition(field, operator, value, options = {}) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    const { modifiers: inlineModifiers, ...valueOptions } = options;

    if (inlineModifiers) {
      this.currentRelationModifiers.unshift(
        ...inlineModifiers.map(m => (m.value === undefined ? m.name : `${m.name}=${m.value}`)),
      );
    }

    const formattedValue = this._formatValue(value, valueOptions);
    const relationModifiersChain = this._buildRelationModifiers();

    this.queryParts.push(`${field} ${operator}${relationModifiersChain} ${formattedValue}`);
    this.requiresImplicitAnd = true;

    return this;
  }

  /**
   * Builds and clears the currently queued relation modifiers.
   *
   * Converts queued modifiers into CQL relation modifier syntax:
   *
   * ['@locationId'] -> '/@locationId'
   *
   * ['@type=Rush', '@status=Open'] -> '/@type=Rush/@status=Open'
   *
   * @private
   * @returns {string} Formatted relation modifier string or empty string
   */
  _buildRelationModifiers() {
    if (this.currentRelationModifiers.length === 0) {
      return '';
    }

    const result = this.currentRelationModifiers
      .map(modifier => `/${modifier}`)
      .join('');

    this.currentRelationModifiers = [];

    return result;
  }

  /**
   * Determines if an implicit AND should be added
   * @private
   * @returns {boolean} True if AND should be automatically inserted
   */
  _shouldAddImplicitAnd() {
    return this.requiresImplicitAnd &&
      this.queryParts.length > 0 &&
      !this._lastPartIsOperator();
  }

  /**
   * Returns true when the last queued part is a boolean operator token.
   * Used to guard against duplicate operator calls and incorrect implicit-AND insertion.
   * @private
   * @returns {boolean}
   */
  _lastPartIsOperator() {
    if (this.queryParts.length === 0) return false;
    const last = this.queryParts.at(-1);

    return last === CQLBuilder.GROUP_TOKENS.OPEN
      || last.startsWith(CQLBuilder.OPERATORS.AND)
      || last.startsWith(CQLBuilder.OPERATORS.OR)
      || last.startsWith(CQLBuilder.OPERATORS.NOT)
      || last.startsWith(CQLBuilder.OPERATORS.PROX);
  }

  /**
   * Resets builder state
   * @private
   */
  _reset() {
    this.queryParts = [];
    this.requiresImplicitAnd = false;
    this.scopedIndex = null;
    this.currentBooleanModifiers = [];
  }

  /**
   * Returns queued boolean modifiers and clears the queue.
   * @private
   * @returns {Array<{name: string, value?: any, symbol?: string}>}
   */
  _consumePendingBooleanModifiers() {
    const mods = this.currentBooleanModifiers;

    this.currentBooleanModifiers = [];

    return mods;
  }

  /**
   * Serializes an array of boolean modifier objects into a CQL modifier chain string.
   * @private
   * @param {Array<{name: string, value?: any, symbol?: string}>} mods
   * @returns {string} E.g. '/unit=word/distance<=1/unordered' or '' for an empty array
   */
  _serializeBooleanModifiers(mods) {
    if (!mods.length) return '';

    return mods.map(m => (
      m.value === undefined ? `/${m.name}` : `/${m.name}${m.symbol ?? '='}${m.value}`
    )).join('');
  }

  /**
   * Formats a value for CQL output, applying any necessary escaping or custom formatting
   * see {@link CQLBuilderValue} for details on value formatting and escaping
   *
   * @private
   * @param {string|number} value - The value to format
   * @param {Object} [options] - Optional parameters for value formatting
   * @param {function} [options.formatter] - Custom formatter function to apply to the value
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value (default: true)
   * @returns {string|number} The formatted value, ready for inclusion in the CQL query
   */
  _formatValue(value, options = {}) {
    if (typeof options.formatter === 'function') {
      return options.formatter(value);
    }

    return typeof value === 'string' ? `"${this._getEscapedValue(value, options)}"` : value;
  }

  /**
   * Escape special characters for CQL
   * @private
   * @param {string} value - The value to escape
   * @param {Object} [options] - Optional parameters for the condition
   * @param {boolean} [options.escapeCQL] - Whether to escape special CQL characters (`"` or `\`") in the value
   * @returns {string} Either an escaped string or initial value when `escapeCQL` option is `false`
   */
  _getEscapedValue(value, options = {}) {
    const { escapeCQL = true } = options;

    const escapeFn = escapeCQL ? escapeCqlValue : identity;

    return escapeFn(value);
  }
}
