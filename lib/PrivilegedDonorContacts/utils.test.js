import { getContactsUrl, getResultsFormatter, transformCategoryIdsToLabels } from './utils';

describe('transformCategoryIdsToLabels', () => {
  it('should return empty string if categories is not provided', () => {
    const result = transformCategoryIdsToLabels([
      {
        id: '1',
        value: 'Value 1',
      },
      {
        id: '2',
        value: 'Value 2',
      },
    ], ['1', '2']);

    expect(result).toBe('Value 1, Value 2');
  });

  it('should return empty string if categoryIds is not provided', () => {
    const result = transformCategoryIdsToLabels([{ id: 'category-id-1', value: 'Category 1' }], []);

    expect(result).toBe('');
  });

  it('should return empty string if categoryIds is empty', () => {
    const result = transformCategoryIdsToLabels([{ id: 'category-id-1', value: 'Category 1' }], []);

    expect(result).toBe('');
  });

  it('should return empty string if categoryIds is not provided', () => {
    const result = transformCategoryIdsToLabels([{ id: 'category-id-1', value: 'Category 1' }], ['category-id-1']);

    expect(result).toBe('Category 1');
  });
});

describe('getResultsFormatter', () => {
  it('should return formatted categories', () => {
    const categoriesDict = [{
      id: '1',
      value: 'Category 1',
    }, {
      id: '2',
      value: 'Category 2',
    }];
    const result = getResultsFormatter({
      intl: { formatMessage: jest.fn() },
      fields: {},
      categoriesDict,
    }).categories({ categories: ['1', '2'] });

    expect(result).toBe('Category 1, Category 2');
  });

  it('should return formatted email', () => {
    const result = getResultsFormatter({
      intl: { formatMessage: jest.fn() },
      fields: {},
    }).email({ emails: [{ value: '' }, { value: '' }] });

    expect(result).toBe(', ');
  });
});

describe('getContactsUrl', () => {
  it('should return undefined if contactId is not provided', () => {
    const result = getContactsUrl('orgId', undefined);

    expect(result).toBeUndefined();
  });

  it('should return url with contactId', () => {
    const result = getContactsUrl('orgId', 'contactId');

    expect(result).toBe('/organizations/orgId/privileged-contacts/contactId/view');
  });

  it('should return url without contactId', () => {
    const result = getContactsUrl('orgId', undefined);

    expect(result).toBeUndefined();
  });
});
