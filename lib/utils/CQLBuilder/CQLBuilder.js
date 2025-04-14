/**
 * Complete CQL Query Builder supporting all CQL 1.2 features
 * with FOLIO-specific extensions
 */
export class CQLBuilder {
  constructor() {
    this.queryParts = [];
    this.currentModifiers = {};
    this.scopedIndex = null;
  }

  // ===== BASIC CLAUSES =====

  /**
   * Sets index for scoped operations
   * @param {string} index - Field name for scoped operations
   * @returns {CQLBuilder}
   */
  index(index) {
    this.scopedIndex = index;

    return this;
  }

  /**
   * Adds relation operator for scoped operations
   * @param {string} operator - Relation operator (=, >, <, >=, <=, <>, all, any, etc.)
   * @returns {CQLBuilder}
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
   * Adds value to current relation
   * @param {string|number} value - Value to compare
   * @returns {CQLBuilder}
   */
  value(value) {
    const lastPart = this.queryParts[this.queryParts.length - 1];

    if (typeof lastPart !== 'string' || !lastPart.includes(' ')) {
      throw new Error('Value must follow a relation');
    }

    const quotedValue = typeof value === 'string' ? `"${value}"` : value;

    this.queryParts[this.queryParts.length - 1] = `${lastPart} ${quotedValue}`;

    // Apply modifiers if any
    if (Object.keys(this.currentModifiers).length > 0) {
      const modifiers = Object.entries(this.currentModifiers)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');

      this.queryParts[this.queryParts.length - 1] += ` ${modifiers}`;
      this.currentModifiers = {};
    }

    return this;
  }

  // ===== SHORTHAND METHODS =====

  /**
   * Exact match (== operator)
   */
  exact(field, value) {
    return this.index(field).relation('==').value(value);
  }

  /**
   * Fuzzy match (= operator)
   */
  fuzzy(field, value) {
    return this.index(field).relation('=').value(value);
  }

  /**
   * Contains all terms (all operator)
   */
  contains(field, value) {
    return this.index(field).relation('all').value(value);
  }

  /**
   * Contains any term (any operator)
   */
  containsAny(field, value) {
    return this.index(field).relation('any').value(value);
  }

  // ===== BOOLEAN OPERATORS =====

  and() {
    this.queryParts.push('AND');

    return this;
  }

  or() {
    this.queryParts.push('OR');

    return this;
  }

  not() {
    this.queryParts.push('NOT');

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

  // ===== GROUPING =====

  group(callback) {
    this.queryParts.push('(');
    callback(this);
    this.queryParts.push(')');

    return this;
  }

  // ===== SORTING =====

  sortBy(field, order = 'asc') {
    const normalizedOrder = order.startsWith('sort.') ? order :
      order === 'asc' ? 'sort.ascending' : 'sort.descending';

    this.queryParts.push(`sortBy ${field}/${normalizedOrder}`);

    return this;
  }

  // ===== MODIFIERS =====

  modifier(name, value) {
    this.currentModifiers[name] = value;

    return this;
  }

  // ===== SPECIAL OPERATORS =====

  /**
   * Special operator syntax (e.g. =/@fundId)
   */
  specialOperator(field, opPrefix, opSuffix, value) {
    return this.index(field).relation(`${opPrefix}${opSuffix}`).value(value);
  }

  // ===== QUERY BUILDING =====

  build() {
    const query = this.queryParts.join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Reset state
    this.queryParts = [];
    this.currentModifiers = {};
    this.scopedIndex = null;

    return query;
  }
}
