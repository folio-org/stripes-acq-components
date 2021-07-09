import React from 'react';
import PropTypes from 'prop-types';

import {
  FieldLocationFinal,
} from '../FieldLocation';
import {
  FieldHolding,
} from '../FieldHolding';

export const FieldInventory = ({
  instanceId,
  locations,
  locationIds,
  locationLookupLabel,

  locationName,
  holdingName,

  onChange,
  required,
  disabled,
  validate,
}) => {
  return instanceId
    ? (
      <FieldHolding
        isDisabled={disabled}
        labelId="stripes-acq-components.holding.label"
        locationsForDict={locations}
        name={holdingName}
        locationFieldName={locationName}
        onChange={onChange}
        required={required}
        validate={validate}
        instanceId={instanceId}
        locationLabelId="stripes-acq-components.location.label"
      />
    )
    : (
      <FieldLocationFinal
        locationLookupLabel={locationLookupLabel}
        isDisabled={disabled}
        labelId="stripes-acq-components.location.label"
        locationsForDict={locations}
        name={locationName}
        onChange={onChange}
        prepopulatedLocationsIds={locationIds}
        required={required}
        validate={validate}
      />
    );
};

FieldInventory.propTypes = {
  instanceId: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationLookupLabel: PropTypes.node,

  locationName: PropTypes.string,
  holdingName: PropTypes.string,

  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validate: PropTypes.func,
};
