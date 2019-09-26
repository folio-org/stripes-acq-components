import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Selection } from '@folio/stripes/components';

import {
  filterSelectValues,
  validateRequired,
} from '../utils';
import { selectOptionsShape } from '../shapes';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

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
      tether={TETHER_CONFIG}
      component={Selection}
      onFilter={filterSelectValues}
      {...validateAttr}
      {...rest}
    />
  );
};

TranslatedLabelFieldSelection.propTypes = {
  dataOptions: selectOptionsShape.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

const FieldSelection = ({ labelId, ...rest }) => {
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

FieldSelection.propTypes = {
  labelId: PropTypes.string,
};

export default FieldSelection;
