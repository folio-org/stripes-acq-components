import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { noop } from 'lodash';
import { MemoryRouter, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import { useLocalStorageFilters } from './useLocalStorageFilters';

const persistKey = 'testListFilters';

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
  ] = useLocalStorageFilters(persistKey, location, history, noop);

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

describe('useLocalStorageFilters', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
      },
      writable: true,
    });
  });
  afterEach(cleanup);

  it('should call localStorage getItem on render', () => {
    renderTestList();

    expect(window.localStorage.getItem).toHaveBeenCalled();
  });

  it('should call localStorage on Search and Reset buttons', () => {
    const { getByTestId, getByText } = renderTestList();

    const input = getByTestId('search-query-input');
    const searchBtn = getByText('Search');
    const resetBtn = getByText('Reset');

    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.click(searchBtn);

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      persistKey,
      '{"query":"test search"}',
    );

    fireEvent.click(resetBtn);
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(persistKey);
  });

  it('should call localStorage on selecting filter', () => {
    const { getByTestId } = renderTestList();
    const filter = getByTestId('filter1');

    fireEvent.click(filter);

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      persistKey,
      '{"Filter 1":["true"]}',
    );
  });

  it('should set searchQuery from location.search', () => {
    const { getByTestId } = renderTestList('/some-route?query=testquery');

    expect(getByTestId('search-query').textContent).toBe('testquery');
  });
});
