import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Loading,
  Selection,
} from '@folio/stripes/components';

import { useDebouncedQuery } from '../hooks';

export const DynamicSelection = ({
  api,
  dataFormatter,
  initialOptions = [],
  name,
  onChange,
  queryBuilder,
  value,
  ...rest
}) => {
  const {
    options = initialOptions,
    isLoading,
    searchQuery,
    setSearchQuery,
  } = useDebouncedQuery({
    api,
    dataFormatter,
    queryBuilder,
  });

  const onFilter = useCallback((filterValue) => {
    setSearchQuery(filterValue);

    return options;
  }, [options, setSearchQuery]);

  return (
    <Selection
      dataOptions={options}
      emptyMessage={!searchQuery && <FormattedMessage id="stripes-acq-components.filter.dynamic.emptyMessage" />}
      loading={isLoading}
      loadingMessage={<Loading />}
      name={name}
      onChange={onChange}
      onFilter={onFilter}
      value={value}
      {...rest}
    />
  );
};

DynamicSelection.propTypes = {
  api: PropTypes.string.isRequired,
  dataFormatter: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  initialOptions: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  queryBuilder: PropTypes.func.isRequired,
  value: PropTypes.string,
};
