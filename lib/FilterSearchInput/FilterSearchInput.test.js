import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { FilterSearchInput } from './FilterSearchInput';

const defaultProps = {
  applyFilters: jest.fn(),
  applySearch: jest.fn(),
  changeSearch: jest.fn(),
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

  it('should display search query inside the input', () => {
    const searchQuery = '1234';

    renderFilterSearchInput();

    const searchInput = screen.getByTestId('filter-search-input');

    user.type(searchInput, searchQuery);

    expect(searchInput).toHaveValue(searchQuery);
  });

  it('should call \'changeSearch\' when input value is changed', () => {
    renderFilterSearchInput();

    user.type(screen.getByTestId('filter-search-input'), 'qwerty');

    expect(defaultProps.changeSearch).toHaveBeenCalled();
  });

  it('should call \'applySearch\' when \'Enter\' key was pressed', () => {
    renderFilterSearchInput();

    user.type(screen.getByTestId('filter-search-input'), '{enter}');

    expect(defaultProps.applySearch).toHaveBeenCalled();
  });

  it('should call \'applyFilters\' when \'clear\' btn was clicked', () => {
    renderFilterSearchInput();

    user.type(screen.getByTestId('filter-search-input'), 'qwerty');
    user.click(screen.getByRole('button', { name: 'stripes-components.clearThisField' }));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
