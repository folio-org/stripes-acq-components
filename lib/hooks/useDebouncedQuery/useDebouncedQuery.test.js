import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, act } from '@testing-library/react-hooks';
import { useOkapiKy } from '@folio/stripes/core';

import { useDebouncedQuery } from './useDebouncedQuery';

const DELAY = 300;
const mockData = { poLines: [{ id: 'poLine-1', poLineNumber: '11111' }] };

jest.useFakeTimers('modern');
const mockDataFormatter = jest.fn(({ poLines }) => {
  return poLines.map(({ id, poLineNumber }) => ({ label: poLineNumber, value: id }));
});

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useDebouncedQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({
        json: () => Promise.resolve(mockData),
      })),
    });
  });

  it('should not call `dataFormatter` and return empty []', async () => {
    const { result } = renderHook(() => useDebouncedQuery({
      api: 'api',
      queryBuilder: jest.fn(),
      dataFormatter: mockDataFormatter,
      debounceDelay: DELAY,
    }), { wrapper });

    await act(async () => {
      await result.current.setSearchQuery('');
      jest.advanceTimersByTime(1500);
    });

    expect(mockDataFormatter).toHaveBeenCalledTimes(0);
    expect(result.current.options).toEqual([]);
  });

  it('should call `dataFormatter` and return options', async () => {
    const { result } = renderHook(() => useDebouncedQuery({
      api: 'api',
      queryBuilder: jest.fn(),
      dataFormatter: mockDataFormatter,
    }), { wrapper });

    await act(async () => {
      await result.current.setSearchQuery('test');
      jest.advanceTimersByTime(1500);
    });

    expect(mockDataFormatter).toHaveBeenCalledTimes(1);
    expect(result.current.options).toEqual([{ label: '11111', value: 'poLine-1' }]);
  });

  it('should call default `dataFormatter` when `dataFormatter` is not present', async () => {
    const { result } = renderHook(() => useDebouncedQuery({
      api: 'api',
      queryBuilder: jest.fn(),
    }), { wrapper });

    await act(async () => {
      await result.current.setSearchQuery('test');
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.options).toEqual(mockData);
  });
});
