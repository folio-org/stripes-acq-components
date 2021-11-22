import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

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
  locationFieldName,
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
      <Field
        component={TextField}
        data-testid="holding-location"
        name={locationFieldName}
        label={label}
        required={required}
        disabled
        format={() => `${location.name}(${location.code})`}
        hasClearIcon={false}
        endControl={clearButton}
      />
    );
};

FieldHoldingLocation.propTypes = {
  isNonInteractive: PropTypes.bool,
  label: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  locationFieldName: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onClearLocation: PropTypes.func.isRequired,
};

FieldHoldingLocation.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldHoldingLocation;
