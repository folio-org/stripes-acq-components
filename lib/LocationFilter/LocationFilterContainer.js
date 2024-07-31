import PropTypes from 'prop-types';

import { useLocationsQuery } from '../hooks';
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
  tenantId,
}) => {
  const {
    locations,
    isLoading,
  } = useLocationsQuery({
    consortium: crossTenant,
    tenantId,
  });

  return (
    <LocationFilter
      activeFilter={activeFilter}
      disabled={disabled}
      id={id}
      isLoading={isLoading}
      name={name}
      crossTenant={crossTenant}
      closedByDefault={closedByDefault}
      labelId={labelId}
      locations={locations}
      onChange={onChange}
      tenantId={tenantId}
    />
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
  tenantId: PropTypes.string,
};

export default LocationFilterContainer;
