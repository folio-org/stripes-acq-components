/**
 * NullErrorStrategy - Handles null/undefined errors (no error case)
 */

import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

export class NullErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return !error;
  }

  handle(error, engine, formErrorPath) {
    engine.clearError(formErrorPath);
  }
}
