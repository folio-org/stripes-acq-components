import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import { TextField } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';

import { FilterAccordion } from '../FilterAccordion';
import { useUser } from '../hooks';

const PluggableUserFilter = ({
  id,
  activeFilters,
  closedByDefault = true,
  disabled = false,
  labelId,
  name,
  onChange,
  tenantId,
}) => {
  const [selectedUser, setSelectedUser] = useState();

  useUser(activeFilters?.[0], {
    tenantId,
    enabled: !selectedUser,
    onSuccess: setSelectedUser,
  });

  const selectUser = useCallback(
    (user) => {
      setSelectedUser(user);
      onChange({ name, values: [user.id] });
    },
    [name, onChange],
  );

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      id={id}
      closedByDefault={closedByDefault}
      disabled={disabled}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <TextField
        aria-label={label}
        marginBottom0
        type="text"
        value={(activeFilters && activeFilters[0] && selectedUser && getFullName(selectedUser)) || ''}
        disabled
      />
      <Pluggable
        aria-haspopup="true"
        id={`${id}-button`}
        marginBottom0
        type="find-user"
        searchButtonStyle="link"
        searchLabel={intl.formatMessage({ id: 'ui-plugin-find-user.searchButton.title' })}
        selectUser={selectUser}
        tenantId={tenantId}
      >
        <span>{intl.formatMessage({ id: 'stripes-acq-components.no-ui-plugin-find-user' })}</span>
      </Pluggable>
    </FilterAccordion>
  );
};

PluggableUserFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
};

export default PluggableUserFilter;
