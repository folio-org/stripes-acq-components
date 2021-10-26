import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
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
          .then(setSelectedOrganization)
          .catch(() => setSelectedOrganization({
            id,
            name: intl.formatMessage({ id: 'stripes-acq-components.invalidReference' }),
          }));
      }
    } else {
      setSelectedOrganization({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const clearOrganization = useCallback(
    () => {
      selectOrganization({ id: null });
    },
    [selectOrganization],
  );

  const clearLabel = intl.formatMessage({ id: 'stripes-components.clearThisField' });
  const clearButton = useMemo(
    () => {
      if (selectedOrganization.id && !disabled) {
        return (
          <IconButton
            ariaLabel={clearLabel}
            onClick={clearOrganization}
            icon="times-circle-solid"
            size="small"
          />
        );
      }

      return null;
    },
    [selectedOrganization.id, disabled, clearLabel, clearOrganization],
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
        data-testid="field-org"
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
