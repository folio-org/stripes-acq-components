import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { KeyValue } from '@folio/stripes/components';

import { organizationByPropManifest } from '../../manifests';

const OrganizationValue = ({ id, label, mutator }) => {
  const [organization, setOrganization] = useState();

  useEffect(
    () => {
      setOrganization();

      if (id) {
        mutator.organizationValueOrg.GET()
          .then(setOrganization);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  return (
    <KeyValue
      label={label}
      value={organization?.name}
    />
  );
};

OrganizationValue.manifest = Object.freeze({
  organizationValueOrg: organizationByPropManifest,
});

OrganizationValue.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  mutator: PropTypes.object.isRequired,
};

OrganizationValue.defaultProps = {
  label: <FormattedMessage id="stripes-acq-components.organization" />,
};

export default stripesConnect(OrganizationValue);
