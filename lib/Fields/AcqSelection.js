import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  Selection,
} from '@folio/stripes/components';

import { TooltippedControl } from '../TooltippedControl';

function AcqSelection({ isNonInteractive, ...rest }) {
  if (isNonInteractive) {
    const value = rest.dataOptions?.find(o => o.value === rest.input.value)?.label;

    return (
      <KeyValue
        label={rest.label}
        value={value}
      />
    );
  }

  return (
    <TooltippedControl
      controlComponent={Selection}
      {...rest}
    />
  );
}

AcqSelection.propTypes = {
  isNonInteractive: PropTypes.bool,
};

export default AcqSelection;
