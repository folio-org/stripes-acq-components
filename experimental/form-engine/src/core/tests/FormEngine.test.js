/* Developed collaboratively using AI (Cursor) */

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

  it('should use custom isEqual strategy via options', () => {
    const engine = new FormEngine().init(
      { a: { x: 1 } },
      {
        dirtyCheckStrategy: DIRTY_CHECK_STRATEGY.VALUES,
        isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      }
    );
    expect(engine.isDirty()).toBe(false);
    engine.set('a', { x: 1 });
    expect(engine.isDirty()).toBe(false); // equal by custom comparator
    engine.set('a', { x: 2 });
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
    const initialOps = engine.operations;
    engine.get('test');
    engine.set('test', 'value');
    expect(engine.operations).toBeGreaterThan(initialOps);
  });

  it('should handle reset', () => {
    const engine = new FormEngine().init({ a: 1 });
    engine.set('a', 2);
    expect(engine.isDirty()).toBe(true);
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

  it('should get debug info', () => {
    const engine = new FormEngine().init({ a: 1 });
    engine.set('a', 2);
    const debug = engine.getDebugInfo();
    expect(debug.formDirty).toBe(true);
    expect(debug.dirtyStrategy).toBe(DIRTY_CHECK_STRATEGY.VALUES);
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
