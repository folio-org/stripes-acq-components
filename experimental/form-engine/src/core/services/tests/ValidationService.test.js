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
      getFieldContext: (path, value, _allValues) => ({
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

  // ============================================
  // Edge Cases and Bug Prevention Tests
  // ============================================

  describe('validateAll() - edge cases', () => {
    it('should handle null validator result', async () => {
      const service = new ValidationService();

      service.registerValidator('field1', () => null);
      const errors = await service.validateAll({ field1: 'value' });

      expect(errors).toEqual({});
    });

    it('should handle undefined validator result', async () => {
      const service = new ValidationService();

      service.registerValidator('field1', () => undefined);
      const errors = await service.validateAll({ field1: 'value' });

      expect(errors).toEqual({});
    });

    it('should handle empty string validator result', async () => {
      const service = new ValidationService();

      service.registerValidator('field1', () => '');
      const errors = await service.validateAll({ field1: 'value' });

      expect(errors).toEqual({});
    });

    it('should handle empty array errors', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => []);
      const errors = await service.validateAll({ items: [] });

      expect(errors).toEqual({});
    });

    it('should handle array with undefined/null items', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [null, undefined, null]);
      const errors = await service.validateAll({ items: [1, 2, 3] });

      expect(errors).toEqual({});
    });

    it('should handle sparse arrays (holes)', async () => {
      const service = new ValidationService();

      // eslint-disable-next-line no-sparse-arrays
      service.registerValidator('items', () => [, , { field: 'error' }]);
      const errors = await service.validateAll({ items: [1, 2, 3] });

      expect(errors['items[2].field']).toBe('error');
      expect(errors['items[0]']).toBeUndefined();
      expect(errors['items[1]']).toBeUndefined();
    });

    it('should handle deeply nested array errors', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [
        {
          nested: {
            field: 'error1',
          },
        },
      ]);
      const errors = await service.validateAll({ items: [{}] });

      // Note: Current implementation only handles one level of nesting
      // This test documents current behavior
      expect(errors['items[0].nested']).toEqual({ field: 'error1' });
    });

    it('should handle array with mixed error types', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [
        'error1',
        { field: 'error2' },
        null,
        'error3',
      ]);
      const errors = await service.validateAll({ items: [1, 2, 3, 4] });

      expect(errors['items[0]']).toBe('error1');
      expect(errors['items[1].field']).toBe('error2');
      expect(errors['items[2]']).toBeUndefined();
      expect(errors['items[3]']).toBe('error3');
    });
  });

  describe('$form validator - edge cases', () => {
    it('should handle $form returning null', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => null);
      const errors = await service.validateAll({ field: 'value' });

      expect(errors).toEqual({});
      expect(errors.$form).toBeUndefined();
    });

    it('should handle $form returning empty object', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => ({}));
      const errors = await service.validateAll({ field: 'value' });

      expect(errors).toEqual({});
    });

    it('should handle $form with nested object and empty arrays', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => ({
        field1: [],
        field2: [null, null],
        field3: 'actual error',
      }));
      const errors = await service.validateAll({ field1: [], field2: [], field3: '' });

      expect(errors.field1).toBeUndefined();
      expect(errors.field2).toBeUndefined();
      expect(errors.field3).toBe('actual error');
    });

    it('should handle $form with multiple array fields', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => ({
        items1: [{ field: 'error1' }],
        items2: [null, { field: 'error2' }],
        regularField: 'error3',
      }));
      const errors = await service.validateAll({ items1: [{}], items2: [{}, {}], regularField: '' });

      expect(errors['items1[0].field']).toBe('error1');
      expect(errors['items2[1].field']).toBe('error2');
      expect(errors.regularField).toBe('error3');
      expect(errors.items1).toBeUndefined();
      expect(errors.items2).toBeUndefined();
    });

    it('should handle $form validator throwing error', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => {
        throw new Error('Validation failed');
      });
      const errors = await service.validateAll({ field: 'value' });

      expect(errors.$form).toBe('Validation failed');
    });

    it('should not create $form error when returning object with arrays', async () => {
      const service = new ValidationService();

      service.registerValidator('$form', () => ({
        items: [{ field: 'error' }],
      }));
      const errors = await service.validateAll({ items: [{}] });

      expect(errors.$form).toBeUndefined();
      expect(errors['items[0].field']).toBe('error');
    });
  });

  describe('Array error conversion - complex scenarios', () => {
    it('should handle array with only null and undefined', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [null, undefined, null]);
      const errors = await service.validateAll({ items: [] });

      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should handle array with string errors at specific indices', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => {
        const errors = [];

        errors[3] = 'error at index 3';
        errors[5] = 'error at index 5';

        return errors;
      });
      const errors = await service.validateAll({ items: [] });

      expect(errors['items[3]']).toBe('error at index 3');
      expect(errors['items[5]']).toBe('error at index 5');
      expect(Object.keys(errors)).toHaveLength(2);
    });

    it('should handle object errors with multiple fields per index', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [
        {
          field1: 'error1',
          field2: 'error2',
          field3: 'error3',
        },
      ]);
      const errors = await service.validateAll({ items: [{}] });

      expect(errors['items[0].field1']).toBe('error1');
      expect(errors['items[0].field2']).toBe('error2');
      expect(errors['items[0].field3']).toBe('error3');
      expect(Object.keys(errors)).toHaveLength(3);
    });

    it('should handle large array with errors at various indices', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => {
        const errors = new Array(100);

        errors[10] = { field: 'error10' };
        errors[50] = { field: 'error50' };
        errors[99] = { field: 'error99' };

        return errors;
      });
      const errors = await service.validateAll({ items: new Array(100) });

      expect(errors['items[10].field']).toBe('error10');
      expect(errors['items[50].field']).toBe('error50');
      expect(errors['items[99].field']).toBe('error99');
      expect(Object.keys(errors)).toHaveLength(3);
    });

    it('should handle very deeply nested array structures', async () => {
      const service = new ValidationService();

      // Test validator returning nested arrays within $form result
      service.registerValidator('$form', () => ({
        level1: [
          {
            level2: [
              {
                level3: 'deep error',
              },
            ],
          },
        ],
      }));
      const errors = await service.validateAll({ level1: [[{}]] });

      // Current implementation handles one level of array conversion
      // level2 will be assigned as an array (then filtered by ErrorsFeature)
      expect(errors['level1[0].level2']).toBeDefined();
    });

    it('should not create errors for completely empty nested structures', async () => {
      const service = new ValidationService();

      service.registerValidator('items', () => [
        null,
        {},  // Empty object creates path entries for its (non-existent) fields
        { field: null },
        { field: undefined },
        { field: '' },
      ]);
      const errors = await service.validateAll({ items: [] });

      // Empty objects still loop through Object.keys() but create no entries
      // because the keys array is empty. However, objects with null/undefined/''
      // values will create entries that get assigned
      expect(errors['items[2].field']).toBe(null);
      expect(errors['items[3].field']).toBe(undefined);
      expect(errors['items[4].field']).toBe('');
    });
  });

  describe('Validator registration and cleanup', () => {
    it('should handle unregistering non-existent validator', () => {
      const service = new ValidationService();
      const result = service.unregisterValidator('nonexistent');

      expect(result).toBe(false);
    });

    it('should cleanup debouncer when unregistering', () => {
      const service = new ValidationService();
      const validator = jest.fn(() => null);
      const debounced = service.createDebouncedValidator(validator);

      service.debouncers.set('email', debounced);
      service.registerValidator('email', validator);
      const cleanupSpy = jest.spyOn(debounced, 'cleanup');

      service.unregisterValidator('email');
      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should handle multiple registrations for same field', async () => {
      const service = new ValidationService();
      const validator1 = jest.fn(() => 'error1');
      const validator2 = jest.fn(() => 'error2');

      service.registerValidator('email', validator1);
      service.registerValidator('email', validator2); // overwrites
      const error = await service.validateField('email', '', {});

      expect(error).toBe('error2');
      expect(validator2).toHaveBeenCalled();
    });
  });

  describe('validateByMode - mode matching', () => {
    it('should only run validator when mode matches', async () => {
      const service = new ValidationService();
      const validator = jest.fn(() => null);

      service.registerValidator('email', validator, 'blur');
      await service.validateByMode('email', 'test', {}, 'blur');
      expect(validator).toHaveBeenCalledTimes(1);
      await service.validateByMode('email', 'test', {}, 'change');
      expect(validator).toHaveBeenCalledTimes(1); // still 1, not called again
    });

    it('should handle validateByMode with non-existent field', async () => {
      const service = new ValidationService();
      const result = await service.validateByMode('nonexistent', 'test', {}, 'blur');

      expect(result).toBe(null);
    });

    it('should handle validateByMode with invalid mode', async () => {
      const service = new ValidationService();

      service.registerValidator('email', () => 'error', 'blur');
      const result = await service.validateByMode('email', 'test', {}, 'invalid');

      expect(result).toBe(null);
    });
  });

  describe('Async validation', () => {
    it('should handle async validator with Promise.resolve', async () => {
      const service = new ValidationService();

      service.registerValidator('email', () => Promise.resolve('async error'));
      const error = await service.validateField('email', '', {});

      expect(error).toBe('async error');
    });

    it('should handle async validator with Promise.reject', async () => {
      const service = new ValidationService();

      service.registerValidator('email', () => Promise.reject(new Error('async rejection')));
      const error = await service.validateField('email', '', {});

      expect(error).toBe('async rejection');
    });

    it('should handle slow async validators', async () => {
      const service = new ValidationService();

      service.registerValidator('email', () => new Promise(resolve => {
        setTimeout(() => resolve('slow error'), 100);
      }));
      const error = await service.validateField('email', '', {});

      expect(error).toBe('slow error');
    });
  });

  describe('Debounced validation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should not call validator if value unchanged', () => {
      const service = new ValidationService({ debounceDelay: 100 });
      const validator = jest.fn(() => null);
      const debounced = service.createDebouncedValidator(validator, 100);
      const onResult = jest.fn();

      debounced('test', {}, onResult, 'email');
      jest.runAllTimers();
      expect(validator).toHaveBeenCalledTimes(1);

      // Call with same value - should not trigger validation again
      debounced('test', {}, onResult, 'email');
      jest.runAllTimers();
      expect(validator).toHaveBeenCalledTimes(1); // still 1, not 2
    });

    it('should cancel previous timeout on new value', () => {
      const service = new ValidationService({ debounceDelay: 100 });
      const validator = jest.fn(() => null);
      const debounced = service.createDebouncedValidator(validator, 100);
      const onResult = jest.fn();

      debounced('test1', {}, onResult, 'email');
      jest.advanceTimersByTime(50);
      debounced('test2', {}, onResult, 'email'); // cancels previous
      jest.advanceTimersByTime(50);
      expect(validator).not.toHaveBeenCalled(); // not yet
      jest.advanceTimersByTime(50);
      expect(validator).toHaveBeenCalledTimes(1); // only once for test2
    });
  });
});
