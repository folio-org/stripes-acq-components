import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useTranslatedCategories } from './useTranslatedCategories';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn(cb => cb()),
}));
jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

const mockCategories = [{
  id: '1',
  value: 'Category 1',
}, {
  id: '2',
  value: 'Category 2',
}];

describe('useTranslatedCategories', () => {
  it('should return empty array if categories is not provided', () => {
    const { result } = renderHook(() => useTranslatedCategories());

    expect(result.current).toEqual([undefined]);
  });

  it('should return translated categories', () => {
    const { result } = renderHook(() => useTranslatedCategories(mockCategories));

    expect(result.current).toEqual([mockCategories]);
  });
});
