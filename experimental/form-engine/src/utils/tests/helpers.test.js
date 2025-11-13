/* Developed collaboratively using AI (Cursor) */

import { safeCall, safeGet, createCleanObject } from '../helpers';

describe('helpers', () => {
  describe('safeCall', () => {
    it('should call method if it exists and is a function', () => {
      const obj = {
        method: jest.fn(() => 'result'),
      };

      const result = safeCall(obj, 'method', 'arg1', 'arg2');

      expect(obj.method).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toBe('result');
    });

    it('should return undefined if object is null', () => {
      const result = safeCall(null, 'method');

      expect(result).toBeUndefined();
    });

    it('should return undefined if object is undefined', () => {
      const result = safeCall(undefined, 'method');

      expect(result).toBeUndefined();
    });

    it('should return undefined if method does not exist', () => {
      const obj = {};
      const result = safeCall(obj, 'nonExistent');

      expect(result).toBeUndefined();
    });

    it('should return undefined if method is not a function', () => {
      const obj = { method: 'not a function' };
      const result = safeCall(obj, 'method');

      expect(result).toBeUndefined();
    });

    it('should pass multiple arguments', () => {
      const obj = {
        sum: jest.fn((a, b, c) => a + b + c),
      };

      const result = safeCall(obj, 'sum', 1, 2, 3);

      expect(result).toBe(6);
    });
  });

  describe('safeGet', () => {
    it('should return property value if it exists', () => {
      const obj = { prop: 'value' };
      const result = safeGet(obj, 'prop');

      expect(result).toBe('value');
    });

    it('should return default value if object is null', () => {
      const result = safeGet(null, 'prop', 'default');

      expect(result).toBe('default');
    });

    it('should return default value if object is undefined', () => {
      const result = safeGet(undefined, 'prop', 'default');

      expect(result).toBe('default');
    });

    it('should return default value if property does not exist', () => {
      const obj = {};
      const result = safeGet(obj, 'nonExistent', 'default');

      expect(result).toBe('default');
    });

    it('should return undefined as default if not specified', () => {
      const obj = {};
      const result = safeGet(obj, 'nonExistent');

      expect(result).toBeUndefined();
    });

    it('should return property even if it is falsy', () => {
      const obj = { prop: 0 };
      const result = safeGet(obj, 'prop', 'default');

      expect(result).toBe(0);
    });
  });

  describe('createCleanObject', () => {
    it('should create object with null prototype', () => {
      const obj = createCleanObject();

      expect(Object.getPrototypeOf(obj)).toBeNull();
    });

    it('should not have inherited properties', () => {
      const obj = createCleanObject();

      expect(obj.toString).toBeUndefined();
      expect(obj.hasOwnProperty).toBeUndefined();
    });

    it('should copy source object properties if provided', () => {
      const source = { a: 1, b: 2 };
      const obj = createCleanObject(source);

      expect(obj.a).toBe(1);
      expect(obj.b).toBe(2);
      expect(Object.getPrototypeOf(obj)).toBeNull();
    });

    it('should create empty object if source is null', () => {
      const obj = createCleanObject(null);

      expect(Object.keys(obj).length).toBe(0);
      expect(Object.getPrototypeOf(obj)).toBeNull();
    });
  });
});
