import { getChangedFieldsList } from './getChangedFieldsList';

describe('getChangedFieldsList', () => {
  it('should return correct array of changed fields', () => {
    const diff = {
      fieldChanges: [
        {
          fieldName: 'fieldName',
          changeType: 'ADDED',
          newValue: 'newValue',
          oldValue: 'oldValue',
        },
      ],
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [
          {
            changeType: 'MODIFIED',
            newValue: { name: 'name1' },
            oldValue: { name: 'name2' },
          },
          {
            changeType: 'REMOVED',
            newValue: { name: 'name1' },
            oldValue: { name: 'name2' },
          },
        ],
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
        oldValue: 'oldValue',
      },
      {
        fieldName: 'contributors',
        changeType: 'MODIFIED',
        newValue: { name: 'name1' },
        oldValue: { name: 'name2' },
      },
      {
        fieldName: 'contributors',
        changeType: 'REMOVED',
        newValue: { name: 'name1' },
        oldValue: { name: 'name2' },
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct array of changed fields when fieldChanges is empty', () => {
    const diff = {
      fieldChanges: [],
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [
          {
            changeType: 'MODIFIED',
            newValue: { name: 'name1' },
            oldValue: { name: 'name2' },
          },
        ],
      }],
    };
    const result = [
      {
        fieldName: 'contributors',
        changeType: 'MODIFIED',
        newValue: { name: 'name1' },
        oldValue: { name: 'name2' },
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct array of changed fields when collectionChanges is empty', () => {
    const diff = {
      fieldChanges: [
        {
          fieldName: 'fieldName',
          changeType: 'ADDED',
          newValue: 'newValue',
          oldValue: 'oldValue',
        },
      ],
      collectionChanges: [],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
        oldValue: 'oldValue',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });
});
