/* Developed collaboratively using AI (Cursor) */

import { ValidationService } from '../ValidationService';

describe('ValidationService', () => {
  it('should register validator', () => {
    const service = new ValidationService();
    const validator = jest.fn(() => null);
    service.registerValidator('email', validator, 'blur');
    expect(service.hasValidator('email')).toBe(true);
  });

  it('should unregister validator', () => {
    const service = new ValidationService();
    const validator = jest.fn(() => null);
    service.registerValidator('email', validator, 'blur');
    service.unregisterValidator('email');
    expect(service.hasValidator('email')).toBe(false);
  });

  it('should validate field', async () => {
    const service = new ValidationService();
    const validator = jest.fn((value) => (!value ? 'Required' : null));
    service.registerValidator('email', validator, 'blur');
    const error = await service.validateField('email', '', { email: '' });
    expect(error).toBe('Required');
    const noError = await service.validateField('email', 'test@test.com', { email: 'test@test.com' });
    expect(noError).toBe(null);
  });

  it('should validate all fields', async () => {
    const service = new ValidationService();
    service.registerValidator('email', (v) => (!v ? 'Required' : null), 'submit');
    service.registerValidator('password', (v) => (!v ? 'Required' : null), 'submit');
    const errors = await service.validateAll({ email: '', password: '' });
    expect(errors.email).toBe('Required');
    expect(errors.password).toBe('Required');
  });

  it('should handle validation errors', async () => {
    const service = new ValidationService();
    service.registerValidator('email', () => { throw new Error('Validation error'); }, 'blur');
    const error = await service.validateField('email', 'test', { email: 'test' });
    expect(error).toBe('Validation error');
  });

  it('should validate by mode', async () => {
    const service = new ValidationService();
    const blurValidator = jest.fn(() => null);
    const changeValidator = jest.fn(() => null);
    service.registerValidator('email', blurValidator, 'blur');
    service.registerValidator('password', changeValidator, 'change');
    await service.validateByMode('email', 'test', { email: 'test' }, 'blur');
    expect(blurValidator).toHaveBeenCalled();
    await service.validateByMode('password', 'test', { password: 'test' }, 'change');
    expect(changeValidator).toHaveBeenCalled();
  });

  it('should not validate if mode does not match', async () => {
    const service = new ValidationService();
    const validator = jest.fn(() => null);
    service.registerValidator('email', validator, 'blur');
    const result = await service.validateByMode('email', 'test', { email: 'test' }, 'change');
    expect(result).toBe(null);
    expect(validator).not.toHaveBeenCalled();
  });

  it('should create debounced validator', () => {
    const service = new ValidationService({ debounceDelay: 100 });
    const validator = jest.fn(() => null);
    const debounced = service.createDebouncedValidator(validator, 100);
    expect(typeof debounced).toBe('function');
    expect(debounced.cleanup).toBeDefined();
  });

  it('should cleanup debounced validator', () => {
    const service = new ValidationService();
    const validator = jest.fn(() => null);
    const debounced = service.createDebouncedValidator(validator, 100);
    debounced('test', {}, () => {});
    debounced.cleanup();
    expect(debounced.cleanup).toBeDefined();
  });

  it('should use field context if provided', async () => {
    const service = new ValidationService({
      getFieldContext: (path, value, allValues) => ({
        fieldState: { value, path },
        api: {},
      }),
    });
    const validator = jest.fn((value, allValues, fieldState) => {
      expect(fieldState).toBeDefined();
      return null;
    });
    service.registerValidator('email', validator, 'blur');
    await service.validateField('email', 'test', { email: 'test' });
    expect(validator).toHaveBeenCalled();
  });
});

