import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { LANGUAGES } from '../constants';
import { SelectionFilter } from '../SelectionFilter';

const LanguageFilter = (props) => {
  const intl = useIntl();
  const languagesOptions = useMemo(() => LANGUAGES.map(l => ({
    label: intl.formatMessage({ id: `stripes-acq-components.data.languages.${l.code}` }),
    value: l.code,
  })), [intl]);

  return (
    <SelectionFilter
      {...props}
      options={languagesOptions}
    />
  );
};

LanguageFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LanguageFilter;
