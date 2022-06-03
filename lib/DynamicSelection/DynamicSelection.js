import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import { Loading, Selection } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

const LIST_ITEMS_LIMIT = 100;
const DEBOUNCE_DELAY = 500;

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
  const ky = useOkapiKy();
  const [filterValue, setFilterValue] = useState('');
  const [options, setOptions] = useState(initialOptions || []);
  const [isLoading, setIsLoading] = useState();

  const fetchData = useCallback(debounce(async (inputValue) => {
    const searchParams = {
      query: queryBuilder(inputValue),
      limit: LIST_ITEMS_LIMIT,
    };

    try {
      const res = await ky.get(api, { searchParams }).json();

      setOptions(dataFormatter(res));
    } catch {
      setOptions([]);
    }

    setIsLoading(false);
  }, DEBOUNCE_DELAY), []);

  const onFilter = useCallback((inputValue) => {
    setIsLoading(true);
    setFilterValue(inputValue);
    fetchData(inputValue);

    return options;
  }, [options, fetchData]);

  useEffect(() => {
    return () => {
      fetchData.cancel();
    };
  }, []);

  return (
    <Selection
      dataOptions={options}
      emptyMessage={!filterValue && <FormattedMessage id="stripes-acq-components.filter.dynamic.emptyMessage" />}
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
