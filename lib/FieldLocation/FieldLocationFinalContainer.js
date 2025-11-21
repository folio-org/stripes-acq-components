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
  filterLocations = identity,
  holdingFieldName,
  isDisabled = false,
  isNonInteractive,
  labelId,
  locationLookupLabel,
  locationsForDict,
  name,
  onChange,
  prepopulatedLocationsIds,
  required = false,
  tenantId,
  validate,
}) => {
  const { change } = useForm();
  const { values } = useFormState();
  const [locationsForSelect, setLocationsForSelect] = useState();

  useEffect(() => {
    const locations = [...new Set(prepopulatedLocationsIds)]
      .map((id) => find(
        locationsForDict,
        { id, ...(tenantId ? { tenantId } : {}) },
      ) || { id })
      .sort((a, b) => a.name?.localeCompare(b.name));
    const fieldValue = get(values, name);

    setLocationsForSelect(getLocationOptions(filterLocations(locations, fieldValue && [fieldValue])));

    if (get(values, holdingFieldName)) change(holdingFieldName, undefined);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [filterLocations, tenantId]);

  const selectLocationFromPlugin = useCallback(([location]) => {
    setLocationsForSelect(uniqBy([...locationsForSelect, ...getLocationOptions([location])], 'value'));

    onChange(location, name);
  }, [onChange, locationsForSelect, name]);

  if (!locationsForSelect) return null;

  return (
    <FieldLocationFinal
      fieldComponent={fieldComponent}
      isDisabled={isDisabled}
      isNonInteractive={isNonInteractive}
      labelId={labelId}
      locationLookupLabel={locationLookupLabel}
      locationsForSelect={locationsForSelect}
      name={name}
      required={required}
      selectLocationFromPlugin={selectLocationFromPlugin}
      filterLocations={filterLocations}
      validate={validate}
      tenantId={tenantId}
    />
  );
};

FieldLocationFinalContainer.propTypes = {
  fieldComponent: PropTypes.elementType,
  filterLocations: PropTypes.func,
  holdingFieldName: PropTypes.string,
  isDisabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  prepopulatedLocationsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
  tenantId: PropTypes.string,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

export default FieldLocationFinalContainer;
