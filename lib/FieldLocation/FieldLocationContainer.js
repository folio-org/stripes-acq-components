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
  getLocationOptions,
} from '../utils';
import FieldLocation from './FieldLocation';

const FieldLocationContainer = ({
  isDisabled,
  labelId,
  locationLookupLabel,
  locationsForDict,
  name,
  onChange,
  prepopulatedLocationsIds,
  required,
  isReduxField,
  validate,
}) => {
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    const locations = prepopulatedLocationsIds?.map(id => find(locationsForDict, { id }));

    setLocationsForSelect(getLocationOptions(locations));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const selectLocationFromPlugin = useCallback(
    (location) => {
      setLocationsForSelect(uniqBy([...locationsForSelect, ...getLocationOptions([location])], 'value'));

      onChange(location);
    },
    [onChange, locationsForSelect],
  );

  if (!locationsForSelect) return null;

  return (
    <FieldLocation
      isDisabled={isDisabled}
      labelId={labelId}
      locationLookupLabel={locationLookupLabel}
      locationsForSelect={locationsForSelect}
      name={name}
      required={required}
      selectLocationFromPlugin={selectLocationFromPlugin}
      isReduxField={isReduxField}
      validate={validate}
    />
  );
};

FieldLocationContainer.propTypes = {
  isDisabled: PropTypes.bool,
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  prepopulatedLocationsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
  isReduxField: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

FieldLocationContainer.defaultProps = {
  isDisabled: false,
  required: false,
  isReduxField: false,
};

export default FieldLocationContainer;
