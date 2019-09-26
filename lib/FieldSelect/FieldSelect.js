import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { Select } from '@folio/stripes/components';

import { fieldSelectOptionsShape } from '../shapes';
import { validateRequired } from '../utils';

const EMPTY_OPTION = { labelId: 'stripes-acq-components.label.emptyValue', value: '' }; // `''` works well with redux-form to absent attr from formValues

const FieldSelect = ({ dataOptions, required, intl, validate, ...rest }) => {
  const options = [EMPTY_OPTION, ...dataOptions].map(({ label, labelId, ...restOption }) => ({
    ...restOption,
    label: labelId ? intl.formatMessage({ id: labelId }) : label,
  }));
  const validateAttrValue = validate || (required && validateRequired);
  const validateAttr = validateAttrValue
    ? { validate: validateAttrValue }
    : {};

  return (
    <Field
      component={Select}
      dataOptions={options}
      fullWidth
      required={required}
      {...validateAttr}
      {...rest}
    />
  );
};

FieldSelect.propTypes = {
  dataOptions: fieldSelectOptionsShape.isRequired,
  intl: intlShape.isRequired,
  required: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

FieldSelect.defaultTypes = {
  dataOptions: [],
  required: false,
};

export default injectIntl(FieldSelect);
