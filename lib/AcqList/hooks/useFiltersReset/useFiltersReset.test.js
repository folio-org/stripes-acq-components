import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router';

import { useFiltersReset } from './useFiltersReset';

const resetFiltersMock = jest.fn();

// eslint-disable-next-line react/prop-types
const getWrapper = ({ resetFilters = false } = {}) => ({ children }) => (
  <MemoryRouter
    initialEntries={[{
      state: { resetFilters },
    }]}
  >
    {children}
  </MemoryRouter>
);

describe('useFiltersReset', () => {
  beforeEach(() => {
    resetFiltersMock.mockClear();
  });

  it('should reset filters if location state contains \'resetFilters\' property equals \'true\'', () => {
    renderHook(
      () => useFiltersReset(resetFiltersMock),
      { wrapper: getWrapper({ resetFilters: true }) },
    );

    expect(resetFiltersMock).toHaveBeenCalled();
  });

  it('should not reset filters if location state does not contain \'resetFilters\' property equals \'true\'', () => {
    renderHook(
      () => useFiltersReset(resetFiltersMock),
      { wrapper: getWrapper() },
    );

    expect(resetFiltersMock).not.toHaveBeenCalled();
  });
});
