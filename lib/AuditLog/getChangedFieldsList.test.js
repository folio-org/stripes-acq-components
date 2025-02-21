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
});
