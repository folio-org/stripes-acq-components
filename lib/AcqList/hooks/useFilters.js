import {
  useState,
  useCallback,
} from 'react';

import {
  SEARCH_PARAMETER,
} from '../constants';

const useFilters = (resetData) => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const applyFilters = useCallback(
    (type, value) => {
      const newFilters = {
        ...filters,
        [type]: value,
      };

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
      resetData();
    },
    [resetData],
  );

  return [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    setFilters,
    setSearchQuery,
  ];
};

export default useFilters;
