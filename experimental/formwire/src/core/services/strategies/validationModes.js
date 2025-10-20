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
    const delay = typeof modeOptions.debounceDelay === 'number'
      ? modeOptions.debounceDelay
      : service.options.debounceDelay;

    if (delay > 0) {
      let debounced = service.debouncers.get(path);

      if (!debounced) {
        debounced = service.createDebouncedValidator(async (v, allV, _fs, _api) => {
          return service._runValidator(path, v, allV);
        }, delay);

        service.debouncers.set(path, debounced);
      }

      return new Promise((resolve) => {
        debounced(value, allValues, (error) => resolve(error), path);
      });
    }

    return service._runValidator(path, value, allValues);
  },

  blur: async (path, value, allValues) => service._runValidator(path, value, allValues),

  submit: async (path, value, allValues) => service._runValidator(path, value, allValues),
});
