import {
  useEffect,
  useCallback,
} from 'react';
import pick from 'lodash/pick';

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

  const clearLocationFilters = useCallback(
    () => {
      /*
        there's a lot of state setters called synchronously both in this hook and it's consumers
        so we need to be careful about not using old state data
      */
      setFilters((currentFilters) => {
        const newFilters = pick(currentFilters, ['qindex', 'query']);

        return newFilters;
      });
      resetData();
    },
    [setFilters, resetData],
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
    clearLocationFilters,
  ];
};

export default useLocationFilters;
