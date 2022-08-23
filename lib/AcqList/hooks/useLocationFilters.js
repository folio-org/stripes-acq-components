import {
  useEffect,
  useCallback,
} from 'react';

import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '../constants';
import {
  buildFiltersObj,
  buildSearch,
} from '../utils';
import useFilters from './useFilters';

const useLocationFilters = (location, history, resetData) => {
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
      const initialFilters = buildFiltersObj(location.search);

      setFilters(initialFilters);
      setSearchQuery(initialFilters[SEARCH_PARAMETER] || '');
      setSearchIndex(initialFilters[SEARCH_INDEX_PARAMETER] || '');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const applyLocationFilters = useCallback(
    (type, value) => {
      const newFilters = applyFilters(type, value);

      history.push({
        pathname: '',
        search: `${buildSearch(newFilters, location.search)}`,
      });

      return newFilters;
    },
    [applyFilters, history, location.search],
  );

  const applyLocationsSearch = useCallback(
    () => applyLocationFilters(SEARCH_PARAMETER, searchQuery),
    [applyLocationFilters, searchQuery],
  );

  const changeLocationSearch = useCallback(
    (e) => {
      changeSearch(e);
      if (!e.target.value) {
        applyLocationFilters([SEARCH_PARAMETER], '');
      }
    },
    [applyLocationFilters, changeSearch],
  );

  const resetLocationFilters = useCallback(
    () => {
      resetFilters();

      history.push({
        pathname: '',
        search: '',
      });
    },
    [history, resetFilters],
  );

  const changeLocationSearchIndex = useCallback(
    (e) => {
      changeSearchIndex(e);
    },
    [changeSearchIndex],
  );

  return [
    filters,
    searchQuery,
    applyLocationFilters,
    applyLocationsSearch,
    changeLocationSearch,
    resetLocationFilters,
    changeLocationSearchIndex,
    searchIndex,
  ];
};

export default useLocationFilters;
