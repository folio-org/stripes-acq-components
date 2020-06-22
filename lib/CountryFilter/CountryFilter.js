import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
} from 'react-intl';

import { COUNTRIES } from '../constants';
import { SelectionFilter } from '../SelectionFilter';

const CountryFilter = ({ activeFilters, labelId, name, onChange, intl, id }) => {
  const countriesOptions = COUNTRIES.map(c => ({
    label: intl.formatMessage({ id: `stripes-acq-components.data.countries.${c.alpha3}` }),
    value: c.alpha3,
  }));

  return (
    <SelectionFilter
      activeFilters={activeFilters}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
      options={countriesOptions}
    />
  );
};

CountryFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

CountryFilter.defaultProps = {
  activeFilters: [],
};

export default injectIntl(CountryFilter);
