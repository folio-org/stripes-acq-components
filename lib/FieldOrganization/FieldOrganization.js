import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  TextField,
  IconButton,
} from '@folio/stripes/components';

import OrganizationValue from '../Organization/OrganizationValue/OrganizationValue';
import { organizationByPropManifest } from '../manifests';
import { validateRequired } from '../utils';

const FieldOrganization = ({
  onSelect,
  change,
  disabled,
  labelId,
  name,
  required,
  id,
  isNonInteractive,
  mutator,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const selectOrganization = useCallback(
    (organization) => {
      if (onSelect) onSelect(organization);

      setSelectedOrganization(organization);

      change(name, organization.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  useEffect(() => {
    if (id) {
      if (selectedOrganization.id !== id) {
        mutator.fieldOrganizationOrg.GET()
          .then(setSelectedOrganization);
      }
    } else {
      setSelectedOrganization({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const clearOrganization = useCallback(
    () => {
      setSelectedOrganization({});

      change(name, null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
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
  const label = <FormattedMessage id={labelId} />;

  return isNonInteractive ? <OrganizationValue label={label} value={selectedOrganization?.name} /> : (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={label}
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
        validateFields={[]}
        format={() => selectedOrganization.name}
      />

      {!disabled && (
        <div>
          <Pluggable
            id={`${name}-plugin`}
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
  id: PropTypes.string,
  labelId: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
  isNonInteractive: PropTypes.bool,
};

FieldOrganization.defaultProps = {
  disabled: false,
  isNonInteractive: false,
  required: true,
};

FieldOrganization.manifest = {
  fieldOrganizationOrg: organizationByPropManifest,
};

export default stripesConnect(FieldOrganization);
