import get from 'lodash/get';
import identity from 'lodash/identity';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import {
  useMemo,
  useCallback,
  useState,
  useEffect,
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
  required = false,
}) => {
  const {
    isLoading,
    holdings,
  } = useInstanceHoldings(instanceId);

  const [selectedLocation, setSelectedLocation] = useState();
  const [isHoldingIdValid, setIsHoldingIdValid] = useState(true);
  const { initialValues, values } = useFormState();
  const initialHoldingId = get(initialValues, name);
  const locationLabel = locationLabelId ? <FormattedMessage id={locationLabelId} /> : '';
  const holdingLabel = labelId ? <FormattedMessage id={labelId} /> : '';
  const validate = required ? validateRequired : undefined;

  const initialHolding = useMemo(() => {
    return holdings.find(({ id }) => id === initialHoldingId);
  }, [holdings, initialHoldingId]);

  const locationsMap = useMemo(() => keyBy(locationsForDict, 'id'), [locationsForDict]);

  useEffect(() => {
    if (!initialHoldingId) {
      const locationId = get(values, locationFieldName);
      const location = locationsMap[locationId];

      setSelectedLocation(location);
    }
  }, []);

  useEffect(() => {
    setIsHoldingIdValid(!initialHoldingId || holdings.some(({ id }) => id === initialHoldingId));
  }, [holdings, initialHoldingId]);

  const holdingOptions = useMemo(() => {
    const holdingsToSelect = isHoldingIdValid ? holdings : [...holdings, { id: initialHoldingId, ...initialHolding }];
    const initPermanentLocation = initialHolding?.permanentLocationId;

    return getHoldingOptions(
      filterHoldings(holdingsToSelect, initPermanentLocation && [initPermanentLocation]),
      locationsMap,
    );
  }, [filterHoldings, initialHolding, isHoldingIdValid, holdings, initialHoldingId, locationsMap]);

  const onChangeHolding = useCallback((holdingId) => {
    const locationId = holdings.find(({ id }) => id === holdingId).permanentLocationId;

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

  if (isLoading) return <Loading />;

  return (
    selectedLocation
      ? (
        <FieldHoldingLocation
          isNonInteractive={isDisabled}
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
            isNonInteractive={isDisabled}
            fullWidth
            id={`field-${name}`}
            label={holdingLabel}
            marginBottom0
            name={name}
            required={required}
            validate={validate}
            onChange={onChangeHolding}
          />
          {!isDisabled && (
            <FindLocation
              filterRecords={filterLocations}
              searchButtonStyle="link"
              searchLabel={<FormattedMessage id="stripes-acq-components.holding.createFromLocation" />}
              onRecordsSelect={selectLocationFromPlugin}
            />
          )}
        </div>
      )
  );
};

FieldHolding.propTypes = {
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  instanceId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  labelId: PropTypes.string,
  locationFieldName: PropTypes.string.isRequired,
  locationLabelId: PropTypes.string,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldHolding.defaultProps = {
  filterHoldings: identity,
  filterLocations: identity,
};
