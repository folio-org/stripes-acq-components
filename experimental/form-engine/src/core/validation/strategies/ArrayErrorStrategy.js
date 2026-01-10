/**
 * ArrayErrorStrategy - Handles array errors (invalid structure)
 */

import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

export class ArrayErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return Array.isArray(error);
  }

  handle(error, engine, formErrorPath) {
    // Clear the form error first
    engine.clearError(formErrorPath);

    // Log warning about array structure
    for (const itemError of error) {
      if (itemError && typeof itemError === 'object') {
        // eslint-disable-next-line no-console
        console.warn(
          'Form validator returned array structure. ' +
          'Please return object with full field paths instead. ' +
          'Example: { "fyFinanceData.3.budgetAllocationChange": "error" }',
        );
      }
    }
  }
}
