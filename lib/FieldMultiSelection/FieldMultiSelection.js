import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import { MultiSelection } from '@folio/stripes/components';

const onBlurDefault = e => { e.preventDefault(); };

const FieldMultiSelection = ({ name, dataOptions, formatter, itemToString, label }) => {
  return (
    <Field
      component={MultiSelection}
      dataOptions={dataOptions}
      emptyMessage=""
      name={name}
      itemToString={itemToString}
      formatter={formatter}
      onBlur={onBlurDefault}
      label={label}
    />
  );
};

FieldMultiSelection.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.element.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.any),
  formatter: PropTypes.func,
  itemToString: PropTypes.func,
};

FieldMultiSelection.defaultProps = {
  dataOptions: [],
};

export default FieldMultiSelection;
