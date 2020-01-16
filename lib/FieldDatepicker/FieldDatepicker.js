import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Datepicker } from '@folio/stripes/components';
import {
  DATE_FORMAT,
  TIMEZONE,
} from '../constants';

const FieldDatepicker = ({ fieldComponent, labelId, ...rest }) => {
  const FieldComponent = fieldComponent || Field;

  return (
    <FieldComponent
      backendDateStandard={DATE_FORMAT}
      component={Datepicker}
      dateFormat={DATE_FORMAT}
      fullWidth
      label={labelId && <FormattedMessage id={labelId} />}
      timeZone={TIMEZONE}
      {...rest}
    />
  );
};

FieldDatepicker.propTypes = {
  fieldComponent: PropTypes.func,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FieldDatepicker;
