import noop from 'lodash/noop';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import useFilters from './useFilters';

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when changing a search term', () => {
    it('should trim the search term', async () => {
      const searchTerm = ' test foo ';
      const event = { target: { value: searchTerm } };

      const { result } = renderHook(() => useFilters(noop, undefined));

      await act(() => result.current.changeSearch(event));

      expect(result.current.searchQuery).toBe(searchTerm.trim());
    });

    it('should not trim the search term', async () => {
      const searchTerm = ' test foo ';
      const event = { target: { value: searchTerm } };
      const options = { skipTrimOnChange: true };

      const { result } = renderHook(() => useFilters(noop, undefined, options));

      await act(() => result.current.changeSearch(event));

      expect(result.current.searchQuery).toBe(searchTerm);
    });
  });
});
