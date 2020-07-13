import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Selection } from '@folio/stripes/components';

import {
  filterSelectValues,
  validateRequired,
} from '../utils';

const EMPTY_OPTION = { label: '', value: null };

const FieldSelectionFinal = ({ dataOptions, validate, labelId, ...rest }) => {
  const intl = useIntl();
  const validateAttrValue = validate || (rest.required && validateRequired);
  const validateAttr = validateAttrValue
    ? { validate: validateAttrValue }
    : {};

  const parse = useCallback((value) => (value ?? undefined), []);

  return (
    <Field
      dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
      disabled={rest.readOnly}
      fullWidth
      component={Selection}
      onFilter={filterSelectValues}
      label={labelId ? intl.formatMessage({ id: labelId }) : undefined}
      parse={parse}
      {...validateAttr}
      {...rest}
    />
  );
};

FieldSelectionFinal.propTypes = {
  labelId: PropTypes.string,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.string,
  })).isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

export default FieldSelectionFinal;
