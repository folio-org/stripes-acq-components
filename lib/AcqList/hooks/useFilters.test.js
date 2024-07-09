import { act } from 'react';
import { renderHook } from '@testing-library/react-hooks';

import useFilters from './useFilters';

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when changing a search term', () => {
    it('should not be trimmed to avoid a cursor shift', async () => {
      const searchTerm = ' test foo ';
      const event = { target: { value: searchTerm } };

      const { result } = renderHook(useFilters);

      await act(() => result.current.changeSearch(event));

      expect(result.current.searchQuery).toBe(searchTerm);
    });
  });
});
