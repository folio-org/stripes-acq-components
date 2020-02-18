import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
  TextField,
} from '@folio/stripes/components';
import {
  Pluggable,
} from '@folio/stripes/core';

import {
  createClearFilterHandler,
} from '../utils';

const PluggableOrganizationFilter = ({
  id,
  activeFilters = [],
  closedByDefault = true,
  labelId,
  name,
  onChange,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const clearFilter = useMemo(() => createClearFilterHandler(onChange, name), [onChange, name]);

  const selectVendor = useCallback(
    (organization) => {
      setSelectedOrganization(organization);
      onChange({ name, values: [organization.id] });
    },
    [name, onChange],
  );

  return (
    <Accordion
      id={id}
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters.length > 0}
      header={FilterAccordionHeader}
      label={<FormattedMessage id={labelId} />}
      onClearFilter={clearFilter}
    >
      <TextField
        type="text"
        value={(activeFilters[0] && selectedOrganization.name) || ''}
        disabled
      />

      <Pluggable
        aria-haspopup="true"
        dataKey="organization"
        id={`${id}-button`}
        searchButtonStyle="link"
        searchLabel={<FormattedMessage id="stripes-acq-components.filter.organization.lookup" />}
        selectVendor={selectVendor}
        type="find-organization"
      >
        <FormattedMessage id="stripes-acq-components.filter.organization.lookupNoSupport" />
      </Pluggable>
    </Accordion>
  );
};

PluggableOrganizationFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PluggableOrganizationFilter;
