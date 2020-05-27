import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { find } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LocationLookup } from '@folio/stripes/smart-components';
import {
  IconButton,
  TextField,
} from '@folio/stripes/components';

import { FieldSelectFinal } from '../FieldSelect';
import { locationByPropManifest } from '../manifests';
import { validateRequired } from '../utils';
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
  const [selectedLocation, setSelectedLocation] = useState();
  const isPoLineLocation = Boolean(find(locationOptions, { 'value': locationId }));

  useEffect(() => {
    if (locationId && !isPoLineLocation) {
      mutator.fieldLocation.GET()
        .then(setSelectedLocation);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, isPoLineLocation]);

  const selectLocation = useCallback(
    (location) => {
      setSelectedLocation(location);

      onChange(location);
    },
    [onChange],
  );

  const clearLocation = useCallback(
    () => {
      setSelectedLocation();

      onChange({});
    },
    [onChange],
  );

  const clearButton = useMemo(
    () => {
      if (selectedLocation.id && !isDisabled) {
        return (
          <IconButton
            icon="times-circle-solid"
            onClick={clearLocation}
            size="small"
          />
        );
      }

      return null;
    },
    [clearLocation, isDisabled, selectedLocation.id],
  );

  return (
    <div>
      {selectedLocation
        ? (
          <Field
            component={TextField}
            disabled
            endControl={clearButton}
            format={() => selectedLocation.name}
            fullWidth
            hasClearIcon={false}
            id={name}
            label={labelId ? <FormattedMessage id={labelId} /> : ''}
            marginBottom0
            name={name}
            required={required}
            validate={required ? validateRequired : undefined}
          />
        )
        : (
          <FieldSelectFinal
            dataOptions={locationOptions}
            fullWidth
            id={name}
            label={labelId ? <FormattedMessage id={labelId} /> : ''}
            marginBottom0
            name={name}
            required={required}
            validate={required ? validateRequired : undefined}
          />
        )
      }
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
