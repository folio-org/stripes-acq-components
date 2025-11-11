/* Developed collaboratively using AI (Cursor) */

import { createValidationModeStrategies } from '../strategies/validationModes';

describe('validationModes', () => {
  it('should create validation mode strategies', () => {
    const service = {
      options: { debounceDelay: 300 },
      debouncers: new Map(),
      _runValidator: jest.fn(() => Promise.resolve(null)),
    };
    const strategies = createValidationModeStrategies(service);
    expect(strategies.change).toBeDefined();
    expect(strategies.blur).toBeDefined();
    expect(strategies.submit).toBeDefined();
  });

  it('should validate immediately for blur mode', async () => {
    const service = {
      options: { debounceDelay: 300 },
      debouncers: new Map(),
      _runValidator: jest.fn(() => Promise.resolve(null)),
    };
    const strategies = createValidationModeStrategies(service);
    await strategies.blur('email', 'test', { email: 'test' });
    expect(service._runValidator).toHaveBeenCalledWith('email', 'test', { email: 'test' });
  });

  it('should validate immediately for submit mode', async () => {
    const service = {
      options: { debounceDelay: 300 },
      debouncers: new Map(),
      _runValidator: jest.fn(() => Promise.resolve(null)),
    };
    const strategies = createValidationModeStrategies(service);
    await strategies.submit('email', 'test', { email: 'test' });
    expect(service._runValidator).toHaveBeenCalledWith('email', 'test', { email: 'test' });
  });

  it('should debounce validation for change mode with delay', async () => {
    const service = {
      options: { debounceDelay: 100 },
      debouncers: new Map(),
      createDebouncedValidator: jest.fn((validator, delay) => {
        return (value, allValues, onResult) => {
          setTimeout(() => onResult(null), delay);
        };
      }),
      _runValidator: jest.fn(() => Promise.resolve(null)),
    };
    const strategies = createValidationModeStrategies(service);
    const promise = strategies.change('email', 'test', { email: 'test' }, { debounceDelay: 100 });
    expect(service.createDebouncedValidator).toHaveBeenCalled();
    await promise;
  });

  it('should validate immediately for change mode without delay', async () => {
    const service = {
      options: { debounceDelay: 0 },
      debouncers: new Map(),
      _runValidator: jest.fn(() => Promise.resolve(null)),
    };
    const strategies = createValidationModeStrategies(service);
    await strategies.change('email', 'test', { email: 'test' }, { debounceDelay: 0 });
    expect(service._runValidator).toHaveBeenCalledWith('email', 'test', { email: 'test' });
  });
});

