import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import { useFiltersToogle } from './useFiltersToogle';

describe('useFiltersToogle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize state from local storage', () => {
    useLocalStorage.mockReturnValue([true]);

    const { result } = renderHook(() => useFiltersToogle('stripes-acq'));

    const { isFiltersOpened } = result.current;

    expect(isFiltersOpened).toBeTruthy();
  });

  it('should change value to opposite when toggleFilters is called', () => {
    useLocalStorage.mockReturnValue([false]);

    const { result } = renderHook(() => useFiltersToogle());

    const { toggleFilters } = result.current;

    act(() => {
      toggleFilters();
    });

    expect(result.current.isFiltersOpened).toBeTruthy();
  });

  it('should save value in local storage when toggleFilters is called', () => {
    useLocalStorage.mockReturnValue([false]);

    const { result } = renderHook(() => useFiltersToogle());

    const { toggleFilters } = result.current;

    toggleFilters();

    expect(writeStorage).toHaveBeenCalled();
  });
});
