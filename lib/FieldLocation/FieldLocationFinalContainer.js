import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  find,
  uniqBy,
} from 'lodash';

import {
  Loading,
} from '@folio/stripes/components';

import {
  getLocationOptions,
} from '../utils';
import FieldLocationFinal from './FieldLocationFinal';

const FieldLocationFinalContainer = ({
  isDisabled,
  labelId,
  locationIds,
  locationLookupLabel,
  locations,
  name,
  onChange,
  required,
}) => {
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    const _locations = locationIds?.map(id => find(locations, { id })) || [];

    setLocationsForSelect(getLocationOptions(_locations));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const selectLocationFromPlugin = useCallback(
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
      isDisabled={isDisabled}
      labelId={labelId}
      locationLookupLabel={locationLookupLabel}
      locationsForSelect={locationsForSelect}
      name={name}
      required={required}
      selectLocationFromPlugin={selectLocationFromPlugin}
    />
  );
};

FieldLocationFinalContainer.propTypes = {
  isDisabled: PropTypes.bool,
  labelId: PropTypes.string,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locationLookupLabel: PropTypes.node,
  locations: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldLocationFinalContainer.defaultProps = {
  isDisabled: false,
  required: false,
};

export default FieldLocationFinalContainer;
