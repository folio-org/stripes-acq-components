import get from 'lodash/get';
import identity from 'lodash/identity';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';

import { FieldSelectionFinal } from '../FieldSelection';
import { FindLocation } from '../FindLocation';
import {
  useEventEmitter,
  useInstanceHoldings,
} from '../hooks';
import { validateRequired } from '../utils';
import FieldHoldingLocation from './FieldHoldingLocation';
import { getHoldingOptions } from './utils';
import { EVENT_EMITTER_EVENTS } from '../constants';

export const FieldHolding = ({
  affiliationFieldName,
  filterHoldings = identity,
  filterLocations = identity,
  instanceId,
  labelId,
  locationFieldName,
  locationLabelId,
  locationsForDict,
  name,
  onChange,
  isDisabled = false,
  isLoading = false,
  isNonInteractive = false,
  required = false,
  tenantId,
}) => {
  const {
    isFetching: isHoldingsLoading,
    holdings,
  } = useInstanceHoldings(instanceId, { tenantId });

  const eventEmitter = useEventEmitter();

  const [selectedLocation, setSelectedLocation] = useState();
  const [isHoldingIdValid, setIsHoldingIdValid] = useState(true);
  const { initialValues, values } = useFormState();
  const initialTenantId = get(initialValues, affiliationFieldName);
  const initialHoldingId = get(initialValues, name);
  const selectedHoldingId = get(values, name);
  const locationLabel = locationLabelId ? <FormattedMessage id={locationLabelId} /> : '';
  const holdingLabel = labelId ? <FormattedMessage id={labelId} /> : '';
  const validate = required ? validateRequired : undefined;

  const locationsMap = useMemo(() => keyBy(locationsForDict, 'id'), [locationsForDict]);

  useEffect(() => {
    if (!initialHoldingId) {
      const locationId = get(values, locationFieldName);
      const location = locationsMap[locationId];

      setSelectedLocation(location);
    }
  }, [initialHoldingId, locationFieldName, locationsMap, values]);

  useEffect(() => {
    const isInitialAffiliation = tenantId === initialTenantId;

    setIsHoldingIdValid(
      !isInitialAffiliation
      || !initialHoldingId
      || holdings.some(({ id }) => id === initialHoldingId),
    );
  }, [holdings, initialHoldingId, initialTenantId, tenantId]);

  const holdingOptions = useMemo(() => {
    const holdingsToSelect = isHoldingIdValid ? holdings : [...holdings, { id: initialHoldingId }];

    return getHoldingOptions(
      filterHoldings(holdingsToSelect, [initialHoldingId, selectedHoldingId].filter(Boolean)),
      locationsMap,
    );
  }, [
    filterHoldings,
    holdings,
    isHoldingIdValid,
    initialHoldingId,
    locationsMap,
    selectedHoldingId,
  ]);

  const onChangeHolding = useCallback((holdingId) => {
    const locationId = holdings.find(({ id }) => id === holdingId)?.permanentLocationId;

    onChange(locationId, locationFieldName, name, holdingId);
  }, [holdings, locationFieldName, name, onChange]);

  const selectLocationFromPlugin = useCallback(([location]) => {
    setSelectedLocation(location);

    onChange(location, locationFieldName, name, null);
  }, [onChange, locationFieldName, name]);

  const clearSelectedLocation = useCallback(() => {
    setSelectedLocation();
    onChange(null, locationFieldName);
  }, [locationFieldName, onChange]);

  // Store tenantId in ref to compare it in event listener without adding tenantId to dependencies array
  // which will cause it to be recreated on every tenantId change.
  const tenantIdRef = useRef(tenantId);

  tenantIdRef.current = tenantId;

  // Listen to affiliation change event to reset location and holding fields
  // if the same affiliation is selected again or affiliation is changed and the selected location/holding belongs to the previous affiliation.
  useEffect(() => {
    const callback = ({ detail }) => {
      // Reset location if affiliation is changed and location/holding belongs to the previous affiliation
      const shouldResetLocation = (tenantIdRef.current !== detail.tenantId) && isEqual(
        {
          locationName: detail.locationName,
          holdingName: detail.holdingName,
        },
        {
          locationName: locationFieldName,
          holdingName: name,
        },
      );

      if (shouldResetLocation) {
        clearSelectedLocation();
        onChangeHolding(undefined);
      }
    };

    eventEmitter.on(EVENT_EMITTER_EVENTS.FIELD_INVENTORY_AFFILIATION_CHANGED, callback);

    return () => {
      eventEmitter.off(EVENT_EMITTER_EVENTS.FIELD_INVENTORY_AFFILIATION_CHANGED, callback);
    };
  }, [
    clearSelectedLocation,
    eventEmitter,
    locationFieldName,
    name,
    onChangeHolding,
  ]);

  const isLookupTriggerVisible = !(isDisabled || isNonInteractive);

  if (isLoading || isHoldingsLoading) return <Loading />;

  return (
    selectedLocation
      ? (
        <FieldHoldingLocation
          isNonInteractive={isNonInteractive}
          disabled={isDisabled}
          label={locationLabel}
          location={selectedLocation}
          onClearLocation={clearSelectedLocation}
          required={required}
          locationFieldName={locationFieldName}
        />
      )
      : (
        <div>
          <FieldSelectionFinal
            dataOptions={holdingOptions}
            isNonInteractive={isNonInteractive}
            disabled={isDisabled}
            fullWidth
            id={`field-${name}`}
            key={`field-${name}-${tenantId}`}
            label={holdingLabel}
            marginBottom0
            name={name}
            required={required}
            validate={validate}
            onChange={onChangeHolding}
          />
          {isLookupTriggerVisible && (
            <FindLocation
              id={`holding-location-lookup-${name}`}
              filterRecords={filterLocations}
              searchButtonStyle="link"
              searchLabel={<FormattedMessage id="stripes-acq-components.holding.createFromLocation" />}
              onRecordsSelect={selectLocationFromPlugin}
              tenantId={tenantId}
            />
          )}
        </div>
      )
  );
};

FieldHolding.propTypes = {
  affiliationFieldName: PropTypes.string,
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  instanceId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  labelId: PropTypes.string,
  locationFieldName: PropTypes.string.isRequired,
  locationLabelId: PropTypes.string,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  tenantId: PropTypes.string,
};
