import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { SEARCH_PARAMETER } from '../constants';
import { getFiltersCount } from '../utils';

export const NoResultsMessage = ({
  filters,
  isFiltersOpened,
  isLoading,
  toggleFilters,
}) => {
  const hasFilters = useMemo(() => getFiltersCount(filters) > 0, [filters]);
  const source = useMemo(
    () => ({
      loaded: () => hasFilters && !isLoading,
      pending: () => isLoading,
      failure: noop,
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
