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
  notLoadedMessage,
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
      notLoadedMessage={notLoadedMessage}
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
  notLoadedMessage: PropTypes.node,
  toggleFilters: PropTypes.func.isRequired,
};
