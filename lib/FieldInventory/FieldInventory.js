import identity from 'lodash/identity';
import PropTypes from 'prop-types';

import { FieldLocationFinal } from '../FieldLocation';
import { FieldHolding } from '../FieldHolding';

export const FieldInventory = ({
  affiliationName,
  filterHoldings,
  filterLocations,
  instanceId,
  isLoading = false,
  isNonInteractive,
  locations,
  locationIds,
  locationLabelId = 'stripes-acq-components.location.label',
  labelless,
  locationLookupLabel,
  locationName,
  holdingName,
  holdingLabelId = 'stripes-acq-components.holding.label',
  onChange,
  required,
  tenantId,
  disabled,
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
  isLoading: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  tenantId: PropTypes.string,
  disabled: PropTypes.bool,
  validate: PropTypes.func,
  holdingLabelId: PropTypes.string,
  locationLabelId: PropTypes.string,
};

FieldInventory.defaultProps = {
  filterHoldings: identity,
  filterLocations: identity,
};
