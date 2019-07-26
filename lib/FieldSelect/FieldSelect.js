import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { selectOptionsShape } from '../shapes';

const EMPTY_OPTION = { label: 'stripes-acq-components.label.emptyValue', value: '' }; // `''` works well with redux-form to absent attr from formValues

const FieldSelect = ({ dataOptions, required, ...rest }) => {
  const options = [EMPTY_OPTION, ...dataOptions];

  return (
    <Field
      fullWidth
      component={Select}
      required={required}
      {...rest}
    >
      {options.map(({ label, value }) => (
        <FormattedMessage
          id={label}
          key={`key-${value}`}
        >
          {(translatedLabel) => <option value={value}>{translatedLabel}</option>}
        </FormattedMessage>
      ))}
    </Field>
  );
};

FieldSelect.propTypes = {
  dataOptions: selectOptionsShape.isRequired,
  required: PropTypes.bool,
};

FieldSelect.defaultTypes = {
  required: false,
};

export default FieldSelect;
