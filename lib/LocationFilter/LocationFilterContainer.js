import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { locationsManifest } from '../manifests';
import { getLocationOptions } from '../utils';
import LocationFilter from './LocationFilter';

const LocationFilterContainer = ({ mutator, ...rest }) => {
  const [locationOptions, setLocationOptions] = useState([]);

  useEffect(
    () => {
      mutator.locationFilterLocations.GET()
        .then(locations => {
          setLocationOptions(getLocationOptions(locations));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <LocationFilter
      {...rest}
      options={locationOptions}
    />
  );
};

LocationFilterContainer.manifest = Object.freeze({
  locationFilterLocations: locationsManifest,
});

LocationFilterContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(LocationFilterContainer);
