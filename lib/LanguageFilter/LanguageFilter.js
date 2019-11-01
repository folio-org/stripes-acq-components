import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { LANGUAGES } from '../constants';
import { SelectionFilter } from '../SelectionFilter';

const LanguageFilter = ({ activeFilters, labelId, name, onChange, intl }) => {
  const languagesOptions = LANGUAGES.map(l => ({
    label: intl.formatMessage({ id: `stripes-acq-components.data.languages.${l.code}` }),
    value: l.code,
  }));

  return (
    <SelectionFilter
      activeFilters={activeFilters}
      labelId={labelId}
      name={name}
      onChange={onChange}
      options={languagesOptions}
    />
  );
};

LanguageFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

LanguageFilter.defaultProps = {
  activeFilters: [],
};

export default injectIntl(LanguageFilter);
