import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  TextArea,
} from '@folio/stripes/components';

import { TooltippedControl } from '../TooltippedControl';

function AcqTextArea({ isNonInteractive, ...rest }) {
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
      controlComponent={TextArea}
      {...rest}
    />
  );
}

AcqTextArea.propTypes = {
  isNonInteractive: PropTypes.bool,
};

export default AcqTextArea;
