import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Loading,
} from '@folio/stripes/components';

import { Selection } from '../Fields';
import {
  filterSelectValues,
  validateRequired,
} from '../utils';

const EMPTY_OPTION = { label: '', value: null };

const FieldSelectionFinal = ({ dataOptions, validate, labelId, label, ...rest }) => {
  const intl = useIntl();
  const validateAttrValue = validate || (rest.required && validateRequired);
  const validateAttr = validateAttrValue
    ? { validate: validateAttrValue }
    : {};

  const parse = useCallback((value) => (value ?? undefined), []);

  if (!dataOptions) return <Loading />;
  const renderedLabel = labelId ? intl.formatMessage({ id: labelId }) : label;

  return (
    <Field
      dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
      disabled={rest.readOnly}
      fullWidth
      component={Selection}
      onFilter={filterSelectValues}
      label={renderedLabel}
      parse={parse}
      {...validateAttr}
      {...rest}
    />
  );
};

FieldSelectionFinal.propTypes = {
  label: PropTypes.node,
  labelId: PropTypes.string,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.string,
  })),
  isNonInteractive: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

export default FieldSelectionFinal;
