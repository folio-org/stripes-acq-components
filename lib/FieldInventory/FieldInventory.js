import identity from 'lodash/identity';
import PropTypes from 'prop-types';

import { FieldLocationFinal } from '../FieldLocation';
import { FieldHolding } from '../FieldHolding';

export const FieldInventory = ({
  affiliationName,
  disabled,
  filterHoldings = identity,
  filterLocations = identity,
  holdingLabelId = 'stripes-acq-components.holding.label',
  holdingName,
  instanceId,
  isLoading = false,
  isNonInteractive,
  labelless,
  locationIds,
  locationLabelId = 'stripes-acq-components.location.label',
  locationLookupLabel,
  locationName,
  locations,
  onChange,
  required,
  tenantId,
  validate,
}) => {
  return instanceId
    ? (
      <FieldHolding
        instanceId={instanceId}
        locationsForDict={locations}
        affiliationFieldName={affiliationName}
        locationFieldName={locationName}
        labelId={labelless ? undefined : holdingLabelId}
        locationLabelId={locationLabelId}
        name={holdingName}
        isDisabled={disabled}
        isLoading={isLoading}
        isNonInteractive={isNonInteractive}
        onChange={onChange}
        required={required}
        filterHoldings={filterHoldings}
        filterLocations={filterLocations}
        validate={validate}
        tenantId={tenantId}
      />
    )
    : (
      <FieldLocationFinal
        locationLookupLabel={locationLookupLabel}
        isDisabled={disabled}
        isNonInteractive={isNonInteractive}
        labelId={labelless ? undefined : locationLabelId}
        locationsForDict={locations}
        name={locationName}
        holdingFieldName={holdingName}
        onChange={onChange}
        prepopulatedLocationsIds={locationIds}
        required={required}
        filterLocations={filterLocations}
        validate={validate}
        tenantId={tenantId}
      />
    );
};

FieldInventory.propTypes = {
  affiliationName: PropTypes.string,
  disabled: PropTypes.bool,
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  holdingLabelId: PropTypes.string,
  holdingName: PropTypes.string,
  instanceId: PropTypes.string,
  isLoading: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  labelless: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationLabelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationName: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  tenantId: PropTypes.string,
  validate: PropTypes.func,
};
