import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
  TextField,
} from '@folio/stripes/components';
import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';

import {
  createClearFilterHandler,
} from '../utils';
import { organizationByPropManifest } from '../manifests';
import { VENDORS_API } from '../constants';

const PluggableOrganizationFilter = ({
  id,
  activeFilters,
  closedByDefault = true,
  labelId,
  mutator,
  name,
  onChange,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  useEffect(
    () => {
      if (activeFilters && activeFilters[0] && !selectedOrganization.name) {
        mutator.filterOrganization.GET({ path: `${VENDORS_API}/${activeFilters[0]}` })
          .then(setSelectedOrganization);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilters],
  );

  const clearFilter = useMemo(() => createClearFilterHandler(onChange, name), [onChange, name]);

  const selectVendor = useCallback(
    (organization) => {
      setSelectedOrganization(organization);
      onChange({ name, values: [organization.id] });
    },
    [name, onChange],
  );

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <Accordion
      id={id}
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters?.length > 0}
      header={FilterAccordionHeader}
      label={label}
      onClearFilter={clearFilter}
    >
      <TextField
        ariaLabel={label}
        marginBottom0
        type="text"
        value={(activeFilters && activeFilters[0] && selectedOrganization.name) || ''}
        disabled
      />

      <Pluggable
        aria-haspopup="true"
        dataKey="organization"
        id={`${id}-button`}
        marginBottom0
        searchButtonStyle="link"
        searchLabel={intl.formatMessage({ id: 'stripes-acq-components.filter.organization.lookup' })}
        selectVendor={selectVendor}
        type="find-organization"
      >
        {intl.formatMessage({ id: 'stripes-acq-components.filter.organization.lookupNoSupport' })}
      </Pluggable>
    </Accordion>
  );
};

PluggableOrganizationFilter.manifest = {
  filterOrganization: {
    ...organizationByPropManifest,
    accumulate: true,
    fetch: false,
  },
};

PluggableOrganizationFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default stripesConnect(PluggableOrganizationFilter);
