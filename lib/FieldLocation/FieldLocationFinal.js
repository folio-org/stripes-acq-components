import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { stripesConnect } from '@folio/stripes/core';
import { LocationLookup } from '@folio/stripes/smart-components';
import {
  IconButton,
  TextField,
} from '@folio/stripes/components';

import { locationByPropManifest } from '../manifests';
import { validateRequired } from '../utils';

const FieldLocationFinal = ({
  locationId,
  labelId,
  mutator,
  name,
  onChange,
  required,
}) => {
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    if (locationId && selectedLocation.id !== locationId) {
      mutator.fieldLocation.GET()
        .then(setSelectedLocation);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const selectLocation = useCallback(
    (location) => {
      setSelectedLocation(location);

      onChange(location);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange],
  );

  const clearLocation = useCallback(
    () => {
      setSelectedLocation({});

      onChange({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange],
  );

  const clearButton = useMemo(
    () => {
      if (selectedLocation.id) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedLocation],
  );

  return (
    <div>
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
      <LocationLookup onLocationSelected={selectLocation} />
    </div>
  );
};

FieldLocationFinal.propTypes = {
  locationId: PropTypes.string,
  labelId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldLocationFinal.defaultProps = {
  required: false,
};

FieldLocationFinal.manifest = {
  fieldLocation: locationByPropManifest,
};

export default stripesConnect(FieldLocationFinal);
