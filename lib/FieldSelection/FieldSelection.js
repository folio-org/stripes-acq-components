import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Selection } from '@folio/stripes/components';

import { filterSelectValues } from '../utils';
import { selectOptionsShape } from '../shapes';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

const EMPTY_OPTION = { label: '', value: null };

const TranslatedLabelFieldSelection = ({ dataOptions, ...rest }) => (
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

TranslatedLabelFieldSelection.propTypes = {
  dataOptions: selectOptionsShape.isRequired,
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
  dataOptions: selectOptionsShape.isRequired,
  labelId: PropTypes.string,
};

export default FieldSelection;
