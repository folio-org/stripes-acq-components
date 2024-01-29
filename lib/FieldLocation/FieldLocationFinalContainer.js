import find from 'lodash/find';
import get from 'lodash/get';
import identity from 'lodash/identity';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  useForm,
  useFormState,
} from 'react-final-form';

import { getLocationOptions } from '../utils';
import FieldLocationFinal from './FieldLocationFinal';

const FieldLocationFinalContainer = ({
  fieldComponent,
  filterLocations,
  isDisabled,
  labelId,
  locationLookupLabel,
  locationsForDict,
  name,
  holdingFieldName,
  onChange,
  prepopulatedLocationsIds,
  required,
  validate,
}) => {
  const { change } = useForm();
  const { values } = useFormState();
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    const locations = prepopulatedLocationsIds?.map(id => find(locationsForDict, { id }));
    const fieldValue = get(values, name);

    setLocationsForSelect(getLocationOptions(filterLocations(locations, fieldValue && [fieldValue])));

    if (get(values, holdingFieldName)) change(holdingFieldName, undefined);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [filterLocations]);

  const selectLocationFromPlugin = useCallback(([location]) => {
    setLocationsForSelect(uniqBy([...locationsForSelect, ...getLocationOptions([location])], 'value'));

    onChange(location, name);
  }, [onChange, locationsForSelect, name]);

  if (!locationsForSelect) return null;

  return (
    <FieldLocationFinal
      fieldComponent={fieldComponent}
      isDisabled={isDisabled}
      labelId={labelId}
      locationLookupLabel={locationLookupLabel}
      locationsForSelect={locationsForSelect}
      name={name}
      required={required}
      selectLocationFromPlugin={selectLocationFromPlugin}
      filterLocations={filterLocations}
      validate={validate}
    />
  );
};

FieldLocationFinalContainer.propTypes = {
  fieldComponent: PropTypes.elementType,
  filterLocations: PropTypes.func,
  holdingFieldName: PropTypes.string,
  isDisabled: PropTypes.bool,
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  prepopulatedLocationsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

FieldLocationFinalContainer.defaultProps = {
  filterLocations: identity,
  isDisabled: false,
  required: false,
};

export default FieldLocationFinalContainer;
