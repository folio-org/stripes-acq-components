import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import { useToggle } from '../../../hooks';

export const useFiltersToogle = (key) => {
  const [storedFilterPaneVisibility] = useLocalStorage(key, true);

  const [isFiltersOpened, toggle] = useToggle(storedFilterPaneVisibility);

  const toggleFilters = () => {
    writeStorage(key, !isFiltersOpened);
    toggle();
  };

  return { isFiltersOpened, toggleFilters };
};
