import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { languageOptions } from '@folio/stripes/components';

import { SelectionFilter } from '../SelectionFilter';

const LanguageFilter = (props) => {
  const intl = useIntl();
  const langOptions = useMemo(() => languageOptions(intl), [intl]);

  return (
    <SelectionFilter
      {...props}
      options={langOptions}
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
