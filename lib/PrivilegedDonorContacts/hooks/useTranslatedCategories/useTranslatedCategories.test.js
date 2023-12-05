import { renderHook } from '@testing-library/react-hooks';

import { useTranslatedCategories } from './useTranslatedCategories';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn(cb => cb()),
}));
jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

describe('useTranslatedCategories', () => {
  // it('should return empty array if categories is not provided', () => {
  //   const result = useTranslatedCategories();

  //   expect(result).toEqual([undefined]);
  // });

  it('should return translated categories', () => {
    const categories = [{
      id: '1',
      value: 'Category 1',
    }, {
      id: '2',
      value: 'Category 2',
    }];
    const { result } = renderHook(() => useTranslatedCategories(categories));

    console.log(result.current);

    expect(result.current).toEqual([{
      id: '1',
      value: 'Category 1',
    }, {
      id: '2',
      value: 'Category 2',
    }]);
  });

  // it('should return translated categories', () => {
  //   const categories = [{
  //     id: '1',
  //     value: 'Category 1',
  //   }, {
  //     id: '2',
  //     value: 'Category 2',
  //   }];
  //   const result = useTranslatedCategories(categories);

  //   expect(result).toEqual([{
  //     id: '1',
  //     value: 'Category 1',
  //   }, {
  //     id: '2',
  //     value: 'Category 2',
  //   }]);
  // });

  // it('should return translated categories', () => {
  //   const categories = [{
  //     id: '1',
  //     value: 'Category 1',
  //   }, {
  //     id: '2',
  //     value: 'Category 2',
  //   }];
  //   const result = useTranslatedCategories(categories);

  //   expect(result).toEqual([{
  //     id: '1',
  //     value: 'Category 1',
  //   }, {
  //     id: '2',
  //     value: 'Category 2',
  //   }]);
  // });
});
