/**
 * ValidationErrorHandler - Coordinates error handling strategies
 * Follows Strategy Pattern (SOLID)
 */

import { ArrayErrorStrategy } from './strategies/ArrayErrorStrategy';
import { NullErrorStrategy } from './strategies/NullErrorStrategy';
import { ObjectErrorStrategy } from './strategies/ObjectErrorStrategy';
import { StringErrorStrategy } from './strategies/StringErrorStrategy';

/**
 * Error handler that uses strategies to handle different error types
 */
export class ValidationErrorHandler {
  constructor() {
    // Register strategies in priority order
    this.strategies = [
      new NullErrorStrategy(),
      new ObjectErrorStrategy(),
      new ArrayErrorStrategy(),
      new StringErrorStrategy(),
    ];
  }

  /**
   * Add a custom strategy
   * @param {Object} strategy - Strategy to add
   * @param {number} priority - Priority (lower = higher priority)
   */
  addStrategy(strategy, priority = this.strategies.length) {
    this.strategies.splice(priority, 0, strategy);
  }

  /**
   * Handle validation error using appropriate strategy
   * @param {*} error - Validation error
   * @param {Object} engine - Form engine instance
   * @param {string} formErrorPath - Path for form-level errors
   */
  handle(error, engine, formErrorPath = '$form') {
    const strategy = this.strategies.find(s => s.canHandle(error));

    if (strategy) {
      strategy.handle(error, engine, formErrorPath);
    } else {
      // Fallback: treat as string
      engine.setError(formErrorPath, String(error));
    }
  }
}
