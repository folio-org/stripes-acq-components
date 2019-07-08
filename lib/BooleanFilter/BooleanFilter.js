import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AcqCheckboxFilter } from '../AcqCheckboxFilter';

const BOOLEAN_OPTIONS = [
  {
    value: 'true',
    label: <FormattedMessage id="stripes-acq-components.filter.true" />,
  },
  {
    value: 'false',
    label: <FormattedMessage id="stripes-acq-components.filter.false" />,
  },
];

const BooleanFilter = (props) => (
  <AcqCheckboxFilter
    options={BOOLEAN_OPTIONS}
    {...props}
  />
);

export default BooleanFilter;
