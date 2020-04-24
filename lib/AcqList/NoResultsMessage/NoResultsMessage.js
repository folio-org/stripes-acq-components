import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';
import { SEARCH_PARAMETER } from '../constants';

export const NoResultsMessage = ({
  filters,
  isFiltersOpened,
  isLoading,
  toggleFilters,
}) => {
  const hasFilters = useMemo(() => filters && Object.values(filters).some(Boolean), [filters]);
  const source = useMemo(
    () => ({
      loaded: () => hasFilters && !isLoading,
      pending: () => isLoading,
      failure: () => { },
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
};

NoResultsMessage.propTypes = {
  filters: PropTypes.object,
  isFiltersOpened: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  toggleFilters: PropTypes.func.isRequired,
};
