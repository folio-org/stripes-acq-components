import get from 'lodash/get';
import identity from 'lodash/identity';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';

import { FieldSelectionFinal } from '../FieldSelection';
import { FindLocation } from '../FindLocation';
import { useInstanceHoldings } from '../hooks';
import { validateRequired } from '../utils';
import FieldHoldingLocation from './FieldHoldingLocation';
import { getHoldingOptions } from './utils';

export const FieldHolding = ({
  affiliationFieldName,
  filterHoldings,
  filterLocations,
  instanceId,
  labelId,
  locationFieldName,
  locationLabelId,
  locationsForDict,
  name,
  onChange,
  isDisabled = false,
  isNonInteractive = false,
  required = false,
  tenantId,
}) => {
  const {
    isLoading,
    holdings,
  } = useInstanceHoldings(instanceId, { tenantId });

  const [selectedLocation, setSelectedLocation] = useState();
  const [isHoldingIdValid, setIsHoldingIdValid] = useState(true);
  const { initialValues, values } = useFormState();
  const initialTenantId = get(initialValues, affiliationFieldName);
  const initialHoldingId = get(initialValues, name);
  const selectedHoldingId = get(values, name);
  const locationLabel = locationLabelId ? <FormattedMessage id={locationLabelId} /> : '';
  const holdingLabel = labelId ? <FormattedMessage id={labelId} /> : '';
  const validate = required ? validateRequired : undefined;
  const previousTenantId = useRef(tenantId);

  const locationsMap = useMemo(() => keyBy(locationsForDict, 'id'), [locationsForDict]);

  useEffect(() => {
    if (!initialHoldingId) {
      const locationId = get(values, locationFieldName);
      const location = locationsMap[locationId];

      setSelectedLocation(location);
    }
  }, []);

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

  useEffect(() => {
    if (previousTenantId.current !== tenantId) {
      clearSelectedLocation();
      onChangeHolding(undefined);
      previousTenantId.current = tenantId;
    }
  }, [clearSelectedLocation, onChangeHolding, tenantId]);

  const isLookupTriggerVisible = !(isDisabled || isNonInteractive);

  if (isLoading) return <Loading />;

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

FieldHolding.defaultProps = {
  filterHoldings: identity,
  filterLocations: identity,
};
