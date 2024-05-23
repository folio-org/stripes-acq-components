import identity from 'lodash/identity';
import PropTypes from 'prop-types';

import { FieldLocationFinal } from '../FieldLocation';
import { FieldHolding } from '../FieldHolding';

export const FieldInventory = ({
  affiliationName,
  filterHoldings,
  filterLocations,
  instanceId,
  isNonInteractive,
  locations,
  locationIds,
  labelless,
  locationLookupLabel,
  locationName,
  holdingName,
  onChange,
  required,
  tenantId,
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
        affiliationFieldName={affiliationName}
        locationFieldName={locationName}
        labelId={holdingLabelId}
        locationLabelId={locationLabelId}
        name={holdingName}
        isDisabled={disabled}
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
        labelId={locationLabelId}
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
  instanceId: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,

  labelless: PropTypes.bool,
  locationLookupLabel: PropTypes.node,

  affiliationName: PropTypes.string,
  locationName: PropTypes.string,
  holdingName: PropTypes.string,

  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  isNonInteractive: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  tenantId: PropTypes.string,
  disabled: PropTypes.bool,
  validate: PropTypes.func,
};

FieldInventory.defaultProps = {
  filterHoldings: identity,
  filterLocations: identity,
};
