import {
  useState,
  useCallback,
} from 'react';

import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '../constants';

const INITIAL_FILTERS = {};
const OPTIONS = {};

const useFilters = (resetData, initialFilters = INITIAL_FILTERS, options = OPTIONS) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState('');

  const {
    skipTrimOnChange = false,
  } = options;

  const applyFilters = useCallback(
    (type, value) => {
      const newFilters = { ...filters };

      if (Array.isArray(value) && value.length === 0) {
        newFilters[type] = undefined;
      } else {
        newFilters[type] = value;
      }

      setFilters(newFilters);

      resetData();

      return newFilters;
    },
    [filters, resetData],
  );

  const applyFiltersAsync = useCallback(
    (type, value) => {
      return new Promise(resolve => {
        setFilters((currentFilters) => {
          const newFilters = { ...currentFilters };

          if (Array.isArray(value) && value.length === 0) {
            newFilters[type] = undefined;
          } else {
            newFilters[type] = value;
          }

          resetData();

          resolve(newFilters);

          return newFilters;
        });
      });
    },
    [resetData],
  );

  const applySearch = useCallback(
    () => applyFilters(SEARCH_PARAMETER, searchQuery),
    [applyFilters, searchQuery],
  );

  const changeSearch = useCallback(
    e => {
      if (skipTrimOnChange) {
        setSearchQuery(e.target.value);
      } else {
        setSearchQuery(e.target.value?.trim());
      }
    },
    [skipTrimOnChange],
  );

  const resetFilters = useCallback(
    () => {
      setFilters(initialFilters);
      setSearchQuery('');
      setSearchIndex('');
      resetData();
    },
    [resetData, initialFilters],
  );

  const changeSearchIndex = useCallback(
    (e) => {
      const newSearchIndex = e.target.value;

      if (searchIndex !== newSearchIndex) {
        setSearchIndex(newSearchIndex);
        applyFilters(SEARCH_INDEX_PARAMETER, newSearchIndex);
      }
    },
    [applyFilters, searchIndex, setSearchIndex],
  );

  return {
    filters,
    searchQuery,
    applyFilters,
    applyFiltersAsync,
    applySearch,
    changeSearch,
    resetFilters,
    setFilters,
    setSearchQuery,
    setSearchIndex,
    searchIndex,
    changeSearchIndex,
  };
};

export default useFilters;
