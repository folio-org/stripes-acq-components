import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Loading,
} from '@folio/stripes/components';

import {
  locationsManifest,
} from '../manifests';
import {
  batchFetch,
  getLocationOptions,
} from '../utils';
import FieldLocationFinal from './FieldLocationFinal';

const FieldLocationFinalContainer = ({
  labelId,
  locationIds,
  locationLookupLabel,
  mutator,
  name,
  onChange,
  required,
}) => {
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    setLocationsForSelect();

    batchFetch(mutator.fieldLocations, locationIds)
      .then(locationsResponse => setLocationsForSelect(getLocationOptions(locationsResponse)))
      .catch(() => setLocationsForSelect([]));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const selectLocation = useCallback(
    (location) => {
      setLocationsForSelect(prev => uniqBy([...prev, ...getLocationOptions([location])], 'value'));

      onChange(location);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange],
  );

  if (!locationsForSelect) return <Loading />;

  return (
    <FieldLocationFinal
      labelId={labelId}
      locationLookupLabel={locationLookupLabel}
      locationsForSelect={locationsForSelect}
      name={name}
      required={required}
      selectLocation={selectLocation}
    />
  );
};

FieldLocationFinalContainer.propTypes = {
  labelId: PropTypes.string,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locationLookupLabel: PropTypes.node,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldLocationFinalContainer.defaultProps = {
  required: false,
};

FieldLocationFinalContainer.manifest = {
  fieldLocations: {
    ...locationsManifest,
    fetch: false,
  },
};

export default stripesConnect(FieldLocationFinalContainer);
