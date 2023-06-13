import { renderHook } from '@testing-library/react-hooks';
import { useLocalPagination } from './useLocalPagination';

const MAX_LIMIT = 50;
const data = [
  { id: '1', name: 'name1' },
  { id: '2', name: 'name2' },
  { id: '3', name: 'name3' },
  { id: '4', name: 'name4' },
];

const mockResult = {
  pagination: { limit: MAX_LIMIT, offset: 0 },
  paginatedData: data,
};

describe('useOrders', () => {
  it('should return 1 data with the limit 1', async () => {
    const { result } = renderHook(() => useLocalPagination(data, MAX_LIMIT));

    expect(result.current).toEqual(
      expect.objectContaining(mockResult),
    );
  });

  it('should return no data with empty []', async () => {
    const { result } = renderHook(() => useLocalPagination([], MAX_LIMIT));

    expect(result.current.paginatedData).toEqual([]);
  });

  it('should return no data with empty [] and default max limit value', async () => {
    const { result } = renderHook(() => useLocalPagination([]));

    expect(result.current.paginatedData).toEqual([]);
    expect(result.current.pagination).toEqual({ limit: MAX_LIMIT, offset: 0 });
  });
});
