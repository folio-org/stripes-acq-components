import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { SearchField } from '@folio/stripes/components';

import { SEARCH_PARAMETER } from '../AcqList/constants';

export const FilterSearchInput = ({
  applyFilters,
  applySearch,
  changeSearch,
  disabled,
  isLoading,
  searchQuery,
  ...props
}) => {
  const intl = useIntl();

  const reset = useCallback(
    () => applyFilters(SEARCH_PARAMETER, []),
    [applyFilters],
  );

  const onChange = useCallback((e) => (
    e.target.value ? changeSearch(e) : reset()
  ), [changeSearch, reset]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      applySearch();
    },
    [applySearch],
  );

  return (
    <form
      onSubmit={onSubmit}
    >
      <SearchField
        data-testid="filter-search-input"
        disabled={disabled || isLoading}
        loading={isLoading}
        marginBottom0
        onChange={onChange}
        onClear={reset}
        placeholder={intl.formatMessage({ id: 'stripes-acq-components.filter.placeholder' })}
        value={searchQuery}
        {...props}
      />
    </form>
  );
};

FilterSearchInput.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  applySearch: PropTypes.func.isRequired,
  changeSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string.isRequired,
};
