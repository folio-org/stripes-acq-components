import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  TextField,
  IconButton,
} from '@folio/stripes/components';

import { organizationByPropManifest } from '../manifests';
import { validateRequired } from '../utils';

const FieldOrganization = ({
  onSelect,
  change,
  disabled,
  dispatch,
  labelId,
  name,
  required,
  id,
  mutator,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const selectOrganization = useCallback(
    (organization) => {
      if (onSelect) onSelect(organization);

      setSelectedOrganization(organization);

      dispatch(change(name, organization.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  useEffect(() => {
    if (id && selectedOrganization.id !== id) {
      mutator.fieldOrganizationOrg.GET()
        .then(setSelectedOrganization);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const clearOrganization = useCallback(
    () => {
      selectOrganization({ id: null });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, selectOrganization],
  );

  const clearButton = useMemo(
    () => {
      if (selectedOrganization.id && !disabled) {
        return (
          <IconButton
            onClick={clearOrganization}
            icon="times-circle-solid"
            size="small"
          />
        );
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOrganization, disabled],
  );

  return (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={<FormattedMessage id={labelId} />}
        name={name}
        required={required}
        validate={required && validateRequired}
        format={() => selectedOrganization.name}
      />

      {!disabled && (
        <div>
          <Pluggable
            id={`${name}-plug-button`}
            aria-haspopup="true"
            dataKey="organization"
            searchButtonStyle="link"
            searchLabel={<FormattedMessage id="stripes-acq-components.filter.organization.lookup" />}
            selectVendor={selectOrganization}
            type="find-organization"
          >
            <FormattedMessage id="stripes-acq-components.filter.organization.lookupNoSupport" />
          </Pluggable>
        </div>
      )}
    </div>
  );
};

FieldOrganization.propTypes = {
  onSelect: PropTypes.func,
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelId: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
};

FieldOrganization.defaultProps = {
  disabled: false,
  required: true,
};

FieldOrganization.manifest = {
  fieldOrganizationOrg: organizationByPropManifest,
};

export default stripesConnect(FieldOrganization);
