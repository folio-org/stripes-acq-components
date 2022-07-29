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
  labelless,
  locationLookupLabel,
  locationName,
  holdingName,
  onChange,
  required,
  disabled,
  validate,
}) => {
  const holdingLabelId = labelless ? undefined : 'stripes-acq-components.holding.label';
  const locationLabelId = labelless ? undefined : 'stripes-acq-components.location.label';

  return instanceId
    ? (
      <FieldHolding
        instanceId={instanceId}
        locationsForDict={locations}
        locationFieldName={locationName}
        labelId={holdingLabelId}
        locationLabelId={locationLabelId}
        name={holdingName}
        isDisabled={disabled}
        onChange={onChange}
        required={required}
        validate={validate}
      />
    )
    : (
      <FieldLocationFinal
        locationLookupLabel={locationLookupLabel}
        isDisabled={disabled}
        labelId={locationLabelId}
        locationsForDict={locations}
        name={locationName}
        holdingFieldName={holdingName}
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

  labelless: PropTypes.bool,
  locationLookupLabel: PropTypes.node,

  locationName: PropTypes.string,
  holdingName: PropTypes.string,

  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validate: PropTypes.func,
};
