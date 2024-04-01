import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { TextField } from '@folio/stripes/components';
import { LocationLookup } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import { FindLocation } from '../FindLocation';

const LocationFilter = ({
  id,
  name,
  closedByDefault,
  activeFilter,
  labelId,
  onChange,
  disabled,
}) => {
  const selectLocation = useCallback(([location]) => {
    onChange({ name, values: [location.id] });
  }, [name, onChange]);

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
        aria-label={label}
        type="text"
        value={activeFilter}
        disabled
      />
      {/* <LocationLookup
        marginBottom0
        onLocationSelected={selectLocation}
      /> */}
      <FindLocation
        id="fund-locations-filter"
        searchLabel={<FormattedMessage id="stripes-smart-components.ll.locationLookup" />}
        onRecordsSelect={selectLocation}
        searchButtonStyle="link"
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
