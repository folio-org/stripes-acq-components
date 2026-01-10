/**
 * ObjectErrorStrategy - Handles object errors (field-level errors)
 */

import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

export class ObjectErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return error && typeof error === 'object' && !Array.isArray(error);
  }

  handle(error, engine, formErrorPath) {
    // Clear the form error first
    engine.clearError(formErrorPath);

    // Set errors for each field with 'form' source
    for (const [path, fieldError] of Object.entries(error)) {
      if (fieldError) {
        engine.setError(path, fieldError, 'form');
      } else {
        engine.clearError(path, 'form');
      }
    }
  }
}
