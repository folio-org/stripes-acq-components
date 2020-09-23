import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  KeyValue,
  Select,
} from '@folio/stripes/components';

import { TooltippedControl } from '../TooltippedControl';

function AcqSelect({ isNonInteractive, ...rest }) {
  const intl = useIntl();

  if (isNonInteractive) {
    const option = rest.dataOptions?.find(o => o.value === rest.input.value);
    const value = option?.labelId
      ? intl.formatMessage({ id: option.labelId })
      : option?.label;

    return (
      <KeyValue
        label={rest.label}
        value={value}
      />
    );
  }

  return (
    <TooltippedControl
      controlComponent={Select}
      {...rest}
    />
  );
}

AcqSelect.propTypes = {
  isNonInteractive: PropTypes.bool,
};

export default AcqSelect;
