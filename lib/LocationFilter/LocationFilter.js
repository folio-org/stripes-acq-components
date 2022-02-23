import React, {
  useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  TextField,
} from '@folio/stripes/components';
import { LocationLookup } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';

const LocationFilter = ({ id, name, closedByDefault, activeFilter, labelId, onChange, disabled }) => {
  const selectLocation = useCallback(
    (location) => {
      onChange({ name, values: [location.id] });
    },
    [name, onChange],
  );
  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <FilterAccordion
      activeFilters={activeFilter}
      id={id}
      closedByDefault={closedByDefault}
      disabled={disabled}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <TextField
        ariaLabel={label}
        type="text"
        value={activeFilter}
        disabled
      />
      <LocationLookup
        marginBottom0
        onLocationSelected={selectLocation}
      />
    </FilterAccordion>
  );
};

LocationFilter.propTypes = {
  activeFilter: PropTypes.string,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

LocationFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default LocationFilter;
