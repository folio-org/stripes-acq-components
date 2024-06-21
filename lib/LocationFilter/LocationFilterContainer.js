import PropTypes from 'prop-types';

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
  return (
    <LocationFilter
      activeFilter={activeFilter}
      disabled={disabled}
      id={id}
      name={name}
      crossTenant={crossTenant}
      closedByDefault={closedByDefault}
      labelId={labelId}
      onChange={onChange}
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
};

export default LocationFilterContainer;
