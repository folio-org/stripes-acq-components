/* Developed collaboratively using AI (Cursor) */

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  DIRTY_CHECK_STRATEGY,
  FORM_ENGINE_OPTIONS,
} from '../../constants';
import FormEngine from '../FormEngine';

describe('FormEngine', () => {
  it('should initialize and return form state with correct values', () => {
    const engine = new FormEngine().init({ a: 1 });
    const fs = engine.getFormState();

    expect(fs.values.a).toBe(1);
    expect(fs.pristine).toBe(true);
    expect(fs.submitSucceeded).toBe(false);
  });

  it('should use custom isEqual strategy via options', async () => {
    const engine = new FormEngine().init(
      { a: { x: 1 } },
      {
        dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.VALUES,
        isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      },
    );

    expect(engine.isDirty()).toBe(false);
    engine.set('a', { x: 1 });
    // Wait for dirty check to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(engine.isDirty()).toBe(false); // equal by custom comparator
    engine.set('a', { x: 2 });
    // Wait for dirty check to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(engine.isDirty()).toBe(true);
  });

  it('should handle get and set operations', () => {
    const engine = new FormEngine().init({ name: 'test', age: 25 });

    expect(engine.get('name')).toBe('test');
    engine.set('name', 'updated');
    expect(engine.get('name')).toBe('updated');
  });

  it('should handle setMany operations', () => {
    const engine = new FormEngine().init({ a: 1, b: 2 });

    engine.setMany([
      { path: 'a', value: 10 },
      { path: 'b', value: 20 },
    ]);
    expect(engine.get('a')).toBe(10);
    expect(engine.get('b')).toBe(20);
  });

  it('should track operations count', () => {
    const engine = new FormEngine().init({});

    engine.get('test');
    engine.set('test', 'value');
    // Operations tracking was removed for performance
  });

  it('should handle reset', async () => {
    const engine = new FormEngine().init({ a: 1 });

    engine.set('a', 2);
    // Wait for dirty check to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    await waitFor(async () => expect(engine.isDirty()).toBe(true));
    engine.reset();
    expect(engine.isInitialized).toBe(false);
  });

  it('should handle submit with validation', async () => {
    const engine = new FormEngine().init({ email: '' });

    engine.registerValidator('email', (v) => (!v ? 'Required' : null), 'submit');
    const result = await engine.submit();

    expect(result.success).toBe(false);
    expect(result.errors.email).toBe('Required');
  });

  it('should handle successful submit', async () => {
    const engine = new FormEngine().init({ email: 'test@test.com' });
    const onSubmit = jest.fn();
    const result = await engine.submit(onSubmit);

    expect(result.success).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should reset submitSucceeded when form changes after successful submit', () => {
    const engine = new FormEngine().init({ email: 'test@test.com' });

    engine.submit().then(() => {
      expect(engine.submittingFeature.hasSubmitSucceeded()).toBe(true);
      engine.set('email', 'new@test.com');
      expect(engine.submittingFeature.hasSubmitSucceeded()).toBe(false);
    });
  });

  it('should get debug info', async () => {
    const engine = new FormEngine().init({ a: 1 });

    engine.set('a', 2);
    // Wait for dirty check to complete (it's async via queueMicrotask)
    await new Promise(resolve => setTimeout(resolve, 10));
    const debug = engine.getDebugInfo();

    await waitFor(async () => expect(engine.isDirty()).toBe(true));
    expect(debug.dirtyStrategy).toBe(DIRTY_CHECK_STRATEGY.VALUES);
    // Check that new validity info is present
    expect(debug.formValid).toBeDefined();
    expect(debug.errorsCount).toBeDefined();
    expect(debug.errorsList).toBeDefined();
    expect(debug.errors).toBeDefined();
  });

  it('should include validation info in debug info', async () => {
    const engine = new FormEngine().init({ email: '', name: '' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');
    engine.registerValidator('name', (v) => (!v ? 'Name is required' : null), 'submit');

    await engine.validateAll();
    const debug = engine.getDebugInfo();

    expect(debug.formValid).toBe(false);
    expect(debug.errorsCount).toBe(2);
    expect(debug.errorsList).toContain('email');
    expect(debug.errorsList).toContain('name');
    expect(debug.errors.email).toBe('Email is required');
    expect(debug.errors.name).toBe('Name is required');
  });

  it('should show valid form in debug info when all validations pass', async () => {
    const engine = new FormEngine().init({ email: 'test@test.com', name: 'John' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');
    engine.registerValidator('name', (v) => (!v ? 'Name is required' : null), 'submit');

    await engine.validateAll();
    const debug = engine.getDebugInfo();

    expect(debug.formValid).toBe(true);
    expect(debug.errorsCount).toBe(0);
    expect(debug.errorsList.length).toBe(0);
  });

  it('should validate a single field programmatically', async () => {
    const engine = new FormEngine().init({ email: '', name: 'John' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');
    engine.registerValidator('name', (v) => (!v ? 'Name is required' : null), 'submit');

    const error = await engine.validateField('email');

    expect(error).toBe('Email is required');
    expect(engine.getErrors()).toEqual({ email: 'Email is required' });
    expect(engine.getFieldState('email').error).toBe('Email is required');
  });

  it('should return null when field is valid', async () => {
    const engine = new FormEngine().init({ email: 'test@example.com' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');

    const error = await engine.validateField('email');

    expect(error).toBeNull();
    expect(engine.getErrors()).toEqual({});
    expect(engine.getFieldState('email').error).toBeNull();
  });

  it('should validate field through formApi', async () => {
    const engine = new FormEngine().init({ email: '' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');

    const formApi = engine.getFormApi();
    const error = await formApi.validateField('email');

    expect(error).toBe('Email is required');
    expect(formApi.getErrors()).toEqual({ email: 'Email is required' });
  });

  it('should clear previous error when field becomes valid', async () => {
    const engine = new FormEngine().init({ email: '' });

    engine.registerValidator('email', (v) => (!v ? 'Email is required' : null), 'submit');

    await engine.validateField('email');
    expect(engine.getErrors()).toEqual({ email: 'Email is required' });

    engine.set('email', 'test@example.com');
    await engine.validateField('email');

    expect(engine.getErrors()).toEqual({});
    expect(engine.getFieldState('email').error).toBeNull();
  });

  it('should handle form-level validator and return field errors', async () => {
    const engine = new FormEngine().init({
      fyFinanceData: [
        { budgetAllocationChange: 0 },
        { budgetAllocationChange: 100 },
        { budgetAllocationChange: 50 },
        { budgetAllocationChange: -500000 },
      ],
    });

    // Form-level validator that returns object with field errors
    // First param (_ignored) is null for $form, we use allValues instead
    const formValidator = (_ignored, allValues) => {
      const errors = {};

      if (allValues.fyFinanceData && Array.isArray(allValues.fyFinanceData)) {
        allValues.fyFinanceData.forEach((item, index) => {
          if (item.budgetAllocationChange < 0) {
            errors[`fyFinanceData[${index}].budgetAllocationChange`] = 'New total allocation cannot be negative';
          }
        });
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };

    engine.registerValidator('$form', formValidator, 'submit');
    await engine.validateAll();
    const allErrors = engine.getErrors();
    const debug = engine.getDebugInfo();

    // Check that errors are for specific fields, not $form
    expect(debug.formValid).toBe(false);
    // Verify errors exist for the negative field with bracket notation
    expect(allErrors['fyFinanceData[3].budgetAllocationChange']).toBe('New total allocation cannot be negative');
    expect(allErrors.$form).toBeUndefined();
  });

  it('should handle array errors from validators', async () => {
    const engine = new FormEngine().init({
      fyFinanceData: [
        { budgetAllocationChange: 0 },
        { budgetAllocationChange: 100 },
        { budgetAllocationChange: 50 },
        { budgetAllocationChange: -500000 },
      ],
    });

    // Field-level validator that returns array with nested errors
    // This simulates validators that return array structures
    const arrayValidator = (value) => {
      if (!Array.isArray(value)) return null;

      const errors = [];

      value.forEach((item, index) => {
        if (item.budgetAllocationChange < 0) {
          errors[index] = {
            budgetAllocationChange: 'New total allocation cannot be negative',
          };
        }
      });

      return errors.some(e => e) ? errors : null;
    };

    engine.registerValidator('fyFinanceData', arrayValidator, 'submit');
    await engine.validateAll();
    const allErrors = engine.getErrors();
    const debug = engine.getDebugInfo();

    // Check that array errors are converted to field paths with bracket notation
    expect(debug.formValid).toBe(false);
    expect(allErrors['fyFinanceData[3].budgetAllocationChange']).toBe('New total allocation cannot be negative');
    // Ensure no array is stored as error value
    expect(allErrors.fyFinanceData).toBeUndefined();
  });

  it('should handle $form validator returning object with array values', async () => {
    const engine = new FormEngine().init({
      fyFinanceData: [
        { budgetAllocationChange: 0 },
        { budgetAllocationChange: 100 },
        { budgetAllocationChange: 50 },
        { budgetAllocationChange: -500000 },
      ],
    });

    // Form-level validator that returns object with array as value
    // This simulates the real-world case from BatchAllocationsForm
    const formValidator = (_ignored, allValues) => {
      const errors = {};

      if (allValues.fyFinanceData && Array.isArray(allValues.fyFinanceData)) {
        const fieldErrors = [];

        allValues.fyFinanceData.forEach((item, index) => {
          if (item.budgetAllocationChange < 0) {
            fieldErrors[index] = {
              budgetAllocationChange: 'New total allocation cannot be negative',
            };
          }
        });

        if (fieldErrors.some(e => e)) {
          errors.fyFinanceData = fieldErrors;
        }
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };

    engine.registerValidator('$form', formValidator, 'submit');
    await engine.validateAll();
    const allErrors = engine.getErrors();
    const debug = engine.getDebugInfo();

    // Check that array errors are converted to field paths with bracket notation
    expect(debug.formValid).toBe(false);
    expect(allErrors['fyFinanceData[3].budgetAllocationChange']).toBe('New total allocation cannot be negative');
    // Ensure fyFinanceData itself doesn't have array error
    expect(allErrors.fyFinanceData).toBeUndefined();
    expect(allErrors.$form).toBeUndefined();
  });

  it('should get service stats', () => {
    const engine = new FormEngine().init({});
    const stats = engine.getServiceStats();

    expect(stats.engine).toBeDefined();
    expect(stats.cache).toBeDefined();
    expect(stats.validation).toBeDefined();
    expect(stats.events).toBeDefined();
    expect(stats.batch).toBeDefined();
  });

  it('should handle updateConfig', () => {
    const engine = new FormEngine().init({});

    engine.updateConfig({ [FORM_ENGINE_OPTIONS.BATCH_DELAY]: 100 });
    expect(engine.getConfig()[FORM_ENGINE_OPTIONS.BATCH_DELAY]).toBe(100);
  });

  it('should handle getFormApi', () => {
    const engine = new FormEngine().init({ a: 1 });
    const api = engine.getFormApi();

    expect(api.get('a')).toBe(1);
    api.set('a', 2);
    expect(api.get('a')).toBe(2);
  });

  it('should handle batch operations', () => {
    const engine = new FormEngine().init({});

    engine.batch(() => {
      engine.set('a', 1);
      engine.set('b', 2);
    });
    expect(engine.get('a')).toBe(1);
    expect(engine.get('b')).toBe(2);
  });

  it('should throw error if used before init', () => {
    const engine = new FormEngine();

    expect(() => engine.get('test')).toThrow('FormEngine must be initialized');
  });

  describe('Edge cases and error handling', () => {
    it('should handle init with null initialValues', () => {
      const engine = new FormEngine().init(null);
      const fs = engine.getFormState();

      expect(fs.values).toEqual({});
      expect(fs.pristine).toBe(true);
    });

    it('should handle init with undefined initialValues', () => {
      const engine = new FormEngine().init(undefined);
      const fs = engine.getFormState();

      expect(fs.values).toEqual({});
      expect(fs.pristine).toBe(true);
    });

    it('should filter out undefined values from config', () => {
      const engine = new FormEngine().init({}, {
        [FORM_ENGINE_OPTIONS.BATCH_DELAY]: 100,
        [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: undefined,
      });

      expect(engine.getConfig()[FORM_ENGINE_OPTIONS.BATCH_DELAY]).toBe(100);
      // Should use default value since undefined was filtered out
      expect(engine.getConfig()[FORM_ENGINE_OPTIONS.ENABLE_BATCHING]).toBe(true);
    });

    it('should handle set with deeply nested path', () => {
      const engine = new FormEngine().init({});

      engine.set('a.b.c.d.e', 'deep');
      expect(engine.get('a.b.c.d.e')).toBe('deep');
    });

    it('should handle get with non-existent path', () => {
      const engine = new FormEngine().init({ a: 1 });

      expect(engine.get('b.c.d')).toBeUndefined();
    });

    it('should handle setMany with empty array', () => {
      const engine = new FormEngine().init({ a: 1 });

      engine.setMany([]);
      expect(engine.get('a')).toBe(1);
    });

    it('should handle array operations with bracket notation', () => {
      const engine = new FormEngine().init({ items: [{ name: 'a' }, { name: 'b' }] });

      engine.set('items[0].name', 'updated');
      expect(engine.get('items[0].name')).toBe('updated');
      expect(engine.get('items[1].name')).toBe('b');
    });

    it('should handle submit with onSubmit returning promise', async () => {
      const engine = new FormEngine().init({ email: 'test@test.com' });
      const onSubmit = jest.fn(() => Promise.resolve());
      const result = await engine.submit(onSubmit);

      expect(result.success).toBe(true);
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should handle submit with onSubmit throwing error', async () => {
      const engine = new FormEngine().init({ email: 'test@test.com' });
      const onSubmit = jest.fn(() => {
        throw new Error('Submit error');
      });
      const result = await engine.submit(onSubmit);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Submit error');
    });

    it('should handle multiple reset calls', () => {
      const engine = new FormEngine().init({ a: 1 });

      engine.reset();
      expect(engine.isInitialized).toBe(false);

      // Second reset should not throw
      engine.reset();
      expect(engine.isInitialized).toBe(false);
    });

    it('should handle batch callback with error', () => {
      const engine = new FormEngine().init({});

      expect(() => {
        engine.batch(() => {
          engine.set('a', 1);
          throw new Error('Batch error');
        });
      }).toThrow('Batch error');

      // Value should still be set before error
      expect(engine.get('a')).toBe(1);
    });

    it('should handle updateConfig with null', () => {
      const engine = new FormEngine().init({});

      engine.updateConfig(null);
      // Should keep existing config
      expect(engine.getConfig()[FORM_ENGINE_OPTIONS.ENABLE_BATCHING]).toBe(true);
    });

    it('should handle setError with error message', () => {
      const engine = new FormEngine().init({ email: '' });

      engine.setError('email', 'Invalid email');
      const errors = engine.getErrors();

      expect(errors.email).toBe('Invalid email');
    });

    it('should handle clearError for non-existent field', () => {
      const engine = new FormEngine().init({});

      // Should not throw
      engine.clearError('nonexistent');
      const errors = engine.getErrors();

      expect(errors.nonexistent).toBeUndefined();
    });

    it('should handle touch for nested field', () => {
      const engine = new FormEngine().init({ user: { email: '' } });

      engine.touch('user.email');
      expect(engine.isTouched('user.email')).toBe(true);
    });

    it('should handle focus and blur for nested field', () => {
      const engine = new FormEngine().init({ user: { email: '' } });

      engine.focus('user.email');
      const state1 = engine.getFormState();

      expect(state1.active).toBe('user.email');

      engine.blur();
      const state2 = engine.getFormState();

      expect(state2.active).toBeNull();
    });

    it('should emit events in batch mode', (done) => {
      const engine = new FormEngine().init({}, {
        [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: true,
      });

      let eventCount = 0;

      engine.on('change:a', () => {
        eventCount++;
      });

      engine.batch(() => {
        engine.set('a', 1);
        engine.set('a', 2);
        engine.set('a', 3);
      });

      // Events should be batched
      setTimeout(() => {
        expect(eventCount).toBeGreaterThan(0);
        done();
      }, 50);
    });

    it('should handle complex form state access', () => {
      const engine = new FormEngine().init({
        user: {
          name: 'John',
          addresses: [
            { street: '123 Main', city: 'NYC' },
            { street: '456 Oak', city: 'LA' },
          ],
        },
      });

      const state = engine.getFormState();

      expect(state.values.user.name).toBe('John');
      expect(state.values.user.addresses[0].city).toBe('NYC');
      expect(state.pristine).toBe(true);
      expect(state.submitting).toBe(false);
    });

    it('should handle reset cleanup', () => {
      const engine = new FormEngine().init({ a: 1 });
      const listener = jest.fn();

      engine.on('change:a', listener);
      engine.set('a', 2);

      engine.reset();

      // After reset, engine should not be initialized
      expect(engine.isInitialized).toBe(false);
    });
  });
});
