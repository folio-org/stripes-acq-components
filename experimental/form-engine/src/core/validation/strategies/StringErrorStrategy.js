/**
 * StringErrorStrategy - Handles string errors (form-level error)
 */

import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

export class StringErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return typeof error === 'string';
  }

  handle(error, engine, formErrorPath) {
    engine.setError(formErrorPath, error);
  }
}
