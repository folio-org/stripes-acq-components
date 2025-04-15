/**
 * Complete CQL Query Builder supporting CQL 1.2 features
 * with FOLIO-specific extensions including array search modifiers
 * and multi-field sorting.
 */
export class CQLBuilder {
  static OPERATORS = {
    EQUAL: '==',
    NOT_EQUAL: '<>',
    FUZZY: '=',
    ALL: 'all',
    ANY: 'any',
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
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

  static AT_MODIFIER_PREFIX = '/@';

  constructor() {
    // Stores all parts of the query in sequence (terms, operators, modifiers)
    this.queryParts = [];
    // Holds modifiers that will be applied to the next condition
    this.currentModifiers = {};
    this.requiresImplicitAnd = false;
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
   * @returns {CQLBuilder} Returns self for method chaining
   * @throws {Error} If no index was set before calling relation()
   */
  relation(operator) {
    if (!this.scopedIndex) {
      throw new Error('Index must be set before relation');
    }

    this.queryParts.push(`${this.scopedIndex} ${operator}`);
    this.scopedIndex = null;

    return this;
  }

  /**
   * Sets the comparison value for scoped operations
   * @param {string|number} value - The value to compare against
   * @returns {CQLBuilder} Returns self for method chaining
   * @throws {Error} If value doesn't follow a relation
   */
  value(value) {
    const lastPart = this.queryParts[this.queryParts.length - 1];

    if (typeof lastPart !== 'string' || !lastPart.includes(' ')) {
      throw new Error('Value must follow a relation');
    }

    const quotedValue = typeof value === 'string' ? `"${value}"` : value;

    this.queryParts[this.queryParts.length - 1] = `${lastPart} ${quotedValue}`;
    this._applyModifiers();
    this.requiresImplicitAnd = true;

    return this;
  }

  // ===== SHORTHAND METHODS =====

  /**
   * Adds an exact match condition (== operator)
   * @param {string} field - The field name to match
   * @param {string|number} value - The exact value to match
   * @returns {CQLBuilder} Returns self for method chaining
   */
  equal(field, value) {
    return this._addCondition(field, CQLBuilder.OPERATORS.EQUAL, value);
  }

  /**
   * Adds a fuzzy match condition (= operator with wildcards)
   * @param {string} field - The field name to search
   * @param {string} value - The search pattern (can include *)
   * @returns {CQLBuilder} Returns self for method chaining
   */
  fuzzy(field, value) {
    return this._addCondition(field, CQLBuilder.OPERATORS.FUZZY, value);
  }

  notEqual(field, value) {
    return this._addCondition(field, CQLBuilder.OPERATORS.NOT_EQUAL, value);
  }

  /**
   * Adds a contains-all-words condition (all operator)
   * @param {string} field - The field name to search
   * @param {string} value - Space-separated words to find
   * @returns {CQLBuilder} Returns self for method chaining
   */
  contains(field, value) {
    return this._addCondition(field, CQLBuilder.OPERATORS.ALL, value);
  }

  /**
   * Contains any term (any operator)
   */
  containsAny(field, value) {
    return this._addCondition(field, CQLBuilder.OPERATORS.ANY, value);
  }

  allRecords() {
    return this.fuzzy(CQLBuilder.SPECIAL_TERMS.ALL_RECORDS, 1);
  }

  // ===== BOOLEAN OPERATORS =====
  and() {
    if (this.queryParts.length === 0 || this._lastPartIsOperator()) {
      return this;
    }

    this.queryParts.push(CQLBuilder.OPERATORS.AND);
    this.requiresImplicitAnd = false;

    return this;
  }

  or() {
    if (this.queryParts.length === 0 || this._lastPartIsOperator()) {
      return this;
    }

    this.queryParts.push(CQLBuilder.OPERATORS.OR);
    this.requiresImplicitAnd = false;

    return this;
  }

  not() {
    this.queryParts.push(CQLBuilder.OPERATORS.NOT);

    return this;
  }

  // ===== PROXIMITY SEARCH =====

  /**
   * Proximity search
   * @param {number} distance - Maximum distance between terms
   * @param {string} [unit=word] - Proximity unit (word, sentence, paragraph)
   * @returns {CQLBuilder}
   */
  prox(distance, unit = 'word') {
    this.queryParts.push(`prox/${unit}/${distance}`);

    return this;
  }

  // ===== ARRAY SEARCH MODIFIERS =====

  /**
   * AND-style array search with value modifiers
   * @param {string} field - Array field name
   * @param {Object} modifiers - Key-value modifier pairs
   * @param {string|number} searchValue - Value to search for
   * @returns {CQLBuilder}
   */
  andModifiersSearch(field, modifiers, searchValue) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    const modifiersChain = Object.entries(modifiers)
      .map(([key, value]) => `${CQLBuilder.AT_MODIFIER_PREFIX}${key}=${value}`)
      .join('');

    const quotedValue = typeof searchValue === 'string' ? `"${searchValue}"` : searchValue;

    this.queryParts.push(`${field} =${modifiersChain} ${quotedValue}`);
    this._applyModifiers();
    this.requiresImplicitAnd = true;

    return this;
  }

  /**
   * OR-style array search across multiple fields
   * @param {string} field - Array field name
   * @param {string|string[]} modifiers - Modifier(s) to search
   * @param {string|number} searchValue - Value to search for
   * @returns {CQLBuilder}
   */
  orModifiersSearch(field, modifiers, searchValue) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    const modifiersArray = Array.isArray(modifiers) ? modifiers : [modifiers];
    const modifiersChain = modifiersArray.map(m => `${CQLBuilder.AT_MODIFIER_PREFIX}${m}`).join('');
    const quotedValue = typeof searchValue === 'string' ? `"${searchValue}"` : searchValue;

    this.queryParts.push(`${field} =${modifiersChain} ${quotedValue}`);
    this._applyModifiers();
    this.requiresImplicitAnd = true;

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
      const normalizedOrder = order.startsWith('sort.')
        ? order
        : (() => (
          order === CQLBuilder.SORT_ORDERS.ASC
            ? CQLBuilder.SORT_ORDERS.SORT_ASCENDING
            : CQLBuilder.SORT_ORDERS.SORT_DESCENDING
        ))();

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

  // ===== MODIFIERS =====

  /**
   * Adds a modifier to the next condition
   * @param {string} name - Modifier name
   * @param {string|number|boolean} value - Modifier value
   * @returns {CQLBuilder}
   */
  modifier(name, value) {
    this.currentModifiers[name] = value;

    return this;
  }

  // ===== GROUPING =====

  group(callback) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    this.queryParts.push(CQLBuilder.GROUP_TOKENS.OPEN);

    const groupBuilder = new CQLBuilder();

    callback(groupBuilder);
    this.queryParts.push(groupBuilder.build());
    this.queryParts.push(CQLBuilder.GROUP_TOKENS.CLOSE);
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
      .replace(/\s*(=+)\s+/g, '$1')
      .replace(/\(\s+/g, CQLBuilder.GROUP_TOKENS.OPEN)
      .replace(/\s*\)/g, CQLBuilder.GROUP_TOKENS.CLOSE)
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
   * @returns {CQLBuilder} Returns self for method chaining
   */
  _addCondition(field, operator, value) {
    if (this._shouldAddImplicitAnd()) {
      this.queryParts.push(CQLBuilder.OPERATORS.AND);
    }

    const quotedValue = typeof value === 'string' ? `"${value}"` : value;

    this.queryParts.push(`${field} ${operator} ${quotedValue}`);
    this._applyModifiers();
    this.requiresImplicitAnd = true;

    return this;
  }

  /**
   * Applies current modifiers to the last condition
   * @private
   */
  _applyModifiers() {
    if (Object.keys(this.currentModifiers).length > 0) {
      const lastIndex = this.queryParts.length - 1;
      const modifiers = Object.entries(this.currentModifiers)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');

      this.queryParts[lastIndex] += ` ${modifiers}`;
      this.currentModifiers = {};
    }
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

  _lastPartIsOperator() {
    if (this.queryParts.length === 0) return false;
    const last = this.queryParts[this.queryParts.length - 1];

    return [
      CQLBuilder.OPERATORS.AND,
      CQLBuilder.OPERATORS.OR,
      CQLBuilder.OPERATORS.NOT,
      CQLBuilder.GROUP_TOKENS.OPEN,
    ].includes(last);
  }

  /**
   * Resets builder state
   * @private
   */
  _reset() {
    this.queryParts = [];
    this.currentModifiers = {};
    this.requiresImplicitAnd = false;
    this.scopedIndex = null;
  }
}
