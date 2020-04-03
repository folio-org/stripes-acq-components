import React, { useMemo } from 'react';

import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { SEARCH_PARAMETER } from '../constants';

export function useResultStatusMessage(
  filters,
  isFiltersOpened,
  isLoading,
  toggleFilters,
) {
  const hasFilters = filters && Object.values(filters).some(Boolean);
  const source = useMemo(
    () => ({
      loaded: () => hasFilters && !isLoading,
      pending: () => isLoading,
      failure: () => {},
    }),
    [isLoading, hasFilters],
  );

  const resultsStatusMessage = (
    <SearchAndSortNoResultsMessage
      filterPaneIsVisible={isFiltersOpened}
      searchTerm={filters[SEARCH_PARAMETER] || ''}
      source={source}
      toggleFilterPane={toggleFilters}
    />
  );

  return resultsStatusMessage;
}
