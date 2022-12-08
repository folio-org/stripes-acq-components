import { cloneDeep, get, set, unset } from 'lodash';

import { FIELD_CHANGE_TYPES, objectDifference } from './objectDifference';

const initObject = {
  foo: 'bar',
  bar: {
    baz: '42',
  },
  baz: {
    abc: [
      { name: 'Bib' },
      { name: 'Bob' },
    ],
  },
  emp: [],
};

describe('objectDifference', () => {
  it('should return an empty array if passed arguments are the same object', () => {
    expect(objectDifference(initObject, initObject)).toEqual([]);
  });

  it('should return an empty array if passed objects have no difference', () => {
    const secondObj = cloneDeep(initObject);

    const differenceObject = objectDifference(initObject, secondObj);

    expect(differenceObject).toEqual([]);
  });

  describe('difference', () => {
    it('should return array containing added fields to the first object (from the second one)', () => {
      const secondObj = cloneDeep(initObject);
      const fieldsToAdd = [
        ['newStringField', 'Bla bla'],
        ['baz.abc[2]', { hello: 'world' }],
      ];

      fieldsToAdd.forEach(([field, value]) => set(secondObj, field, value));

      expect(objectDifference(initObject, secondObj)).toEqual(
        expect.arrayContaining(
          fieldsToAdd.reduce((acc, [path, value]) => [
            ...acc,
            {
              path,
              type: FIELD_CHANGE_TYPES.create,
              values: [undefined, value],
            },
          ], []),
        ),
      );
    });

    it('should return array containing deleted fields (from the first object)', () => {
      const secondObj = cloneDeep(initObject);
      const fieldsToDelete = [
        'foo',
        'bar.baz',
        'baz.abc[1].name',
      ];

      fieldsToDelete.forEach((field) => unset(secondObj, field));

      expect(objectDifference(initObject, secondObj)).toEqual(
        expect.arrayContaining(
          fieldsToDelete.reduce((acc, path) => [
            ...acc,
            {
              path,
              type: FIELD_CHANGE_TYPES.delete,
              values: [get(initObject, path), undefined],
            },
          ], []),
        ),
      );
    });

    it('should return array containing updated fields', () => {
      const secondObj = cloneDeep(initObject);
      const fieldsToUpdate = [
        ['foo', 'oof'],
        ['bar.baz', 69],
        ['baz.abc[1].name', 'Boe'],
        ['emp', {}],
      ];

      fieldsToUpdate.forEach(([field, value]) => set(secondObj, field, value));

      expect(objectDifference(initObject, secondObj)).toEqual(
        expect.arrayContaining(
          fieldsToUpdate.reduce((acc, [path, value]) => [
            ...acc,
            {
              path,
              type: FIELD_CHANGE_TYPES.update,
              values: [get(initObject, path), value],
            },
          ], []),
        ),
      );
    });

    it('should not mutate initial objects', () => {
      expect(initObject).toEqual({
        foo: 'bar',
        bar: {
          baz: '42',
        },
        baz: {
          abc: [
            { name: 'Bib' },
            { name: 'Bob' },
          ],
        },
        emp: [],
      });
    });
  });
});
