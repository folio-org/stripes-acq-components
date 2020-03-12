import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { locationsManifest } from '../manifests';
import LocationFilter from './LocationFilter';

const LocationFilterContainer = ({
  mutator, id, name, closedByDefault, activeFilter, labelId, onChange,
}) => {
  const [activeLocation, setActiveLocation] = useState();

  useEffect(
    () => {
      setActiveLocation();

      if (activeFilter) {
        mutator.locationFilterLocations.GET({
          params: {
            query: `id == ${activeFilter}`,
          },
        })
          .then(locations => {
            setActiveLocation(locations[0]);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilter],
  );

  return (
    <LocationFilter
      activeFilter={activeLocation?.name}
      id={id}
      name={name}
      closedByDefault={closedByDefault}
      labelId={labelId}
      onChange={onChange}
    />
  );
};

LocationFilterContainer.manifest = Object.freeze({
  locationFilterLocations: locationsManifest,
});

LocationFilterContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  activeFilter: PropTypes.string,
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default stripesConnect(LocationFilterContainer);
