import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { COUNTRIES } from '../constants';
import { SelectionFilter } from '../SelectionFilter';

const CountryFilter = (props) => {
  const intl = useIntl();
  const countriesOptions = useMemo(() => COUNTRIES.map(c => ({
    label: intl.formatMessage({ id: `stripes-acq-components.data.countries.${c.alpha3}` }),
    value: c.alpha3,
  })), [intl]);

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
