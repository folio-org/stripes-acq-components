import {
  useState,
  useCallback,
} from 'react';

import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '../constants';

const useFilters = (resetData) => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState('');

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

  const applySearch = useCallback(
    () => applyFilters(SEARCH_PARAMETER, searchQuery),
    [applyFilters, searchQuery],
  );

  const changeSearch = useCallback(
    e => setSearchQuery(e.target.value),
    [],
  );

  const resetFilters = useCallback(
    () => {
      setFilters({});
      setSearchQuery('');
      setSearchIndex('');
      resetData();
    },
    [resetData],
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
