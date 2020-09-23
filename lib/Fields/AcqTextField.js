import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  TextField,
} from '@folio/stripes/components';

import { TooltippedControl } from '../TooltippedControl';

function AcqTextField({ isNonInteractive, ...rest }) {
  if (isNonInteractive) {
    return (
      <KeyValue
        label={rest.label}
        value={rest.input.value}
      />
    );
  }

  return (
    <TooltippedControl
      controlComponent={TextField}
      {...rest}
    />
  );
}

AcqTextField.propTypes = {
  isNonInteractive: PropTypes.bool,
};

export default AcqTextField;
