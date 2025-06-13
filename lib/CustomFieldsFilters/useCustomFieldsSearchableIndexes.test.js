import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { CUSTOM_FIELDS } from '../../test/jest/fixtures/customFields';
import { useCustomFieldsSearchableIndexes } from './useCustomFieldsSearchableIndexes';

jest.mock('../hooks/useLocaleDateFormat', () => ({
  useLocaleDateFormat: jest.fn(() => 'DD.MM.YYYY'),
}));

describe('useCustomFieldsSearchableIndexes', () => {
  it('should return empty array by default', () => {
    const { result } = renderHook(() => useCustomFieldsSearchableIndexes());

    expect(result.current).toEqual([]);
  });

  it('should return an array of searchable indexes', () => {
    const expected = [
      {
        label: 'stripes-smart-components.customFields Datepicker',
        value: 'customFields.datepicker',
        placeholder: 'DD.MM.YYYY',
      },
      {
        label: 'stripes-smart-components.customFields Long text',
        value: 'customFields.longtext',
      },
      {
        label: 'stripes-smart-components.customFields Short text',
        value: 'customFields.shorttext',
      },
    ];

    const { result } = renderHook(() => useCustomFieldsSearchableIndexes(CUSTOM_FIELDS));

    expect(result.current).toEqual(expected);
  });
});
