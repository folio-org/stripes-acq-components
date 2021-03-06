import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Datepicker } from '../Fields';
import {
  DATE_FORMAT,
  TIMEZONE,
} from '../constants';

const onBlurDefault = e => { e.preventDefault(); };

const FieldDatepicker = ({ fieldComponent, labelId, ...rest }) => {
  const FieldComponent = fieldComponent || Field;

  return (
    <FieldComponent
      backendDateStandard={DATE_FORMAT}
      component={Datepicker}
      fullWidth
      label={labelId && <FormattedMessage id={labelId} />}
      timeZone={TIMEZONE}
      onBlur={fieldComponent ? undefined : onBlurDefault}
      {...rest}
    />
  );
};

FieldDatepicker.propTypes = {
  fieldComponent: PropTypes.elementType,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FieldDatepicker;
