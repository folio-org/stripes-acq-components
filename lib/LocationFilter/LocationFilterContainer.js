import PropTypes from 'prop-types';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import {
  ConsortiumLocationsContextProvider,
  LocationsContextProvider,
} from '../contexts';

import LocationFilter from './LocationFilter';

const LocationFilterContainer = ({
  id,
  name,
  closedByDefault,
  crossTenant = false,
  activeFilter,
  labelId,
  onChange,
  disabled,
}) => {
  const stripes = useStripes();

  const isCrossTenantEnabled = crossTenant && checkIfUserInCentralTenant(stripes);

  const ContextProvider = isCrossTenantEnabled
    ? ConsortiumLocationsContextProvider
    : LocationsContextProvider;

  return (
    <ContextProvider>
      <LocationFilter
        activeFilter={activeFilter}
        disabled={disabled}
        id={id}
        name={name}
        crossTenant={isCrossTenantEnabled}
        closedByDefault={closedByDefault}
        labelId={labelId}
        onChange={onChange}
      />
    </ContextProvider>
  );
};

LocationFilterContainer.propTypes = {
  activeFilter: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  crossTenant: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LocationFilterContainer;
