import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { act, renderHook } from '@testing-library/react-hooks';

import {
  useFiltersToogle,
} from './useFiltersToogle';

describe('useFiltersToogle', () => {
  it('should initialize state from local storage', () => {
    useLocalStorage.mockClear().mockReturnValue([true]);

    const { result } = renderHook(() => useFiltersToogle('stripes-acq'));

    const { isFiltersOpened } = result.current;

    expect(isFiltersOpened).toBeTruthy();
  });

  it('should change value to opposite when toggleFilters is called', () => {
    useLocalStorage.mockClear().mockReturnValue([false]);

    const { result } = renderHook(() => useFiltersToogle());

    const { toggleFilters } = result.current;

    act(() => {
      toggleFilters();
    });

    expect(result.current.isFiltersOpened).toBeTruthy();
  });

  it('should save value in local storage when toggleFilters is called', () => {
    useLocalStorage.mockClear().mockReturnValue([false]);
    writeStorage.mockClear();

    const { result } = renderHook(() => useFiltersToogle());

    const { toggleFilters } = result.current;

    toggleFilters();

    expect(writeStorage).toHaveBeenCalled();
  });
});
