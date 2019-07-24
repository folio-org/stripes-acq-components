import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Selection } from '@folio/stripes/components';

import { filterSelectValues } from '../utils';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

const EMPTY_OPTION = { label: '', value: '' }; // `''` works well with redux-form to absent attr from formValues

const FieldSelection = ({ dataOptions, ...rest }) => (
  <Field
    dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
    disabled={rest.readOnly}
    fullWidth
    tether={TETHER_CONFIG}
    component={Selection}
    onFilter={filterSelectValues}
    {...rest}
  />
);

FieldSelection.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FieldSelection;
