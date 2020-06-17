import React, {
  useMemo,
  useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
  TextField,
} from '@folio/stripes/components';
import { LocationLookup } from '@folio/stripes/smart-components';

import {
  createClearFilterHandler,
} from '../utils';

const LocationFilter = ({ id, name, closedByDefault, activeFilter, labelId, onChange }) => {
  const clearFilter = useMemo(() => createClearFilterHandler(onChange, name), [onChange, name]);

  const selectLocation = useCallback(
    (location) => {
      onChange({ name, values: [location.id] });
    },
    [name, onChange],
  );
  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <Accordion
      id={id}
      closedByDefault={closedByDefault}
      displayClearButton={Boolean(activeFilter)}
      header={FilterAccordionHeader}
      label={label}
      onClearFilter={clearFilter}
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
    </Accordion>
  );
};

LocationFilter.propTypes = {
  activeFilter: PropTypes.string,
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

LocationFilter.defaultProps = {
  closedByDefault: true,
};

export default LocationFilter;
