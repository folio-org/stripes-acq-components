import {
  MemoryRouter,
  Route,
  withRouter,
} from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
    applyLocationFiltersAsync,
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
      <input
        data-testid="filter2"
        name="Filter 2"
        onChange={() => applyLocationFiltersAsync('Filter 2', ['true'])}
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
    useLocalStorage.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

      await userEvent.click(getByText('Clear filters'));

      expect(getByTestId('search-query').textContent).toBe('testquery');
      expect(getByTestId('search-index').textContent).toBe('testindex');
      expect(getByTestId('filter1')).not.toBeChecked();
    });

    describe('and instantly setting a filter', () => {
      it('should set the filter value', async () => {
        const {
          getByTestId,
          getByText,
        } = renderTestList('/some-route?query=testquery&qindex=testindex&Filter%201=true');

        await userEvent.click(getByText('Clear filters'));
        await userEvent.click(getByTestId('filter2'));

        expect(getByTestId('filter2')).toBeChecked();
      });
    });
  });

  describe('when calling resetLocationFilters', () => {
    it('should clear filters, qindex and query', async () => {
      const {
        getByTestId,
        getByText,
      } = renderTestList('/some-route?query=testquery&qindex=testindex&Filter%201=true');

      await userEvent.click(getByText('Reset'));

      expect(getByTestId('search-query').textContent).toBe('');
      expect(getByTestId('search-index').textContent).toBe('');
      expect(getByTestId('filter1')).not.toBeChecked();
    });
  });
});
