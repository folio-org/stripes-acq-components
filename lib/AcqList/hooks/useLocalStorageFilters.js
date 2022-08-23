import { useCallback, useEffect } from 'react';
import { deleteFromStorage, useLocalStorage, writeStorage } from '@rehooks/local-storage';

import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '../constants';
import {
  buildFiltersObj,
  buildSearch,
} from '../utils';
import useFilters from './useFilters';

export function useLocalStorageFilters(persistKey, location, history, resetData) {
  const [storedFilters] = useLocalStorage(persistKey);

  const {
    filters,
    searchQuery,
    applyFilters,
    changeSearch,
    resetFilters,
    setFilters,
    setSearchQuery,
    setSearchIndex,
    searchIndex,
    changeSearchIndex,
  } = useFilters(resetData);

  useEffect(
    () => {
      const initialFilters = {
        ...(storedFilters || {}),
        ...buildFiltersObj(location.search),
      };

      if (storedFilters) {
        history.replace({
          pathname: '',
          search: `${buildSearch(initialFilters, location.search)}`,
        });
      }
      setFilters(initialFilters);
      setSearchQuery(initialFilters[SEARCH_PARAMETER] || '');
      setSearchIndex(initialFilters[SEARCH_INDEX_PARAMETER] || '');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const applyLocalStorageFilters = useCallback(
    (type, value) => {
      const newFilters = applyFilters(type, value);

      history.push({
        pathname: '',
        search: `${buildSearch(newFilters, location.search)}`,
      });
      writeStorage(persistKey, newFilters);

      return newFilters;
    },
    [applyFilters, history, location.search, persistKey],
  );

  const applyLocalStorageSearch = useCallback(
    () => applyLocalStorageFilters(SEARCH_PARAMETER, searchQuery),
    [applyLocalStorageFilters, searchQuery],
  );

  const changeLocalStorageSearch = useCallback(
    (e) => {
      changeSearch(e);
      if (!e.target.value) {
        applyLocalStorageFilters([SEARCH_PARAMETER], '');
      }
    },
    [applyLocalStorageFilters, changeSearch],
  );

  const resetLocalStorageFilters = useCallback(
    () => {
      resetFilters();

      history.push({
        pathname: '',
        search: '',
      });
      deleteFromStorage(persistKey);
    },
    [history, persistKey, resetFilters],
  );

  const changeLocalStorageSearchIndex = useCallback(
    (e) => {
      changeSearchIndex(e);
    },
    [changeSearchIndex],
  );

  return [
    filters,
    searchQuery,
    applyLocalStorageFilters,
    applyLocalStorageSearch,
    changeLocalStorageSearch,
    resetLocalStorageFilters,
    changeLocalStorageSearchIndex,
    searchIndex,
  ];
}
