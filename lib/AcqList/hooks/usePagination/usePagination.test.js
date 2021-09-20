import React from 'react';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  buildSearch,
  buildPaginationObj,
  buildPaginatelessSearch,
} from '../../utils';
import { usePagination } from './usePagination';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  buildSearch: jest.fn(),
  buildPaginationObj: jest.fn(),
  buildPaginatelessSearch: jest.fn(),
}));

const historyPushMock = jest.fn();
const initialPagination = {
  offset: 30,
  limit: 30,
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

describe('usePagination', () => {
  beforeEach(() => {
    historyPushMock.mockClear();
    useHistory.mockClear().mockReturnValue({ push: historyPushMock });

    buildSearch.mockClear().mockReturnValue('');
    buildPaginationObj.mockClear().mockReturnValue(initialPagination);
    buildPaginatelessSearch.mockClear().mockReturnValue('');
  });

  it('should initialize pagination based on location', () => {
    const { result } = renderHook(
      () => usePagination(),
      { wrapper },
    );
    const { pagination: { limit, offset } } = result.current;

    expect({ limit, offset }).toEqual(initialPagination);
  });

  it('should reset offset when search is changed', () => {
    const { result, rerender } = renderHook(
      () => usePagination(),
      { wrapper },
    );

    buildPaginatelessSearch.mockClear().mockReturnValue('title=Benjamin');
    rerender();

    expect(result.current.pagination.offset).toBe(0);
  });

  it('should call history push when page is changed', () => {
    const paginationSearch = 'limit=60&offset=30';
    const { result } = renderHook(
      () => usePagination(),
      { wrapper },
    );

    buildSearch.mockClear().mockReturnValue(paginationSearch);
    act(() => {
      result.current.changePage(initialPagination);
    });

    expect(historyPushMock).toHaveBeenCalledWith({ pathname: '', search: paginationSearch });
  });

  it('should call history push when page is refreshed', () => {
    const paginationSearch = 'limit=60&offset=0';
    const { result } = renderHook(
      () => usePagination(),
      { wrapper },
    );

    buildSearch.mockClear().mockReturnValue(paginationSearch);
    act(() => {
      result.current.refreshPage();
    });

    expect(historyPushMock).toHaveBeenCalledWith({ pathname: '', search: paginationSearch });
  });
});
