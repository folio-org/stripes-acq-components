import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  TextField,
} from '@folio/stripes/components';
import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';

import { FilterAccordion } from '../FilterAccordion';
import { organizationByPropManifest } from '../manifests';
import { VENDORS_API } from '../constants';

const PluggableOrganizationFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
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
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      label={label}
      name={name}
      onChange={onChange}
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
        disabled={disabled}
        id={`${id}-button`}
        marginBottom0
        searchButtonStyle="link"
        searchLabel={intl.formatMessage({ id: 'stripes-acq-components.filter.organization.lookup' })}
        selectVendor={selectVendor}
        type="find-organization"
      >
        <span>{intl.formatMessage({ id: 'stripes-acq-components.filter.organization.lookupNoSupport' })}</span>
      </Pluggable>
    </FilterAccordion>
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
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PluggableOrganizationFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default stripesConnect(PluggableOrganizationFilter);
