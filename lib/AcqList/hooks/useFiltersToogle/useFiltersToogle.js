import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { useCallback } from 'react';

import { useToggle } from '../../../hooks';

export const useFiltersToogle = (key) => {
  const [storedFilterPaneVisibility] = useLocalStorage(key, true);

  const [isFiltersOpened, toggle] = useToggle(storedFilterPaneVisibility);

  const toggleFilters = useCallback(() => {
    writeStorage(key, !isFiltersOpened);
    toggle();
  }, [isFiltersOpened, key, toggle]);

  return { isFiltersOpened, toggleFilters };
};
