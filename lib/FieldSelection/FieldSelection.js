import React from 'react';
import { Field } from 'redux-form';

import { Selection } from '@folio/stripes/components';

import { filterSelectValues } from '../utils';
import { selectOptionsShape } from '../shapes';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

const EMPTY_OPTION = { label: '', value: null };

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
  dataOptions: selectOptionsShape.isRequired,
};

export default FieldSelection;
