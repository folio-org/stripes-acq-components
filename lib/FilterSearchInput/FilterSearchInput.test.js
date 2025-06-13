import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { FilterSearchInput } from './FilterSearchInput';

const defaultProps = {
  applyFilters: jest.fn(),
  applySearch: jest.fn(),
  changeSearch: jest.fn(),
  filters: {},
  isLoading: false,
  searchQuery: '',
};

const renderFilterSearchInput = (props = {}) => render(
  <FilterSearchInput
    {...defaultProps}
    {...props}
  />,
);

describe('FilterSearchInput', () => {
  beforeEach(() => {
    defaultProps.applyFilters.mockClear();
    defaultProps.applySearch.mockClear();
    defaultProps.changeSearch.mockClear();
  });

  it('should display search query inside the input', async () => {
    const searchQuery = '1234';

    renderFilterSearchInput();

    const searchInput = screen.getByTestId('filter-search-input');

    await userEvent.type(searchInput, searchQuery);

    expect(searchInput).toHaveValue(searchQuery);
  });

  it('should call \'changeSearch\' when input value is changed', async () => {
    renderFilterSearchInput();

    await userEvent.type(screen.getByTestId('filter-search-input'), 'qwerty');

    expect(defaultProps.changeSearch).toHaveBeenCalled();
  });

  it('should call \'applySearch\' when \'Enter\' key was pressed', async () => {
    renderFilterSearchInput();

    await userEvent.type(screen.getByTestId('filter-search-input'), '{enter}');

    expect(defaultProps.applySearch).toHaveBeenCalled();
  });

  it('should call \'applyFilters\' when \'clear\' btn was clicked', async () => {
    renderFilterSearchInput();

    await userEvent.type(screen.getByTestId('filter-search-input'), 'qwerty');
    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.clearThisField' }));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
