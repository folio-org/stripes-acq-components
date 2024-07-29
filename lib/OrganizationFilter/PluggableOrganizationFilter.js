import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
} from 'react';
import { useIntl } from 'react-intl';

import { TextField } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import { FilterAccordion } from '../FilterAccordion';
import { useOrganization } from '../hooks';

const PluggableOrganizationFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
  labelId,
  name,
  onChange,
  tenantId,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState();

  useOrganization(activeFilters?.[0], {
    tenantId,
    enabled: !selectedOrganization,
    onSuccess: setSelectedOrganization,
  });

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
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <TextField
        aria-label={label}
        marginBottom0
        type="text"
        value={(activeFilters && activeFilters[0] && selectedOrganization?.name) || ''}
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
        tenantId={tenantId}
      >
        <span>{intl.formatMessage({ id: 'stripes-acq-components.filter.organization.lookupNoSupport' })}</span>
      </Pluggable>
    </FilterAccordion>
  );
};

PluggableOrganizationFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
};

PluggableOrganizationFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default PluggableOrganizationFilter;
