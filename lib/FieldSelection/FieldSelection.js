import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Selection } from '@folio/stripes/components';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

const EMPTY_OPTION = { label: '', value: null };

const filterValues = (value, dataOptions) => {
  const regex = new RegExp(value, 'i');

  return dataOptions.filter(({ label }) => label.search(regex) !== -1);
};

const FieldSelection = ({ dataOptions, ...rest }) => (
  <Field
    dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
    disabled={rest.readOnly}
    fullWidth
    tether={TETHER_CONFIG}
    component={Selection}
    onFilter={filterValues}
    {...rest}
  />
);

FieldSelection.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};

export default FieldSelection;
