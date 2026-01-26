/**
 * HoldingsAbandonmentBaseStrategy
 *
 * Abstract base class for abandonment strategies.
 * Each strategy must:
 * - define static `name`
 * - implement static `buildClosure({ ids, index })`
 *
 * Closure must return:
 * {
 *   poLines: Set<string>,
 *   pieces: Set<string>,
 *   items: Set<string>
 * }
 */
export class HoldingsAbandonmentBaseStrategy {
  static name;

  static buildClosure() {
    throw new Error('Strategy must implement buildClosure()');
  }

  /**
   * Helper to validate returned closure shape
   */
  static assertValidClosure(closure) {
    const keys = ['poLines', 'pieces', 'items'];

    keys.forEach(key => {
      if (!(closure[key] instanceof Set)) {
        throw new TypeError(
          `Strategy "${this.name}" returned invalid closure: "${key}" must be Set`,
        );
      }
    });
  }
}
