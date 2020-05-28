import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  find,
  uniqBy,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LocationLookup } from '@folio/stripes/smart-components';
import {
  Loading,
} from '@folio/stripes/components';

import { FieldSelectFinal } from '../FieldSelect';
import { locationByPropManifest } from '../manifests';
import { validateRequired, getLocationOptions } from '../utils';
import { fieldSelectOptionsShape } from '../shapes';

const FieldLocationFinal = ({
  isDisabled,
  labelId,
  locationId,
  locationLookupLabel,
  locationOptions,
  mutator,
  name,
  onChange,
  required,
}) => {
  const [locationsForSelect, setLocationsForSelect] = useState();
  const isLocationFromOptions = Boolean(find(locationOptions, { 'value': locationId }));

  useEffect(() => {
    setLocationsForSelect(locationOptions);

    if (locationId && !isLocationFromOptions) {
      mutator.fieldLocation.GET()
        .then(locationResponse => setLocationsForSelect(prev => [...prev, ...getLocationOptions([locationResponse])]));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, locationOptions, isLocationFromOptions]);

  const selectLocation = useCallback(
    (location) => {
      setLocationsForSelect(prev => uniqBy([...prev, ...getLocationOptions([location])], 'value'));

      onChange(location);
    },
    [onChange],
  );

  if (!locationsForSelect) return <Loading />;

  return (
    <div>
      <FieldSelectFinal
        dataOptions={locationsForSelect}
        fullWidth
        id={name}
        label={labelId ? <FormattedMessage id={labelId} /> : ''}
        marginBottom0
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
      />
      <LocationLookup
        label={locationLookupLabel}
        onLocationSelected={selectLocation}
      />
      {!isDisabled && <LocationLookup onLocationSelected={selectLocation} />}
    </div>
  );
};

FieldLocationFinal.propTypes = {
  isDisabled: PropTypes.bool,
  locationId: PropTypes.string,
  labelId: PropTypes.string,
  locationOptions: fieldSelectOptionsShape,
  locationLookupLabel: PropTypes.node,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldLocationFinal.defaultProps = {
  isDisabled: false,
  required: false,
  locationOptions: [],
};

FieldLocationFinal.manifest = {
  fieldLocation: locationByPropManifest,
};

export default stripesConnect(FieldLocationFinal);
