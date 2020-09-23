import React from 'react';
import PropTypes from 'prop-types';

import {
  Datepicker,
  KeyValue,
} from '@folio/stripes/components';

import { FolioFormattedDate } from '../FolioFormattedDate';
import { TooltippedControl } from '../TooltippedControl';

function AcqDatepicker({ isNonInteractive, ...rest }) {
  if (isNonInteractive) {
    return (
      <KeyValue label={rest.label}>
        <FolioFormattedDate value={rest.input.value} />
      </KeyValue>
    );
  }

  return (
    <TooltippedControl
      controlComponent={Datepicker}
      {...rest}
    />
  );
}

AcqDatepicker.propTypes = {
  isNonInteractive: PropTypes.bool,
};

export default AcqDatepicker;
