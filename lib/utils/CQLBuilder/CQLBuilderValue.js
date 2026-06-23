/**
 * An abstract class representing a value in CQL Builder.
 * Any value that needs to be formatted in a specific way for CQL queries should extend this class and implement the toCQL method.
 * This allows for consistent handling of complex values across the CQL Builder.
*/
export class CQLBuilderValue {
  toCQL() {
    throw new Error('toCQL method must be implemented by subclasses of CQLBuilderValue');
  }

  toString() {
    return this.toCQL();
  }
}
