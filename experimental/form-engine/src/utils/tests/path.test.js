/* Developed collaboratively using AI (Cursor) */

import {
  deleteByPath,
  getByPath,
  hasPath,
  setByPath,
} from '../path';

describe('path utilities', () => {
  it('should get value by path with dot and bracket notations and numeric strings', () => {
    const obj = { a: { b: [{ x: 1 }, { x: 2 }] }, list: [{ y: 3 }] };

    expect(getByPath(obj, 'a.b[0].x')).toBe(1);
    expect(getByPath(obj, 'a.b.1.x')).toBe(2);
    expect(getByPath(obj, 'list.0.y')).toBe(3);
    expect(getByPath(obj, 'missing.path')).toBeUndefined();
  });

  it('should set value by path and create structures with array extension', () => {
    const obj = {};
    const r1 = setByPath(obj, 'a.b[0].x', 10);

    expect(getByPath(r1, 'a.b.0.x')).toBe(10);
    const r2 = setByPath(r1, 'a.b.2.x', 30);

    expect(getByPath(r2, 'a.b.2.x')).toBe(30);
  });

  it('should check path existence with hasPath', () => {
    const obj = { list: [{ v: 1 }, { v: 2 }, { v: 3 }], o: { k: 1 } };

    expect(hasPath(obj, 'list.1.v')).toBe(true);
    expect(hasPath(obj, 'o.k')).toBe(true);
    expect(hasPath(obj, 'o.missing')).toBe(false);
  });

  it('should delete values by path for arrays and objects', () => {
    let obj = { list: [{ v: 1 }, { v: 2 }, { v: 3 }], o: { k: 1 } };

    obj = deleteByPath(obj, 'list.1');
    expect(getByPath(obj, 'list.1.v')).toBe(3); // shifted after splice
    obj = deleteByPath(obj, 'o.k');
    expect(getByPath(obj, 'o.k')).toBeUndefined();
  });

  it('should handle empty path', () => {
    const obj = { a: 1 };

    expect(getByPath(obj, '')).toBe(obj);
    expect(setByPath(obj, '', { b: 2 })).toBe(obj);
    expect(hasPath(obj, '')).toBe(true);
  });

  it('should handle nested arrays', () => {
    const obj = { arr: [[1, 2], [3, 4]] };

    expect(getByPath(obj, 'arr[0][1]')).toBe(2);
    const updated = setByPath(obj, 'arr[1][0]', 99);

    expect(getByPath(updated, 'arr[1][0]')).toBe(99);
  });

  it('should support both dot and bracket notation for arrays', () => {
    const obj = { items: [{ name: 'first' }, { name: 'second' }] };

    // Both notations work with lodash
    expect(getByPath(obj, 'items[0].name')).toBe('first');
    expect(getByPath(obj, 'items.0.name')).toBe('first');

    // Setting with bracket notation
    const updated1 = setByPath(obj, 'items[1].name', 'updated');

    expect(getByPath(updated1, 'items[1].name')).toBe('updated');

    // Both can read the same path
    const updated2 = setByPath(obj, 'items.1.name', 'updated2');

    expect(getByPath(updated2, 'items[1].name')).toBe('updated2');
  });
});
