import React, {
  useCallback,
  useEffect,
  useState,
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
import { getFullName } from '@folio/stripes/util';

import { FilterAccordion } from '../FilterAccordion';
import { userManifest } from '../manifests';

const PluggableUserFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
  labelId,
  name,
  onChange,
  mutator,
}) => {
  const [selectedUser, setSelectedUser] = useState();

  useEffect(
    () => {
      if (activeFilters && activeFilters[0] && !selectedUser) {
        mutator.filterUserManifest.GET({ path: `${userManifest.path}/${activeFilters[0]}` })
          .then(setSelectedUser);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilters],
  );

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
        ariaLabel={label}
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
      >
        <span>{intl.formatMessage({ id: 'stripes-acq-components.no-ui-plugin-find-user' })}</span>
      </Pluggable>
    </FilterAccordion>
  );
};

PluggableUserFilter.manifest = {
  filterUserManifest: {
    ...userManifest,
    accumulate: true,
    fetch: false,
  },
};

PluggableUserFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PluggableUserFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default stripesConnect(PluggableUserFilter);
