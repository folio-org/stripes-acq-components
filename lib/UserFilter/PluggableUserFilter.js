import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
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
import { getFullName } from '@folio/stripes/util';

import {
  createClearFilterHandler,
} from '../utils';
import { userManifest } from '../manifests';

const PluggableUserFilter = ({
  id,
  activeFilters,
  closedByDefault = true,
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

  const clearFilter = useMemo(() => createClearFilterHandler(onChange, name), [onChange, name]);

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
    </Accordion>
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
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default stripesConnect(PluggableUserFilter);
