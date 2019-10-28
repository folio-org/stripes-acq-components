import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Selection } from '@folio/stripes/components';

import {
  filterSelectValues,
  validateRequired,
} from '../utils';

const EMPTY_OPTION = { label: '', value: null };

const TranslatedLabelFieldSelection = ({ dataOptions, validate, ...rest }) => {
  const validateAttrValue = validate || (rest.required && validateRequired);
  const validateAttr = validateAttrValue
    ? { validate: validateAttrValue }
    : {};

  return (
    <Field
      dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
      disabled={rest.readOnly}
      fullWidth
      component={Selection}
      onFilter={filterSelectValues}
      {...validateAttr}
      {...rest}
    />
  );
};

TranslatedLabelFieldSelection.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.string,
  })).isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

const FieldSelectionFinal = ({ labelId, ...rest }) => {
  return labelId
    ? (
      <FormattedMessage id={labelId}>
        {translatedLabel => (
          <TranslatedLabelFieldSelection
            label={translatedLabel}
            {...rest}
          />
        )}
      </FormattedMessage>
    )
    : <TranslatedLabelFieldSelection {...rest} />;
};

FieldSelectionFinal.propTypes = {
  labelId: PropTypes.string,
};

export default FieldSelectionFinal;
