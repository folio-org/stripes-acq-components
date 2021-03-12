import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { useIntl } from 'react-intl';

import { Select } from '../Fields';

import { fieldSelectOptionsShape } from '../shapes';
import { validateRequired } from '../utils';

const EMPTY_OPTION = { labelId: 'stripes-acq-components.label.emptyValue', value: '' }; // `''` works well with redux-form to absent attr from formValues

const FieldSelect = ({ dataOptions, fieldComponent, required, validate, ...rest }) => {
  const intl = useIntl();
  const FieldComponent = fieldComponent || Field;
  const options = [EMPTY_OPTION, ...dataOptions].map(({ label, labelId, ...restOption }) => ({
    ...restOption,
    label: labelId ? intl.formatMessage({ id: labelId }) : label,
  }));
  const validateAttrValue = validate || (required && validateRequired);
  const validateAttr = validateAttrValue
    ? { validate: validateAttrValue }
    : {};

  return (
    <FieldComponent
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
  dataOptions: fieldSelectOptionsShape,
  fieldComponent: PropTypes.elementType,
  required: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

FieldSelect.defaultProps = {
  dataOptions: [],
  required: false,
};

export default FieldSelect;
