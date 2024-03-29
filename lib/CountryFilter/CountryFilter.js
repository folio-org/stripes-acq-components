import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { countries } from '@folio/stripes/components';

import { SelectionFilter } from '../SelectionFilter';

const CountryFilter = (props) => {
  const intl = useIntl();
  const countriesOptions = useMemo(() => (
    countries
      .map(c => ({
        label: intl.formatDisplayName(c.alpha2, { type: 'region' }),
        value: c.alpha3,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ), [intl]);

  return (
    <SelectionFilter
      {...props}
      options={countriesOptions}
    />
  );
};

CountryFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CountryFilter;
