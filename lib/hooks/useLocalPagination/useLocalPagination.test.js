import { renderHook } from '@testing-library/react-hooks';
import { useLocalPagination } from './useLocalPagination';

const data = [
  { id: '1', name: 'name1' },
  { id: '2', name: 'name2' },
  { id: '3', name: 'name3' },
  { id: '4', name: 'name4' },
];

const mockResult = {
  pagination: { limit: 50, offset: 0 },
  paginatedData: data,
};

describe('useOrders', () => {
  it('should return 1 data with the limit 1', async () => {
    const { result } = renderHook(() => useLocalPagination(data));

    expect(result.current).toEqual(
      expect.objectContaining(mockResult),
    );
  });
});
