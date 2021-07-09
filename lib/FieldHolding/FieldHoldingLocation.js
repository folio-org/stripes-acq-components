import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  IconButton,
  TextField,
} from '@folio/stripes/components';

const FieldHoldingLocation = ({
  isNonInteractive,
  location,
  label,
  required,
  onClearLocation,
}) => {
  const clearButton = (
    <IconButton
      onClick={onClearLocation}
      icon="times-circle-solid"
      size="small"
    />
  );

  return isNonInteractive
    ? (
      <KeyValue
        label={label}
        value={`${location.name}(${location.code})`}
      />
    )
    : (
      <TextField
        data-testid="holding-location"
        label={label}
        required={required}
        disabled
        value={`${location.name}(${location.code})`}
        hasClearIcon={false}
        endControl={clearButton}
      />
    );
};

FieldHoldingLocation.propTypes = {
  isNonInteractive: PropTypes.bool,
  label: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  required: PropTypes.bool,
  onClearLocation: PropTypes.func.isRequired,
};

FieldHoldingLocation.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldHoldingLocation;
