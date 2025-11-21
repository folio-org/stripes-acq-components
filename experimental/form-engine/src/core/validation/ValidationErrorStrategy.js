/**
 * ValidationErrorStrategy - Base class for validation error handling strategies
 * Follows Strategy Pattern and Open/Closed Principle (SOLID)
 */

/**
 * Base strategy class for validation error handling
 */
export class ValidationErrorStrategy {
  /**
   * Check if this strategy can handle the given error
   * @param {*} _error - Error to check
   * @returns {boolean} True if strategy can handle this error
   */
  canHandle(_error) {
    throw new Error('canHandle() must be implemented by subclass');
  }

  /**
   * Handle the validation error
   * @param {*} _error - Error to handle
   * @param {Object} _engine - Form engine instance
   * @param {string} _formErrorPath - Path for form-level errors
   */
  handle(_error, _engine, _formErrorPath) {
    throw new Error('handle() must be implemented by subclass');
  }
}
