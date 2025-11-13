/**
 * Validation Error Handler - Handles different types of validation errors
 * Follows Single Responsibility Principle (SOLID)
 * Now uses Strategy Pattern for extensibility
 */

import { ValidationErrorHandler } from '../core/validation/ValidationErrorHandler';
import { SchedulerService } from '../core/services/SchedulerService';

// Create singleton instances
const errorHandler = new ValidationErrorHandler();
const scheduler = new SchedulerService();

/**
 * Handle validation error and set appropriate error states
 * @param {*} error - Validation error (string, object, or array)
 * @param {Object} engine - Form engine instance
 * @param {string} formErrorPath - Path for form-level errors (default: '$form')
 */
export const handleValidationError = (error, engine, formErrorPath = '$form') => {
  errorHandler.handle(error, engine, formErrorPath);
};

/**
 * Schedule validation based on mode
 * Uses SchedulerService for cleaner async handling (DRY principle)
 * @param {Function} validateFn - Validation function to execute
 * @param {string} mode - Validation mode ('change', 'blur', 'submit')
 */
export const scheduleValidation = (validateFn, mode) => {
  const strategies = {
    change: () => scheduler.scheduleAnimationFrame(validateFn),
    blur: () => scheduler.scheduleMicrotask(validateFn),
    submit: () => scheduler.scheduleImmediate(validateFn),
  };

  const strategy = strategies[mode] || strategies.submit;

  strategy();
};
