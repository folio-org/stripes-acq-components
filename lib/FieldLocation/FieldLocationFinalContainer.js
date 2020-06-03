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
  locationLookupLabel,
  locationsForDict,
  name,
  onChange,
  prepopulatedLocationsIds,
  required,
}) => {
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    const locations = prepopulatedLocationsIds?.map(id => find(locationsForDict, { id })) || [];

    setLocationsForSelect(getLocationOptions(locations));
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
  locationLookupLabel: PropTypes.node,
  locationsForDict: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  prepopulatedLocationsIds: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool,
};

FieldLocationFinalContainer.defaultProps = {
  isDisabled: false,
  required: false,
};

export default FieldLocationFinalContainer;
