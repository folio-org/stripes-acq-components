import {
  useState,
  useCallback,
  useRef,
} from 'react';

import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '../constants';

const useFilters = (resetData, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState('');
  const filtersRef = useRef({});

  const applyFilters = useCallback(
    (type, value) => {
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [type]: (Array.isArray(value) && value.length === 0) ? undefined : value,
        };

        filtersRef.current = newFilters;

        return newFilters;
      });

      resetData();

      return filtersRef.current;
    },
    [resetData],
  );

  const applySearch = useCallback(
    () => applyFilters(SEARCH_PARAMETER, searchQuery),
    [applyFilters, searchQuery],
  );

  const changeSearch = useCallback(
    e => setSearchQuery(e.target.value?.trim()),
    [],
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
