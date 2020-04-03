import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { SEARCH_PARAMETER } from '../constants';

export function ResultStatusMessage({
  filters,
  isFiltersOpened,
  isLoading,
  toggleFilters,
}) {
  const hasFilters = filters && Object.values(filters).some(Boolean);
  const source = useMemo(
    () => ({
      loaded: () => hasFilters && !isLoading,
      pending: () => isLoading,
      failure: () => {},
    }),
    [isLoading, hasFilters],
  );

  return (
    <SearchAndSortNoResultsMessage
      filterPaneIsVisible={isFiltersOpened}
      searchTerm={filters[SEARCH_PARAMETER] || ''}
      source={source}
      toggleFilterPane={toggleFilters}
    />
  );
}

ResultStatusMessage.propTypes = {
  filters: PropTypes.object.isRequired,
  isFiltersOpened: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
};
