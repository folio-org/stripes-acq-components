/* Developed collaboratively using AI (Cursor) */

import {
  isDefined,
  isEqual,
  isFunction,
  isNullish,
  isObject,
} from '../checks';

describe('checks utilities', () => {
  it('should check if value is defined', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  it('should check if value is nullish', () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(1)).toBe(false);
    expect(isNullish('')).toBe(false);
  });

  it('should perform deep equality check with isEqual', () => {
    expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    expect(isEqual({ a: [1, 2] }, { a: [2, 1] })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('should check if value is a function', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(123)).toBe(false);
    expect(isFunction('string')).toBe(false);
  });

  it('should check if value is an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(123)).toBe(false);
  });
});
