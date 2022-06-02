import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { buildFiltersObj } from '../AcqList/utils';
import { DynamicSelection } from '../DynamicSelection';
import { FilterAccordion } from '../FilterAccordion';

export const DynamicSelectionFilter = ({
  activeFilters,
  api,
  closedByDefault,
  dataFormatter,
  disabled,
  id,
  labelId,
  name,
  onChange,
  queryBuilder,
  valueKey = 'id',
  ...rest
}) => {
  const { search } = useLocation();
  const ky = useOkapiKy();
  const [isLoading, setIsLoading] = useState();
  const [initialOptions, setInitialOptions] = useState([]);

  const onSelectionChange = useCallback(
    val => onChange({ name, values: [val] }),
    [name, onChange],
  );

  useEffect(() => {
    const initialFilterValue = buildFiltersObj(search)[name]?.[0];

    if (initialFilterValue) {
      setIsLoading(true);

      const searchParams = {
        query: `${valueKey}==${initialFilterValue}`,
      };

      ky.get(api, { searchParams })
        .json()
        .then(dataFormatter)
        .then(setInitialOptions)
        .then(() => setIsLoading(false));
    }
  }, []);

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      {
        isLoading
          ? <Loading />
          : (
            <DynamicSelection
              aria-labelledby={`accordion-toggle-button-${id}`}
              api={api}
              dataFormatter={dataFormatter}
              id={`${name}-dynamic-selection`}
              name={name}
              initialOptions={initialOptions}
              onChange={onSelectionChange}
              queryBuilder={queryBuilder}
              value={activeFilters?.[0] || ''}
              {...rest}
            />
          )
      }
    </FilterAccordion>
  );
};

DynamicSelectionFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  api: PropTypes.string.isRequired,
  closedByDefault: PropTypes.bool,
  dataFormatter: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  queryBuilder: PropTypes.func.isRequired,
  valueKey: PropTypes.string,
};
