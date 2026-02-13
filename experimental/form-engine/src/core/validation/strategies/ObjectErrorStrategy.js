/**
 * ObjectErrorStrategy - Handles plain object errors from form validators
 *
 * Converts form validator errors (object shape) into field-level errors:
 * - Simple field errors: { "fieldName": "error text" } → engine.setError("fieldName", "error text")
 * - Array field errors: { "items": [{ "name": "error" }] } → engine.setError("items[0].name", "error")
 *
 * This ensures all error values remain strings (never arrays), so UI receives
 * predictable data in meta.error and can safely render it.
 */

import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

export class ObjectErrorStrategy extends ValidationErrorStrategy {
  canHandle(error) {
    return error && typeof error === 'object' && !Array.isArray(error);
  }

  /**
   * Process plain object errors from form validator
   * @param {Object} error - Errors object where values can be strings or arrays
   * @param {Object} engine - Form engine instance
   * @param {string} formErrorPath - Path for form-level errors (usually '$form')
   *
   * Example inputs:
   *   { "email": "invalid email" }
   *   { "fyFinanceData": [{ "fundStatus": "required" }, { "fundStatus": "required" }] }
   */
  handle(error, engine, formErrorPath) {
    // Clear any previous form-level error
    engine.clearError(formErrorPath);

    // Process each field from error object
    for (const [path, fieldError] of Object.entries(error)) {
      if (Array.isArray(fieldError)) {
        // Array of errors (e.g., array field with errors per item or multiple validation errors)
        // Expand into individual field paths: items[0].field, items[1].field, etc.
        this._setArrayFieldErrors(path, fieldError, engine);
      } else if (fieldError) {
        // Simple field error: set directly as string
        engine.setError(path, fieldError, 'form');
      } else {
        // Null/falsy field error: clear any existing error from form source
        engine.clearError(path, 'form');
      }
    }
  }

  /**
   * Expand array errors into individual field-level errors
   *
   * Converts array items into field paths:
   *   ["error1", "error2"] → "basePath[0]", "basePath[1]"
   *   [{ "field": "err" }, { "field": "err" }] → "basePath[0].field", "basePath[1].field"
   *
   * @param {string} basePath - Base field path (e.g., "items" or "fyFinanceData")
   * @param {Array} fieldError - Array of error objects or strings
   * @param {Object} engine - Form engine instance
   * @private
   */
  _setArrayFieldErrors(basePath, fieldError, engine) {
    for (const [index, itemError] of fieldError.entries()) {
      if (itemError && typeof itemError === 'object') {
        // Item error is an object with nested field errors
        // Set error for each nested field: basePath[index].fieldName
        for (const fieldName of Object.keys(itemError)) {
          const fullPath = `${basePath}[${index}].${fieldName}`;

          engine.setError(fullPath, itemError[fieldName], 'form');
        }
      } else if (itemError) {
        // Item error is a simple string
        // Set directly on array item path: basePath[index]
        const fullPath = `${basePath}[${index}]`;

        engine.setError(fullPath, itemError, 'form');
      }
    }
  }
}
