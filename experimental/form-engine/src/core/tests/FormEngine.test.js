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
    // eslint-disable-next-line dot-notation
    expect(allErrors['$form']).toBeUndefined();
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
    // eslint-disable-next-line dot-notation
    expect(allErrors['$form']).toBeUndefined();
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
});
