import React from 'react';
import {
  fireEvent,
  render,
  cleanup,
  waitFor,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  deleteFromStorage,
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';

import useLocationFilters from './useLocationFilters';

const mockResetData = jest.fn();

const TestList = withRouter(({ location, history }) => {
  const [
    // eslint-disable-next-line no-unused-vars
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    // eslint-disable-next-line no-unused-vars
    changeIndex,
    searchIndex,
    clearLocationFilters,
  ] = useLocationFilters(location, history, mockResetData);

  return (
    <>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="search-index">{searchIndex}</div>
      <input
        data-testid="search-query-input"
        type="text"
        value={searchQuery}
        onChange={changeSearch}
      />
      <input
        data-testid="filter1"
        name="Filter 1"
        onChange={() => applyFilters('Filter 1', ['true'])}
        type="checkbox"
      />
      <button
        type="button"
        onClick={applySearch}
      >
        Search
      </button>
      <button
        type="button"
        onClick={resetFilters}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={clearLocationFilters}
      >
        Clear filters
      </button>
    </>
  );
});

const renderTestList = (initialRoute = '/some-route') => render(
  <MemoryRouter initialEntries={[initialRoute]}>
    <Route
      component={TestList}
    />
  </MemoryRouter>,
);

describe('useLocationFilters', () => {
  beforeEach(() => {
    useLocalStorage.mockClear().mockReturnValue([]);
    writeStorage.mockClear();
    deleteFromStorage.mockClear();
    mockResetData.mockClear();
  });

  afterEach(cleanup);

  it('should set searchQuery from location.search', () => {
    const { getByTestId } = renderTestList('/some-route?query=testquery');

    expect(getByTestId('search-query').textContent).toBe('testquery');
  });

  describe('when calling clearLocationFilters', () => {
    it('should clear filters and keep qindex and query', async () => {
      const {
        getByTestId,
        getByText,
      } = renderTestList('/some-route?query=testquery&qindex=testindex&Filter%201=true');

      fireEvent.click(getByText('Clear filters'));

      expect(getByTestId('search-query').textContent).toBe('testquery');
      expect(getByTestId('search-index').textContent).toBe('testindex');
      expect(getByTestId('filter1')).not.toBeChecked();
      await waitFor(() => expect(mockResetData).toHaveBeenCalled());
    });
  });

  describe('when calling resetLocationFilters', () => {
    it('should clear filters, qindex and query', () => {
      const {
        getByTestId,
        getByText,
      } = renderTestList('/some-route?query=testquery&qindex=testindex&Filter%201=true');

      fireEvent.click(getByText('Reset'));

      expect(getByTestId('search-query').textContent).toBe('');
      expect(getByTestId('search-index').textContent).toBe('');
      expect(getByTestId('filter1')).not.toBeChecked();
    });
  });
});
