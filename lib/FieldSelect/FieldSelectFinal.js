import React from 'react';
import { Field, useFormState } from 'react-final-form';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useIntl } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import FieldSelect from './FieldSelect';

const FieldSelectFinal = ({ disabled, ...rest }) => {
  const formState = useFormState();
  const intl = useIntl();

  if (disabled) {
    const option = rest.dataOptions?.find(o => o.value === get(formState.values, rest.name));
    const value = option?.labelId
      ? intl.formatMessage({ id: option.labelId })
      : option?.label;

    return (
      <KeyValue
        label={rest.label}
        value={value || <NoValue />}
      />
    );
  }

  return (
    <FieldSelect
      fieldComponent={Field}
      {...rest}
    />
  );
};

FieldSelectFinal.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldSelectFinal;
