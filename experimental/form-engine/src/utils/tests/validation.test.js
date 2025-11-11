/* Developed collaboratively using AI (Cursor) */

import { validateField } from '../validation';

describe('validation utilities', () => {
  it('should validate field and set error', async () => {
    const engine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
    const validator = jest.fn(() => 'Error message');
    await validateField(validator, 'test', {}, engine, 'email');
    expect(engine.setError).toHaveBeenCalledWith('email', 'Error message');
  });

  it('should clear error when validation passes', async () => {
    const engine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
    const validator = jest.fn(() => null);
    await validateField(validator, 'test', {}, engine, 'email');
    expect(engine.clearError).toHaveBeenCalledWith('email');
  });

  it('should handle validation errors', async () => {
    const engine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
    const validator = jest.fn(() => { throw new Error('Validation error'); });
    await validateField(validator, 'test', {}, engine, 'email');
    expect(engine.setError).toHaveBeenCalledWith('email', 'Validation error');
  });

  it('should not validate if validator is not provided', async () => {
    const engine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
    await validateField(null, 'test', {}, engine, 'email');
    expect(engine.setError).not.toHaveBeenCalled();
    expect(engine.clearError).not.toHaveBeenCalled();
  });
});

