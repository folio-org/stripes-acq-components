/* Developed collaboratively using AI (Cursor) */

import {
  hashObject,
  hashObjectShallow,
  hashFormState,
} from '../hash';

describe('hash utilities', () => {
  it('should hash objects', () => {
    const obj = { a: 1, b: 2 };
    const hash1 = hashObject(obj);
    const hash2 = hashObject(obj);
    expect(hash1).toBe(hash2);
  });

  it('should hash arrays', () => {
    const arr = [1, 2, 3];
    const hash = hashObject(arr);
    expect(hash).toContain('1');
    expect(hash).toContain('2');
  });

  it('should hash nested structures', () => {
    const obj = { a: { b: { c: 1 } } };
    const hash = hashObject(obj);
    expect(typeof hash).toBe('string');
  });

  it('should handle null and undefined', () => {
    expect(hashObject(null)).toBe('null');
    expect(hashObject(undefined)).toBe('null');
  });

  it('should create shallow hash', () => {
    const obj = { a: 1, b: { c: 2 } };
    const hash = hashObjectShallow(obj);
    expect(hash).toContain('a:1');
  });

  it('should hash form state', () => {
    const formState = {
      values: { a: 1 },
      initialValues: { a: 1 },
      errors: {},
      touched: ['email'],
      active: 'email',
      submitting: false,
      dirty: false,
      pristine: true,
      valid: true,
    };
    const hash = hashFormState(formState);
    expect(typeof hash).toBe('string');
  });
});

