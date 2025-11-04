/**
 * Validation mode strategies
 * Extracted to a separate module for clarity and testability
 */

/**
 * Build strategies for validation modes bound to a specific ValidationService instance.
 * @param {import('../ValidationService').ValidationService} service
 */
export const createValidationModeStrategies = (service) => ({
  change: async (path, value, allValues, modeOptions = {}) => {
    // Use delay from options or fallback to service default
    const delay = typeof modeOptions.debounceDelay === 'number'
      ? modeOptions.debounceDelay
      : service.options.debounceDelay;

    if (delay > 0) {
      // Get or create debounced validator for this field
      // Debounced validators are cached per field to avoid creating new debounce functions
      let debounced = service.debouncers.get(path);

      if (!debounced) {
        // Create debounced validator that will delay execution
        // The debounce function accumulates calls and only executes the last one after delay
        debounced = service.createDebouncedValidator(async (v, allV, _fs, _api) => {
          return service._runValidator(path, v, allV);
        }, delay);

        service.debouncers.set(path, debounced);
      }

      // Return promise that resolves when debounced validator completes
      // The debounce function calls the callback with the error result
      return new Promise((resolve) => {
        debounced(value, allValues, (error) => resolve(error), path);
      });
    }

    // No delay - validate immediately
    return service._runValidator(path, value, allValues);
  },

  blur: async (path, value, allValues) => service._runValidator(path, value, allValues),

  submit: async (path, value, allValues) => service._runValidator(path, value, allValues),
});
